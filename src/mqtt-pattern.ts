const SEPARATOR = "/";
const WILDCARD_SINGLE = "+";
const WILDCARD_ALL = "#";

/**
 * 檢查 pattern 是否符合格式
 *
 * 1. 長度至少大於等於1
 * 2. 頭尾禁用 "/"
 * 3. 每個層級禁用空字串
 * 4. 通用符號(#、+)必須為該層級的第一個字元
 * 5. 通用符號(#)必須為最後一個層級
 *
 * @param pattern 要檢查的 pattern
 */
export function checkPatternFormat(pattern: string): boolean {
  // 長度至少大於等於1
  if (pattern.length < 1) return false;

  // 頭尾禁用 "/"
  if (pattern[0] === "/" || pattern[pattern.length - 1] === "/") return false;

  const segments = pattern.split(SEPARATOR);

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const segmentFirstChar = segment[0];

    if (segmentFirstChar === WILDCARD_ALL) {
      // 通用符號(#)必須為最後一個層級
      if (i === segments.length - 1) {
        return true;
      } else {
        return false;
      }
    }

    if (segmentFirstChar === WILDCARD_SINGLE) {
      continue;
    }

    // 每個層級禁用空字串
    if (segment === "") return false;

    // 通用符號(#、+)必須為該層級的第一個字元
    const wildcardAllIndex = segment.indexOf(WILDCARD_ALL);
    const wildcardAllIsExist = wildcardAllIndex >= 0;
    if (wildcardAllIsExist) return false;
    const wildcardSingleIndex = segment.indexOf(WILDCARD_SINGLE);
    const wildcardSingleIsExist = wildcardSingleIndex >= 0;
    if (wildcardSingleIsExist) return false;
  }

  return true;
}
