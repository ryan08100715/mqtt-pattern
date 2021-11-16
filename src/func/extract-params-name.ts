import { TOPIC_SEPARATOR, WILDCARD_SINGLE, WILDCARD_ALL } from "./constant";
import { checkPatternFormat } from "./check-pattern-format";

/**
 * 提取參數名稱
 *
 * @param pattern 要提取的 pattern
 */
export function extractParamsName(pattern: string): string[] {
  const isValidPattern = checkPatternFormat(pattern);
  if (!isValidPattern) throw new Error("invalid pattern format");

  const result = [];
  const segments = pattern.split(TOPIC_SEPARATOR);

  for (const segment of segments) {
    if (segment.length === 1) {
      continue;
    }

    const segmentFirstChar = segment[0];

    if (
      segmentFirstChar === WILDCARD_SINGLE ||
      segmentFirstChar === WILDCARD_ALL
    ) {
      result.push(segment.slice(1));
    }
  }

  return result;
}
