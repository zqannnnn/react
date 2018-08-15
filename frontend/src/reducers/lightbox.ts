import { lightboxConsts } from '../constants'
import { LightboxAction } from '../actions'
export type State = {
  type?: string
  image: string
  visible: boolean
}
export function lightbox(
  state = { visible: false, image: '' },
  action: LightboxAction
): State {
  switch (action.type) {
    case lightboxConsts.OPEN:
      return {
        visible: true,
        image: action.image
      }
    case lightboxConsts.CLOSE:
      return {
        visible: false,
        image: ''
      }
    default:
      return state
  }
}
