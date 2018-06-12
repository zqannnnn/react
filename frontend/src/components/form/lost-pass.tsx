import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import { transactionActionCreators, AuthInfo } from '../../actions'
import { RootState, TransactionState } from '../../reducers'
import { Transaction, ListItem } from '../../models'
import { Form, Icon, Input, Button, Checkbox } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import i18n from 'i18next'
const FormItem = Form.Item
interface LostPassFormProps extends FormComponentProps {
  handleSubmit: (values: any) => void
  processing?: boolean
}
class LostPassForm extends React.Component<LostPassFormProps> {
  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      this.props.handleSubmit(values.email)
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { processing } = this.props
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('email', {
            rules: [
              {
                required: true,
                message: i18n.t('Please input your email!')
              }
            ]
          })(
            <Input
              prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder={i18n.t('Email')}
            />
          )}
        </FormItem>
        <FormItem className="float-lostPas">
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            className="button-margin"
          >
            {i18n.t('Reset Password')}
          </Button>
          {processing && <Icon type="loading" />}
          <Button size="large">
            <Link to="/login">{i18n.t('Back to login')}</Link>
          </Button>
        </FormItem>
      </Form>
    )
  }
}

const WrappedLostPassForm = Form.create()(LostPassForm)
export { WrappedLostPassForm as LostPassForm }
