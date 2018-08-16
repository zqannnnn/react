export const consts = {
  CREATE_REQUEST: 'TRANSACTION_CREATE_REQUEST',
  CREATE_SUCCESS: 'TRANSACTION_CREATE_SUCCESS',
  CREATE_FAILURE: 'TRANSACTION_CREATE_FAILURE',

  CREATE_ORDER_REQUEST: 'ORDER_CREATE_REQUEST',
  CREATE_ORDER_SUCCESS: 'ORDER_CREATE_SUCCESS',
  CREATE_ORDER_FAILURE: 'ORDER_CREATE_FAILURE',

  EDIT_REQUEST: 'TRANSACTION_EDIT_REQUEST',
  EDIT_SUCCESS: 'TRANSACTION_EDIT_SUCCESS',
  EDIT_FAILURE: 'TRANSACTION_EDIT_FAILURE',

  GET_REQUEST: 'TRANSACTION_GET_REQUEST',
  GET_SUCCESS: 'TRANSACTION_GET_SUCCESS',
  GET_FAILURE: 'TRANSACTION_GET_FAILURE',

  GETALL_REQUEST: 'TRANSACTION_GETALL_REQUEST',
  GETALL_SUCCESS: 'TRANSACTION_GETALL_SUCCESS',
  GETALL_FAILURE: 'TRANSACTION_GETALL_FAILURE',

  CANCEL_REQUEST: 'TRANSACTION_CANCEL_REQUEST',
  CANCEL_SUCCESS: 'TRANSACTION_CANCEL_SUCCESS',
  CANCEL_FAILURE: 'TRANSACTION_CANCEL_FAILURE',

  REACTIVATE_REQUEST: 'TRANSACTION_REACTIVATE_REQUEST',
  REACTIVATE_SUCCESS: 'TRANSACTION_REACTIVATE_SUCCESS',
  REACTIVATE_FAILURE: 'TRANSACTION_REACTIVATE_FAILURE',

  BUY_REQUEST: 'TRANSACTION_BUY_REQUEST',
  BUY_SUCCESS: 'TRANSACTION_BUY_SUCCESS',
  BUY_FAILURE: 'TRANSACTION_BUY_FAILURE',

  COMMENT_CREATE_REQUEST: 'COMMENT_CREATE_REQUEST',
  COMMENT_CREATE_SUCCESS: 'COMMENT_CREATE_SUCCESS',
  COMMENT_CREATE_FAILURE: 'COMMENT_CREATE_FAILURE',

  COMMENT_LIST_REQUEST: 'COMMENT_LIST_REQUEST',
  COMMENT_LIST_SUCCESS: 'COMMENT_LIST_SUCCESS',
  COMMENT_LIST_FAILURE: 'COMMENT_LIST_FAILURE',

  REPLY_LIST_REQUEST: 'REPLY_LIST_REQUEST',
  REPLY_LIST_SUCCESS: 'REPLY_LIST_SUCCESS',
  REPLY_LIST_FAILURE: 'REPLY_LIST_FAILURE',

  CATEGORY: ['Beef', 'Veal', 'Sheep'],
  TYPE_BUY: 'Buy',
  TYPE_SELL: 'Sell',
  STATUS_CANCELLED: 0,
  STATUS_CREATED: 1,
  STATUS_FINISHED: 2,
  STATUS_TAKING: 3,

  IMAGE_TYPE_MEDIE: 1,
  IMAGE_TYPE_CERTIFICATE: 2,

  LIST_PAGE_SIZE: 9,
  COMMENT_LIST_SIZE: 3
}
