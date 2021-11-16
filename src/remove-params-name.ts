import { TOPIC_SEPARATOR, WILDCARD_SINGLE, WILDCARD_ALL } from "./constant";
import { checkPatternFormat } from "./check-pattern-format";

/**
 * 移除 pattern 的參數名稱
 *
 * @param pattern 要移除的 pattern
 */
export function removeParamsName(pattern: string): string {
  const isValidPattern = checkPatternFormat(pattern);
  if (!isValidPattern) throw new Error("Invalid pattern format");

  const patternSegments = pattern.split(TOPIC_SEPARATOR);
  const cleanedSegments = [];

  for (let i = 0; i < patternSegments.length; i++) {
    const patternSegment = patternSegments[i];
    const segmentFirstChar = patternSegment[0];

    if (segmentFirstChar === WILDCARD_ALL) {
      cleanedSegments.push(WILDCARD_ALL);
    } else if (segmentFirstChar === WILDCARD_SINGLE) {
      cleanedSegments.push(WILDCARD_SINGLE);
    } else {
      cleanedSegments.push(patternSegment);
    }
  }

  return cleanedSegments.join(TOPIC_SEPARATOR);
}
