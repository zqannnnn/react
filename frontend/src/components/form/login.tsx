import * as React from 'react'
import { Link } from 'react-router-dom'
import { Form, Icon, Input, Button, Checkbox } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import i18n from 'i18next'

const FormItem = Form.Item
interface LoginFormProps extends FormComponentProps {
  handleSubmit: (values: any) => void
  processing?: boolean
}
class LoginForm extends React.Component<LoginFormProps> {
  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) this.props.handleSubmit(values)
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <div className="header">
          <div className="header-register">{i18n.t('Login')}</div>
          <div className="header-now">{i18n.t('Login now and start making money from home!')}</div>
        </div>
        <p className="form-item">
          <div>{i18n.t('Email')}</div>
        </p>
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
        <p className="form-item">
          <div>{i18n.t('Password')}</div>
        </p>
        <FormItem className="form-item">
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: i18n.t('Please input your Password!')
              }
            ]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder={i18n.t('Please input your password...')}
            />
          )}
        </FormItem>
        <FormItem className="form-item">
          <Link to="/lost/pass" className="login-form-forgot">
            {i18n.t('Forget password?')}
          </Link>
          <br />
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            className="button-left btn-color"
          >
            <span>{i18n.t('Login')}</span>
            <span className="register-now">&nbsp;{i18n.t('now!')}</span>
            <span>{this.props.processing && (<Icon type="loading" />)}</span>
          </Button>
        </FormItem>
      </Form>
    )
  }
}

const WrappedLoginForm = Form.create()(LoginForm)
export { WrappedLoginForm as Login }
