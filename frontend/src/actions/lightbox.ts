import { lightboxConsts } from '../constants'

export type Action = {
  type: string
  error?: string
  image: string
}

function open(image: string) {
  return { type: lightboxConsts.OPEN, image }
}
function close() {
  return { type: lightboxConsts.CLOSE }
}

export const actionCreators = {
  open,
  close
}
