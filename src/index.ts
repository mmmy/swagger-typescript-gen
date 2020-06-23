import { Swagger } from './swaggerTypes'

interface CodeGenOptions {
  swagger: Swagger
}

export const getTypescriptCode = function (opts: CodeGenOptions) {
  const { swagger } = opts
  if (swagger.swagger !== '2.0') {
    throw Error('Only Swagger 2.0 specs are supported')
  }

  const paths = swagger.paths || {}
  const definitions = swagger.definitions || []

  const tagModules = []
  const tags = []
  Object.getOwnPropertyNames(swagger.paths).forEach(pathName => {
    const pathData = paths[pathName]
  })
}
