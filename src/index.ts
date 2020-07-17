import { Swagger, HttpMethod } from './swaggerTypes'

interface CodeGenOptions {
  swagger: Swagger
}

const DEFAULT_TAG = 'noTag'

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
    const methods = Object.getOwnPropertyNames(pathData) as [HttpMethod]
    methods.forEach(mKey => {
      const methodData = pathData[mKey]
      const { tags } = methodData
      let tag = tags[0] || DEFAULT_TAG
      tag = tag.trim()
    })
  })
}
