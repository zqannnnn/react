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
class ResetPassPage extends React.Component<ResetPassProps> {
  constructor(props: ResetPassProps) {
    super(props)
  }

  handleSubmit = (pass:string) => {
    this.props.dispatch(userActionCreators.resetPass(pass))
  }

  render() {
    const { processing } = this.props
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
