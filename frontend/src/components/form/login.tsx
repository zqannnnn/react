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
      <Form onSubmit={this.handleSubmit} className="login-form auth-form">
        <div className="header">
          <div className="title">{i18n.t('Login')}</div>
          <div className="tips">
            {i18n.t('Login now and start making money from home!')}
          </div>
        </div>
        <FormItem
          label={i18n.t('Email')}
          required={false}
          className="form-item"
        >
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
        <FormItem
          label={i18n.t('Password')}
          required={false}
          className="form-item"
        >
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
            className="submit-btn"
          >
            <span>{i18n.t('Login')}</span>
            <span className="register-now">&nbsp;{i18n.t('Now!')}</span>
            <span>{this.props.processing && <Icon type="loading" />}</span>
          </Button>
        </FormItem>
      </Form>
    )
  }
}

const WrappedLoginForm = Form.create()(LoginForm)
export { WrappedLoginForm as Login }
