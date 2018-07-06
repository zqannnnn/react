import { uploadConsts } from '../constants'
import { uploadService } from '../services'
import { alertActionCreators } from '.'
import { Dispatch } from 'react-redux'
import { ActionCreator } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { RootState } from '../reducers'

export type Action = {
  type: string
  error?: string
  imagePath?: string
}
type Thunk = ThunkAction<void, RootState, void>

const uploadImage: ActionCreator<ThunkAction<void, RootState, void>> = (
  file: File
) => {
  return (dispatch: Dispatch<Action>): void => {
    dispatch(request())

    uploadService.uploadImage(file).then(
      (result: { path: string }) => {
        dispatch(success(result.path))
      },
      (error: string) => {
        dispatch(failure(error))
        dispatch(alertActionCreators.error(error))
      }
    )
  }

  function request(): Action {
    return { type: uploadConsts.UPLOAD_IMAGE_REQUEST }
  }
  function success(imagePath: string): Action {
    return { type: uploadConsts.UPLOAD_IMAGE_SUCCESS, imagePath }
  }
  function failure(error: string): Action {
    return { type: uploadConsts.UPLOAD_IMAGE_FAILURE, error }
  }
}
function clear() {
  return { type: uploadConsts.UPLOAD_CLEAR_IMAGE }
}
export const actionCreators = {
  uploadImage,
  clear
}
