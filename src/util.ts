export const makeRandomString = (length: number) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let str: string = ''
  for (let i = 0; i < length; i++) {
    str += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return str
}
