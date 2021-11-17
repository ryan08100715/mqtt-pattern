# MqttPattern

## 先決條件

- pattern 頭尾禁用/
- pattern 每個層級禁用空字串

## static methods

- MqttPattern.create(pattern: string): MqttPattern

  驗證 pattern 格式並返回 MqttPattern 實例。

  **Note:** 當 pattern 格式錯誤時，會 throw Error。

- MqttPattern.checkPatternFormat(pattern: string): boolean

  檢查 pattern 格式是否正確。

## instance methods

- match(topic: string): boolean

  判斷 pattern 是否匹配 topic。

- extractParams(topic: string): {[name:string]: string | string[]}

  根據 pattern 參數名稱提取對應的參數值。

  **Note:** 提取前會驗證 topic 是否有 match pattern，如果沒有則會 throw Error。

- extractParamsName(): string[]

  提取 pattern 的所有參數名稱。

- fillParams(params: {[paramName]: string | string[]}): string

  將參數填入 pattern。

- getPatternWithoutParamsName(): string

  取得移除參數名稱後的 pattern。
