import { TOPIC_SEPARATOR, WILDCARD_SINGLE, WILDCARD_ALL } from "./constant";
import { match } from "./match";

/**
 * 根據 pattern 提取對應的參數
 *
 * @param pattern
 * @param topic
 */
export function extractParams(
  pattern: string,
  topic: string
): { [paramName: string]: string | string[] } {
  const isMatch = match(pattern, topic);
  if (!isMatch) throw new Error("topic does not match this pattern");

  const result: { [key: string]: string | string[] } = {};
  const patternSegments = pattern.split(TOPIC_SEPARATOR);
  const topicSegments = topic.split(TOPIC_SEPARATOR);

  for (let i = 0; i < patternSegments.length; i++) {
    const patternSegment = patternSegments[i];
    const segmentFirstChar = patternSegment[0];

    if (patternSegment.length === 1) {
      continue;
    }

    if (segmentFirstChar === WILDCARD_ALL) {
      result[patternSegment.slice(1)] = topicSegments.slice(i);
      break;
    } else if (segmentFirstChar === WILDCARD_SINGLE) {
      result[patternSegment.slice(1)] = topicSegments[i];
    }
  }

  return result;
}
