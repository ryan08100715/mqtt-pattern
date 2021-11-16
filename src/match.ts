import { TOPIC_SEPARATOR, WILDCARD_SINGLE, WILDCARD_ALL } from "./constant";
import { checkPatternFormat } from "./check-pattern-format";

/**
 * 判斷 topic 是否匹配 pattern
 *
 * @param pattern 要匹配的 pattern
 * @param topic 要判斷的 topic
 */
export function match(pattern: string, topic: string): boolean {
  const isValidPattern = checkPatternFormat(pattern);
  if (!isValidPattern) throw new Error("invalid pattern format");

  // 根據 TOPIC_SEPARATOR 分割
  const patternSegments = pattern.split(TOPIC_SEPARATOR);
  const topicSegments = topic.split(TOPIC_SEPARATOR);

  for (let i = 0; i < patternSegments.length; i++) {
    const patternSegment = patternSegments[i];
    const topicSegment = topicSegments[i];
    const patternFirstChar = patternSegment[0]; // 該pattern的第一個字元

    // 如果為多層次通配符，則通過
    if (patternFirstChar === WILDCARD_ALL) {
      return true;
    }

    // 如果為單層次通配符
    if (patternFirstChar === WILDCARD_SINGLE) {
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

  return true;
}
