import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import { authActionCreators } from '../../actions'
import { RootState } from '../../reducers'
import { User } from '../../models'
import { userConsts } from '../../constants'
import { Input, Select, Button, Icon, Row, Col } from 'antd'
import { RegisterForm, RegisterValuesProps } from '../../components/form'
import i18n from 'i18next'
interface RegisterProps {
  dispatch: Dispatch<RootState>
  processing: boolean
}
interface RegisterState {
  user: {
    email: string
    firstName: string
    lastName: string
    password: string
    rePassword: string
    userType: number
  }
  submitted: boolean
}
class RegisterPage extends React.Component<RegisterProps, RegisterState> {
  userId: string
  constructor(props: RegisterProps) {
    super(props)

    this.state = {
      user: {
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        rePassword: '',
        userType: userConsts.USER_TYPE_NORMAL
      },
      submitted: false
    }
  }
  handleSubmit = (values: RegisterValuesProps) => {
    this.setState({ submitted: true })
    const { dispatch } = this.props
    const { userType } = this.state.user
    let newUser: User = { ...values, userType, isActive: true, consignees: [] }
    dispatch(authActionCreators.register(newUser))
  }

  render() {
    const { processing } = this.props
    const { user, submitted } = this.state
    return (
      <div className="page auth-page">
        <div className="header">
          <div className="header-item">{i18n.t('Register User')}</div>
        </div>
        <div className="form-wr">
          <RegisterForm
            handleSubmit={this.handleSubmit}
            processing={processing}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state: RootState) {
  return {
    ...state.auth
  }
}

const connectedRegisterPage = connect(mapStateToProps)(RegisterPage)
export { connectedRegisterPage as RegisterPage }
