import { MqttPattern } from "./mqtt-pattern";

test("sensors/s1/t1", () => {
  const mqttPattern = MqttPattern.create("sensors/s1/t1");

  expect(mqttPattern.match("sensors/s1/t1")).toBeTruthy();
  expect(mqttPattern.match("sensors/s1/t1/t2")).toBeFalsy();
  expect(mqttPattern.extractParams("sensors/s1/t1")).toEqual({});
  expect(mqttPattern.extractParamsName()).toEqual([]);
  expect(mqttPattern.getPatternWithoutParamsName()).toEqual("sensors/s1/t1");
});

test("sensors/+sensorName/#other", () => {
  const mqttPattern = MqttPattern.create("sensors/+sensorName/#other");

  expect(mqttPattern.match("sensors/s1/t1")).toBeTruthy();
  expect(mqttPattern.match("sensors/s1/t1/t2")).toBeTruthy();
  expect(mqttPattern.extractParams("sensors/s1/t1")).toEqual({
    sensorName: "s1",
    other: ["t1"],
  });
  expect(mqttPattern.extractParamsName()).toEqual(["sensorName", "other"]);
  expect(mqttPattern.getPatternWithoutParamsName()).toEqual("sensors/+/#");
  expect(mqttPattern.getPatternWithoutParamsName()).toEqual("sensors/+/#");
  expect(mqttPattern.getPatternWithoutParamsName()).toEqual("sensors/+/#");
  expect(mqttPattern.getPatternWithoutParamsName()).toEqual("sensors/+/#");
});
