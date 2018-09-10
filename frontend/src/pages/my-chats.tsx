import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
//import { transactionActionCreators } from '../actions'
import { chatActionCreators } from '../actions'

import { RootState } from '../reducers'
//import { List as ListC } from '../components'
import { Row, Col, Pagination } from 'antd'
//import { transactionConsts } from '../constants'
import i18n from 'i18next'
//import { Filter } from '../components'
//import { ListOptions } from '../models'

interface ChatsProps {
    dispatch: Dispatch<RootState>
}
interface ChatsState {
}
class Chats extends React.Component<ChatsProps, ChatsState> {
  constructor(props: ChatsProps) {
    super(props)
    this.state = this.defaultState
  }
  defaultState = {
  }

  componentWillMount() {
      console.log('will mount')
      this.props.dispatch(
        chatActionCreators.getAll()
      )
  
  }

  componentWillReceiveProps(nextProps: ChatsProps) {
  }

  componentDidMount() {
    //this.props.dispatch(transactionActionCreators.getAll(this.state.options))
  }
  render() {
    //const { transaction } = this.props
    return (
      <Row className="page">
        <div className="banner">
          <div className="banner-bg" />
          <div className="title">{i18n.t('My Chats')}</div>
        </div>
        <Col
          xs={{ span: 22, offset: 1 }}
          sm={{ span: 20, offset: 2 }}
          md={{ span: 18, offset: 3 }}
          lg={{ span: 16, offset: 4 }}
        >
        </Col>
      </Row>
    )
  }
}

function mapStateToProps(state: RootState) {
  //const { transaction } = state
  return { }
}

const connectedList = connect(mapStateToProps)(Chats)
export { connectedList as MyChatsPage }
