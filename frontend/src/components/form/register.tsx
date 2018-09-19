import * as React from 'react'
import { Form, Icon, Input, Button, Checkbox } from 'antd'
import {
  FormComponentProps,
  ValidationRule,
  ValidateCallback
} from 'antd/lib/form'
import i18n from 'i18next'
import { Link } from 'react-router-dom'
const FormItem = Form.Item
export interface RegisterValuesProps {
  firstName: string
  lastName: string
  password: string
  email: string
}
interface RegisterFormProps extends FormComponentProps {
  handleSubmit: (values: RegisterValuesProps) => void
  processing?: boolean
}
interface RegisterFormState {
  confirmDirty: boolean
}
class RegisterForm extends React.Component<
  RegisterFormProps,
  RegisterFormState
> {
  state = {
    confirmDirty: false
  }
  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll(
      (err: string, values: RegisterValuesProps) => {
        if (!err) this.props.handleSubmit(values)
      }
    )
  }
  handleConfirmBlur = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    this.setState({
      confirmDirty: this.state.confirmDirty || !!value
    })
  }
  compareToFirstPassword = (
    rule: ValidationRule,
    value: string,
    callback: (err?: string) => void
  ) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('password')) {
      callback(i18n.t('Two passwords that you enter is inconsistent!'))
    } else {
      callback()
    }
  }
  validateToNextPassword = (
    rule: ValidationRule,
    value: string,
    callback: (err?: string) => void
  ) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFieldsAndScroll(['confirm'], {
        force: true
      })
    }
    callback()
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className="register-form auth-form">
        <div className="header">
          <div className="title">{i18n.t('Register User')}</div>
          <div className="tips">
            {i18n.t('Register now and start making money from home!')}
          </div>
        </div>
        <FormItem label={i18n.t('Email')} className="form-item">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: i18n.t('The input is not valid Email!')
              },
              {
                required: true,
                message: i18n.t('Please input your Email!')
              }
            ]
          })(<Input placeholder={i18n.t('please input your email...')} />)}
        </FormItem>
        <FormItem label="First Name" className="form-item">
          {getFieldDecorator('firstName', {
            rules: [
              {
                required: true,
                message: i18n.t('Please input your First Name!')
              }
            ]
          })(<Input placeholder={i18n.t('Please enter a name...')} />)}
        </FormItem>
        <FormItem label="Last Name" className="form-item">
          {getFieldDecorator('lastName', {
            rules: [
              {
                required: true,
                message: i18n.t('Please input your Last Name!')
              }
            ]
          })(<Input placeholder={i18n.t('Please enter your last name...')} />)}
        </FormItem>
        <FormItem label="Password" className="form-item">
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: i18n.t('Please input your password!')
              },
              {
                validator: this.validateToNextPassword
              }
            ]
          })(
            <Input
              type="password"
              placeholder={i18n.t('Please enter your password...')}
            />
          )}
        </FormItem>
        <FormItem label="Confirm Password" className="form-item">
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: i18n.t('Please confirm your password!')
              },
              {
                validator: this.compareToFirstPassword
              }
            ]
          })(
            <Input
              type="password"
              onBlur={this.handleConfirmBlur}
              placeholder={i18n.t('Please enter your password again...')}
            />
          )}
        </FormItem>
        <FormItem className="form-item">
          <Button type="primary" htmlType="submit" className="submit-btn">
            <span>{i18n.t('Register')}</span>
            <span className="register-now">&nbsp;{i18n.t('now!')}</span>
          </Button>
        </FormItem>
      </Form>
    )
  }
}
const WrappedRegisterForm = Form.create()(RegisterForm)
export { WrappedRegisterForm as Register }
