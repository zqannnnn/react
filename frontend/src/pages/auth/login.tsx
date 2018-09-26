import * as React from 'react'
import { Link, Redirect, RouteComponentProps } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import { authActionCreators } from '../../actions'
import { RootState } from '../../reducers'
import { Row, Col } from 'antd'
import i18n from 'i18next'
import { LoginForm } from '../../components/form'
import './login.scss'
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
      }
    }
  }

  handleSubmit = (value: any) => {
    this.props.dispatch(authActionCreators.login(value.email, value.password))
  }

  render() {
    const { processing, loggedIn } = this.props
    const { email, password } = this.state.values

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
      <div className="page login-page auth-page">
        <div className="header">
          <div className="header-item">{i18n.t('Login')}</div>
        </div>
        <div className="form-wr">
          <LoginForm handleSubmit={this.handleSubmit} processing={processing} />
        </div>
      </div>
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
