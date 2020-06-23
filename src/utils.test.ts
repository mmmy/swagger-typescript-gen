import { capitalize, transformToClassName } from './utils'

describe('utils', () => {
  it('capitalize', () => {
    expect(capitalize('name')).toBe('Name')
  })
})