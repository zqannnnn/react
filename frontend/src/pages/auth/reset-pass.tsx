import * as React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import { ResetPassForm } from '../../components/form'
import { userActionCreators } from '../../actions'
import { RootState } from '../../reducers'
import { Row, Col } from 'antd'
import i18n from 'i18next'

interface ResetPassProps {
  dispatch: Dispatch<RootState>
  processing: boolean
}
interface ResetPassState {
  password: string
  rePassword: string
  submitted: boolean
}
class ResetPassPage extends React.Component<ResetPassProps, ResetPassState> {
  constructor(props: ResetPassProps) {
    super(props)

    this.state = {
      password: '',
      rePassword: '',
      submitted: false
    }
  }
  handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget
    this.setState({ ...this.state, [name]: value })
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    this.setState({ submitted: true })
    const { password, rePassword } = this.state
    const { dispatch } = this.props
    if (password && password == rePassword) {
      dispatch(userActionCreators.resetPass(password))
    }
  }

  render() {
    const { processing } = this.props
    const { password, rePassword, submitted } = this.state
    return (
      <Row className="page">
        <div className="header">{i18n.t('Reset')}</div>
        <Col
          xs={{ span: 22, offset: 1 }}
          sm={{ span: 18, offset: 3 }}
          md={{ span: 14, offset: 5 }}
          lg={{ span: 10, offset: 7 }}
        >
          <ResetPassForm
            handleSubmit={this.handleSubmit}
            processing={processing}
          />
        </Col>
      </Row>
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
