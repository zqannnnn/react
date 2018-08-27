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
      <Row className="page">
        <div className="header-profile header">{i18n.t('Register User')}</div>
        <Col
          xs={{ span: 22, offset: 1 }}
          sm={{ span: 18, offset: 3 }}
          md={{ span: 14, offset: 5 }}
          lg={{ span: 10, offset: 7 }}
        >
          <RegisterForm
            handleSubmit={this.handleSubmit}
            processing={processing}
          />
        </Col>
      </Row>
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
