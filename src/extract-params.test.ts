import { extractParams } from "./extract-params";

test("extractParams", () => {
  expect(extractParams("sensors/+sensorName/p1", "sensors/A/p1")).toEqual({
    sensorName: "A",
  });

  expect(
    extractParams("sensors/+sensorName/#other", "sensors/A/p1/t1/t2")
  ).toEqual({
    sensorName: "A",
    other: ["p1", "t1", "t2"],
  });

  expect(extractParams("sensors/+sensorName/#other", "sensors/A")).toEqual({
    sensorName: "A",
    other: [],
  });
});
