import { Swagger } from './swaggerTypes'

interface CodeGenOptions {
  swagger: Swagger
}

export const getTypescriptCode = function (opts: CodeGenOptions) {
  if (opts.swagger.swagger !== '2.0') {
    throw Error('Only Swagger 2.0 specs are supported')
  }
  return true
}
