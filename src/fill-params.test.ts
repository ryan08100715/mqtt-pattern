import { fillParams } from "./fill-params";

test("fillParams", () => {
  expect(
    fillParams("sensors/+sensorName/p1", { sensorName: "sensorA" })
  ).toEqual("sensors/sensorA/p1");
  expect(
    fillParams("sensors/+sensorName/+topic", {
      sensorName: "sensorA",
      topic: "T1",
    })
  ).toEqual("sensors/sensorA/T1");
  expect(
    fillParams("sensors/+sensorName/#other", {
      sensorName: "sensorA",
      other: ["T1", "P1", "P2"],
    })
  ).toEqual("sensors/sensorA/T1/P1/P2");
  expect(() =>
    fillParams("sensors/+sensorName/#other", {
      sensorName: "sensorA",
    })
  ).toThrow();
});
