import { goodsConsts } from '../constants'
import { goodsService } from '../services'
import { alertActionCreators } from '.'
import { history } from '../helpers/history'
import { Goods } from '../models'
import { Dispatch } from 'react-redux'
import { ActionCreator } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { RootState } from '../reducers'
import { ListOptions } from '../models'

export type Action = {
  type: string
  error?: string
  id?: string
  goods?: Array<Goods>
  data?: Goods
  imagePath?: string
  total?: number
}

type Thunk = ThunkAction<void, RootState, void>

// prefixed function name with underscore because new is a reserved word in
const _new: ActionCreator<Thunk> = (goods: Goods) => {
  return (dispatch: Dispatch<RootState>): void => {
    dispatch(request())

    goodsService.new(goods).then(
      (goods: Goods) => {
        dispatch(success())
        dispatch(alertActionCreators.success('Create goods successful'))
        setTimeout(function() {
          history.replace('/')
        }, 1000)
      },
      (error: string) => {
        dispatch(failure(error))
        dispatch(alertActionCreators.error(error))
      }
    )
  }
  function request(): Action {
    return { type: goodsConsts.CREATE_REQUEST }
  }
  function success(): Action {
    return { type: goodsConsts.CREATE_SUCCESS }
  }
  function failure(error: string): Action {
    return { type: goodsConsts.CREATE_FAILURE, error }
  }
}
const edit: ActionCreator<Thunk> = (goods: Goods, goodsId: string) => {
  return (dispatch: Dispatch<RootState>): void => {
    dispatch(request())

    goodsService.edit(goods, goodsId).then(
      () => {
        dispatch(success())
        dispatch(alertActionCreators.success('Edit goods successful'))
        setTimeout(function() {
          history.replace('/')
        }, 1000)
      },
      (error: string) => {
        dispatch(failure(error))
        dispatch(alertActionCreators.error(error))
      }
    )
  }
  function request(): Action {
    return { type: goodsConsts.EDIT_REQUEST }
  }
  function success(): Action {
    return { type: goodsConsts.EDIT_SUCCESS }
  }
  function failure(error: string): Action {
    return { type: goodsConsts.EDIT_FAILURE, error }
  }
}
function getById(id: string) {
  return (dispatch: (action: Action) => void) => {
    dispatch(request())

    goodsService
      .getById(id)
      .then(
        (goods: Goods) => dispatch(success(goods)),
        (error: string) => dispatch(failure(error))
      )
  }

  function request() {
    return { type: goodsConsts.GET_REQUEST }
  }
  function success(goods: Goods) {
    if (goods.images) {
      let images = goods.images.filter(
        image => image.type === goodsConsts.IMAGE_TYPE_MEDIE
      )

      let certificates = goods.images.filter(
        image => image.type === goodsConsts.IMAGE_TYPE_CERTIFICATE
      )
      goods.images = images
      goods.certificates = certificates
    }
    return { type: goodsConsts.GET_SUCCESS, data: goods }
  }
  function failure(error: string) {
    return { type: goodsConsts.GET_FAILURE, error }
  }
}
const getAll: ActionCreator<Thunk> = (option: ListOptions) => {
  return (dispatch: Dispatch<RootState>): void => {
    dispatch(request())
    goodsService
      .getAll(option)
      .then(
        (result: { goods: Array<Goods>; total: number }) =>
          dispatch(success(result.goods, result.total)),
        (error: string) => dispatch(failure(error))
      )
  }

  function request(): Action {
    return { type: goodsConsts.GETALL_REQUEST }
  }
  function success(goods: Array<Goods>, total: number): Action {
    goods.forEach(Goods => {
      Goods.itemType = 'Goods'
      if (Goods.images) {
        let images = Goods.images.filter(
          image => image.type === goodsConsts.IMAGE_TYPE_MEDIE
        )
        let certificates = Goods.images.filter(
          image => image.type === goodsConsts.IMAGE_TYPE_CERTIFICATE
        )
        Goods.certificates = certificates
        Goods.images = images
      }
    })

    return { type: goodsConsts.GETALL_SUCCESS, goods, total }
  }
  function failure(error: string): Action {
    return { type: goodsConsts.GETALL_FAILURE, error }
  }
}
export const actionCreators = {
  new: _new,
  edit,
  getAll,
  getById
}
