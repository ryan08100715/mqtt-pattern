import { removeParamsName } from "./remove-params-name";

test("removeParamsName", () => {
  expect(removeParamsName("sensors/+sensorName/p1")).toEqual("sensors/+/p1");
  expect(removeParamsName("sensors/+sensorName/+topic")).toEqual("sensors/+/+");
  expect(removeParamsName("sensors/+sensorName/#other")).toEqual("sensors/+/#");
  expect(removeParamsName("sensors/sensorName/p1/#")).toEqual(
    "sensors/sensorName/p1/#"
  );
  expect(removeParamsName("sensors/+/p1")).toEqual("sensors/+/p1");
});
