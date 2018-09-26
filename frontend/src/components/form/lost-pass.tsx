import * as React from 'react'
import { Link } from 'react-router-dom'
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
      if (!err) this.props.handleSubmit(values.email)
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { processing } = this.props
    return (
      <Form onSubmit={this.handleSubmit} className="auth-form">
        <div className="header">
          <div className="title">{i18n.t('Reset Pass')}</div>
          <div className="tips">
            {i18n.t('Will send you a email to reset password')}
          </div>
        </div>
        <div className="form-item">
          <div>{i18n.t('Email')}</div>
        </div>
        <FormItem className="form-item">
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
              placeholder={i18n.t('please input your email...')}
            />
          )}
        </FormItem>
        <FormItem className="form-item">
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            className="submit-btn"
          >
            {i18n.t('Submit')}
            <span>{this.props.processing && <Icon type="loading" />}</span>
          </Button>
        </FormItem>
      </Form>
    )
  }
}

const WrappedLostPassForm = Form.create()(LostPassForm)
export { WrappedLostPassForm as LostPass }
