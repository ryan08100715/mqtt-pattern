export class MqttPattern {
  static readonly TOPIC_SEPARATOR = "/";
  static readonly WILDCARD_ALL = "#";
  static readonly WILDCARD_SINGLE = "+";

  static create(pattern: string): MqttPattern {
    const isValidPattern = this.checkPatternFormat(pattern);
    if (!isValidPattern) throw new Error("Invalid pattern format");

    return new MqttPattern(pattern);
  }

  /**
   * 檢查 pattern 是否符合格式
   *
   * 格式限制：
   * 1. 長度至少大於等於1
   * 2. 頭尾禁用 "/"
   * 3. 每個層級禁用空字串
   * 4. 通用符號(#、+)必須為該層級的第一個字元
   * 5. 通用符號(#)必須為最後一個層級
   */
  static checkPatternFormat(pattern: string): boolean {
    // 長度至少大於等於1
    if (pattern.length < 1) return false;

    // 頭尾禁用 "/"
    if (pattern[0] === "/" || pattern[pattern.length - 1] === "/") return false;

    const segments = pattern.split(MqttPattern.TOPIC_SEPARATOR);

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const segmentFirstChar = segment[0];

      if (segmentFirstChar === MqttPattern.WILDCARD_ALL) {
        // 通用符號(#)必須為最後一個層級
        if (i === segments.length - 1) {
          return true;
        } else {
          return false;
        }
      }

      if (segmentFirstChar === MqttPattern.WILDCARD_SINGLE) {
        continue;
      }

      // 每個層級禁用空字串
      if (segment === "") return false;

      // 通用符號(#、+)必須為該層級的第一個字元
      const wildcardAllIndex = segment.indexOf(MqttPattern.WILDCARD_ALL);
      const wildcardAllIsExist = wildcardAllIndex >= 0;
      if (wildcardAllIsExist) return false;
      const wildcardSingleIndex = segment.indexOf(MqttPattern.WILDCARD_SINGLE);
      const wildcardSingleIsExist = wildcardSingleIndex >= 0;
      if (wildcardSingleIsExist) return false;
    }

    return true;
  }

  private patternSegments: string[];

  private constructor(pattern: string) {
    this.patternSegments = pattern.split(MqttPattern.TOPIC_SEPARATOR);

    // 優化
    this.extractParamsName = this.memoize(this.extractParamsName.bind(this));
    this.getPatternWithoutParamsName = this.memoize(
      this.getPatternWithoutParamsName.bind(this)
    );
  }

  /**
   * 判斷 topic 是否匹配 pattern
   */
  public match(topic: string): boolean {
    const topicSegments = topic.split(MqttPattern.TOPIC_SEPARATOR);

    for (let i = 0; i < this.patternSegments.length; i++) {
      const patternSegment = this.patternSegments[i];
      const topicSegment = topicSegments[i];
      const patternFirstChar = patternSegment[0]; // 該pattern的第一個字元

      // 如果為多層次通配符，則通過
      if (patternFirstChar === MqttPattern.WILDCARD_ALL) {
        return true;
      }

      // 如果為單層次通配符
      if (patternFirstChar === MqttPattern.WILDCARD_SINGLE) {
        if (topicSegment) {
          continue;
        } else {
          return false;
        }
      }

      // 字串匹配
      if (patternSegment === topicSegment) {
        continue;
      } else {
        return false;
      }
    }

    return this.patternSegments.length === topicSegments.length;
  }

  /**
   * 根據 pattern 提取對應的參數
   */
  public extractParams(topic: string): {
    [paramName: string]: string | string[];
  } {
    const isMatch = this.match(topic);
    if (!isMatch) throw new Error("topic does not match this pattern");

    const result: { [key: string]: string | string[] } = {};
    const topicSegments = topic.split(MqttPattern.TOPIC_SEPARATOR);

    for (let i = 0; i < this.patternSegments.length; i++) {
      const patternSegment = this.patternSegments[i];
      const segmentFirstChar = patternSegment[0];

      if (patternSegment.length === 1) {
        continue;
      }

      if (segmentFirstChar === MqttPattern.WILDCARD_ALL) {
        result[patternSegment.slice(1)] = topicSegments.slice(i);
        break;
      } else if (segmentFirstChar === MqttPattern.WILDCARD_SINGLE) {
        result[patternSegment.slice(1)] = topicSegments[i];
      }
    }

    return result;
  }

  /**
   * 提取 pattern 的所有參數名稱
   */
  public extractParamsName(): string[] {
    const result = [];

    for (const segment of this.patternSegments) {
      if (segment.length === 1) {
        continue;
      }

      const segmentFirstChar = segment[0];

      if (
        segmentFirstChar === MqttPattern.WILDCARD_SINGLE ||
        segmentFirstChar === MqttPattern.WILDCARD_ALL
      ) {
        result.push(segment.slice(1));
      }
    }

    return result;
  }

  /**
   * 將參數填入 pattern
   */
  public fillParams(params: {
    [paramName: string]: string | string[];
  }): string {
    const result = [];

    for (let i = 0; i < this.patternSegments.length; i++) {
      const patternSegment = this.patternSegments[i];
      const segmentFirstChar = patternSegment[0];
      const paramName = patternSegment.slice(1);
      const paramValue: string | string[] | undefined = params[paramName];

      if (segmentFirstChar === MqttPattern.WILDCARD_ALL) {
        if (!paramName) throw new Error("wildcard沒有名字");

        if (typeof paramValue === "string") {
          result.push(paramValue);
        } else if (Array.isArray(paramValue)) {
          result.push(paramValue.join(MqttPattern.TOPIC_SEPARATOR));
        } else {
          throw new Error(`參數${paramName}的填充值不存在`);
        }
      } else if (segmentFirstChar === MqttPattern.WILDCARD_SINGLE) {
        if (!paramName) throw new Error("wildcard沒有名字");

        if (typeof paramValue === "string") {
          result.push(paramValue);
        } else {
          throw new Error(`參數${paramName}的填充值不存在 or 類型非字串`);
        }
      } else {
        result.push(patternSegment);
      }
    }

    return result.join(MqttPattern.TOPIC_SEPARATOR);
  }

  /**
   * 取得沒有參數名稱的 pattern
   */
  public getPatternWithoutParamsName(): string {
    const cleanedSegments = [];

    for (let i = 0; i < this.patternSegments.length; i++) {
      const patternSegment = this.patternSegments[i];
      const segmentFirstChar = patternSegment[0];

      if (segmentFirstChar === MqttPattern.WILDCARD_ALL) {
        cleanedSegments.push(MqttPattern.WILDCARD_ALL);
      } else if (segmentFirstChar === MqttPattern.WILDCARD_SINGLE) {
        cleanedSegments.push(MqttPattern.WILDCARD_SINGLE);
      } else {
        cleanedSegments.push(patternSegment);
      }
    }

    return cleanedSegments.join(MqttPattern.TOPIC_SEPARATOR);
  }

  /**
   * function result cache
   */
  private memoize(func: () => any): () => any {
    let result: string | undefined = undefined;

    return () => {
      if (result) {
        return result;
      } else {
        const _result = func();
        result = _result;

        return result;
      }
    };
  }
}
