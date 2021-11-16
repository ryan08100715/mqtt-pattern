import { TOPIC_SEPARATOR, WILDCARD_SINGLE, WILDCARD_ALL } from "./constant";
import { checkPatternFormat } from "./check-pattern-format";

/**
 * 將參數填入 pattern
 * @param pattern
 * @param params 參數
 */
export function fillParams(
  pattern: string,
  params: { [paramName: string]: string | string[] }
): string {
  const isValidPattern = checkPatternFormat(pattern);
  if (!isValidPattern) throw new Error("Invalid pattern format");

  const patternSegments = pattern.split(TOPIC_SEPARATOR);
  const result = [];

  for (let i = 0; i < patternSegments.length; i++) {
    const patternSegment = patternSegments[i];
    const segmentFirstChar = patternSegment[0];
    const paramName = patternSegment.slice(1);
    const paramValue: string | string[] | undefined = params[paramName];

    if (segmentFirstChar === WILDCARD_ALL) {
      if (!paramName) throw new Error("wildcard沒有名字");

      if (typeof paramValue === "string") {
        result.push(paramValue);
      } else if (Array.isArray(paramValue)) {
        result.push(paramValue.join(TOPIC_SEPARATOR));
      } else {
        throw new Error(`參數${paramName}的填充值不存在`);
      }
    } else if (segmentFirstChar === WILDCARD_SINGLE) {
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

  return result.join(TOPIC_SEPARATOR);
}
