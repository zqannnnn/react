import * as React from 'react'
import { Link, Redirect, RouteComponentProps } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'

import { userActionCreators } from '../../actions'
import { RootState } from '../../reducers'
import { Row, Col, Input, Icon, Button } from 'antd'
import i18n from 'i18next'
import { LostPassForm } from '../../components/form'
interface LostPassProps extends RouteComponentProps<{}> {
  dispatch: Dispatch<RootState>
  processing: boolean
}
interface LostPassState {
  values: {
    email: string
  }
  submitted?: boolean
}
class LostPassPage extends React.Component<LostPassProps, LostPassState> {
  constructor(props: LostPassProps) {
    super(props)

    this.state = {
      values: {
        email: ''
      },
      submitted: false
    }
  }
  handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget
    this.setState({
      ...this.state,
      [name]: value
    })
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    this.setState({ submitted: true })
    const { email } = this.state.values
    const { dispatch } = this.props
    if (email) {
      dispatch(userActionCreators.lostPass(email))
    }
  }

  render() {
    const { processing } = this.props
    const { email } = this.state.values
    const { submitted } = this.state
    return (
      <Row className="page margin-lostPas">
        <div className="header">{i18n.t('Lost Password')}</div>
        <Col
          xs={{ span: 22, offset: 1 }}
          sm={{ span: 18, offset: 3 }}
          md={{ span: 14, offset: 5 }}
          lg={{ span: 10, offset: 7 }}
        >
          <LostPassForm
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

  return { processing }
}

const connectedLostPassPage = connect(mapStateToProps)(LostPassPage)
export { connectedLostPassPage as LostPassPage }
