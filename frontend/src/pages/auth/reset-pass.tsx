import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { ResetPassForm } from '../../components/form'
import { authActionCreators } from '../../actions'
import { RootState } from '../../reducers'
import { Row, Col } from 'antd'
import i18n from 'i18next'

interface ResetPassProps {
  dispatch: Dispatch<RootState>
  processing: boolean
}
class ResetPassPage extends React.Component<ResetPassProps> {
  constructor(props: ResetPassProps) {
    super(props)
  }

  handleSubmit = (pass: string) => {
    this.props.dispatch(authActionCreators.resetPass(pass))
  }

  render() {
    const { processing } = this.props
    return (
      <div className="page auth-page">
        <div className="header">
          <div className="header-item">{i18n.t('Reset Password')}</div>
        </div>
        <div className="form-wr">
          <ResetPassForm
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
  return {
    processing
  }
}

const connectedResetPassPage = connect(mapStateToProps)(ResetPassPage)
export { connectedResetPassPage as ResetPassPage }
