import { getTypescriptCode } from './index'
import { Swagger } from './swaggerTypes'

describe("getTypescriptCode", () => {
  let swagger = {
    swagger: '2.0'
  } as Swagger
  it("throws when swagger version is not 2.0", () => {
    swagger = {
      ...swagger,
      swagger: '3.0'
    }
    expect(() => getTypescriptCode({ swagger })).toThrow(
      "Only Swagger 2.0 specs are supported"
    )
  })
})
