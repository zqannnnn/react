import { uploadConsts } from '../constants'
import { UploadAction } from '../actions'
import { Transaction } from '../models'
export type State = {
  uploading?: boolean
  image?: string
  error?: string
}
export function upload(state: State = {}, action: UploadAction): State {
  switch (action.type) {
    case uploadConsts.UPLOAD_IMAGE_REQUEST:
      return { uploading: true }
    case uploadConsts.UPLOAD_IMAGE_SUCCESS:
      return {
        ...state,
        uploading: false,
        image: action.imagePath
      }
    case uploadConsts.UPLOAD_IMAGE_FAILURE:
      return { error: action.error, uploading: false }
    case uploadConsts.UPLOAD_CLEAR_IMAGE:
      return {}
    default:
      return state
  }
}
