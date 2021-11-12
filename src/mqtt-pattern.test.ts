import { checkPatternFormat } from "./mqtt-pattern";

test("長度至少大於等於1", () => {
  // 長度大於1
  expect(checkPatternFormat("s")).toBeTruthy();
  expect(checkPatternFormat("sensors")).toBeTruthy();
  expect(checkPatternFormat("sensors/A")).toBeTruthy();
  expect(checkPatternFormat("#")).toBeTruthy();
  expect(checkPatternFormat("+")).toBeTruthy();

  // 長度小於1
  expect(checkPatternFormat("")).toBeFalsy();
});

test("頭尾禁用/", () => {
  // 頭尾/
  expect(checkPatternFormat("sensors/A/")).toBeFalsy();
  expect(checkPatternFormat("/sensors/A")).toBeFalsy();

  // 非頭尾/
  expect(checkPatternFormat("sensors/A")).toBeTruthy();
});

test("每個層級禁用空字串", () => {
  expect(checkPatternFormat("sensors//A")).toBeFalsy();
  expect(checkPatternFormat("sensors/A//B")).toBeFalsy();
});

test("通用符號(#、+)必須為該層級的第一個字元", () => {
  expect(checkPatternFormat("sensors/+A/#B")).toBeTruthy();
  expect(checkPatternFormat("sensors/+A/B")).toBeTruthy();
  expect(checkPatternFormat("sensors/A/#B")).toBeTruthy();
  expect(checkPatternFormat("sensors/abc+")).toBeFalsy();
  expect(checkPatternFormat("sensors/abc#")).toBeFalsy();
});

test("通用符號(#)必須為最後一個層級", () => {
  expect(checkPatternFormat("sensors/A/#")).toBeTruthy();
  expect(checkPatternFormat("sensors/#/+")).toBeFalsy();
  expect(checkPatternFormat("sensors/#/B")).toBeFalsy();
});
