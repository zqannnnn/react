import * as React from 'react'
import { Link, Redirect, RouteComponentProps } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'

import { authActionCreators } from '../../actions'
import { RootState } from '../../reducers'
import { Row, Col } from 'antd'
import i18n from 'i18next'

import { LoginForm } from '../../components/form'
interface LoginProps extends RouteComponentProps<{}> {
  dispatch: Dispatch<RootState>
  processing: boolean
  loggedIn: boolean
}
interface LoginState {
  values: {
    email: string
    password: string
  }
  submitted?: boolean
}
class LoginPage extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props)

    this.state = {
      values: {
        email: '',
        password: ''
      },
      submitted: false
    }
  }

  handleSubmit = (value: any) => {
    this.setState({ submitted: true })
    this.props.dispatch(authActionCreators.login(value.email, value.password))
  }

  render() {
    const { processing, loggedIn } = this.props
    const { email, password } = this.state.values
    const Reasubmitted = this.state.submitted
    return loggedIn ? (
      <Redirect
        to={{
          pathname: '/',
          state: {
            from: this.props.location
          }
        }}
      />
    ) : (
      <Row className="page margin-login">
        <div className="header">{i18n.t('Login')}</div>
        <Col
          xs={{ span: 22, offset: 1 }}
          sm={{ span: 18, offset: 3 }}
          md={{ span: 14, offset: 5 }}
          lg={{ span: 10, offset: 7 }}
        >
          <LoginForm handleSubmit={this.handleSubmit} processing={processing} />
        </Col>
      </Row>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { processing, loggedIn } = state.auth
  return {
    processing,
    loggedIn
  }
}

const connectedLoginPage = connect(mapStateToProps)(LoginPage)
export { connectedLoginPage as LoginPage }
