import { match } from "./match";

test("match", () => {
  expect(match("sensors/A", "sensors/A")).toBeTruthy();
  expect(match("sensors/A/+", "sensors/A/1")).toBeTruthy();
  expect(match("sensors/A/+", "sensors/A/2")).toBeTruthy();
  expect(match("sensors/A/#", "sensors/A")).toBeTruthy();
  expect(match("sensors/A/#", "sensors/A/1")).toBeTruthy();
  expect(match("sensors/A/#", "sensors/A/2")).toBeTruthy();
  expect(match("sensors/A/#", "sensors/A/1/2")).toBeTruthy();
});

test("not match", () => {
  expect(match("sensors/A/+", "sensors/A")).toBeFalsy();
  expect(match("sensors/A/+", "a")).toBeFalsy();
  expect(match("sensors/A", "sensors/B")).toBeFalsy();
  expect(match("sensors/A", "a/A")).toBeFalsy();
  expect(match("sensors/A", "sa#ssqs")).toBeFalsy();
});
