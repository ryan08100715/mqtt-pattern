import { extractParamsName } from "./extract-params-name";

test("extractParamsName", () => {
  expect(extractParamsName("sensors/+sensorName/p1")).toEqual(["sensorName"]);
  expect(extractParamsName("sensors/+sensorName/+topic")).toEqual([
    "sensorName",
    "topic",
  ]);
  expect(extractParamsName("sensors/+sensorName/#other")).toEqual([
    "sensorName",
    "other",
  ]);
  expect(extractParamsName("sensors/sensorName/p1/#")).toEqual([]);
  expect(extractParamsName("sensors/+/p1")).toEqual([]);
});
