import * as React from 'react'
import { Link, Redirect, RouteComponentProps } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'

import { authActionCreators } from '../../actions'
import { RootState } from '../../reducers'
import { Row, Col, Input, Icon, Button } from 'antd'
import i18n from 'i18next'
import { LostPassForm } from '../../components/form'
interface LostPassProps extends RouteComponentProps<{}> {
  dispatch: Dispatch<RootState>
  processing: boolean
}
class LostPassPage extends React.Component<LostPassProps> {
  constructor(props: LostPassProps) {
    super(props)
  }
  handleSubmit = (email: string) => {
    this.props.dispatch(authActionCreators.lostPass(email))
  }

  render() {
    const { processing } = this.props
    return (
      <div className="page auth-page">
        <div className="header">
          <div className="header-item">{i18n.t('Lost Password')}</div>
        </div>
        <div className="form-wr">
          <LostPassForm
            handleSubmit={this.handleSubmit}
            processing={processing}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { processing } = state.user

  return { processing }
}

const connectedLostPassPage = connect(mapStateToProps)(LostPassPage)
export { connectedLostPassPage as LostPassPage }
