/**
 * 首字母大写
 * @param str 
 */
export function capitalize(str: string) {
  str = str.trim()
  if (str === '') return str
  const strCapitalized = str.charAt(0).toUpperCase() + str.slice(1)
  return strCapitalized
}
/**
 * 将下划线变量名转换成class: __this-is-_name => ThisIsName
 * @param str 
 */
export function transformToClassName(str: string) {
  str = str.trim()
  const sliceArr = str.split(/[_-]+/g)
  return sliceArr.map(s => capitalize(s)).join('')
}
