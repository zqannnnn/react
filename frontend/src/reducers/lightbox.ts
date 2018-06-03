import { lightboxConsts } from '../constants'
import { LightboxAction } from '../actions'
export type State = {
  type?: string
  images: string[]
  currentIdx: number
  showing: boolean
}
export function lightbox(
  state = { showing: false, images: [], currentIdx: 0 },
  action: LightboxAction
): State {
  let newIdx: number
  switch (action.type) {
    case lightboxConsts.OPEN:
      return {
        showing: true,
        images: action.images,
        currentIdx: action.currentIdx
      }
    case lightboxConsts.CLOSE:
      return {
        showing: false,
        images: [],
        currentIdx: 0
      }
    case lightboxConsts.PREV:
      newIdx =
        state.currentIdx == 0 ? state.images.length - 1 : state.currentIdx - 1
      return {
        ...state,
        currentIdx: newIdx
      }
    case lightboxConsts.NEXT:
      newIdx =
        state.currentIdx == state.images.length - 1 ? 0 : state.currentIdx + 1
      return {
        ...state,
        currentIdx: newIdx
      }
    default:
      return state
  }
}
