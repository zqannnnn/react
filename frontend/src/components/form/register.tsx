import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import { transactionActionCreators, AuthInfo } from '../../actions'
import { RootState, TransactionState } from '../../reducers'
import { Transaction, ListItem } from '../../models'
import { Form, Icon, Input, Button, Checkbox } from 'antd'
import {
  FormComponentProps,
  ValidationRule,
  ValidateCallback
} from 'antd/lib/form'
import i18n from 'i18next'
const FormItem = Form.Item
export interface RegisterValuesProps {
  firstName: string
  lastName: string
  password: string
  email: string
}
interface RegisterFormProps extends FormComponentProps {
  handleSubmit: (values: any) => void
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
        this.props.handleSubmit(values)
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
      form.validateFields(
        ['confirm'],
        {
          force: true
        },
        callback
      )
    }
    callback()
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 8
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 16
        }
      }
    }
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    }
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem {...formItemLayout} label={i18n.t('Email')}>
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
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="First Name">
          {getFieldDecorator('firstName', {
            rules: [
              {
                required: true,
                message: i18n.t('Please input your First Name!')
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Last Name">
          {getFieldDecorator('lastName', {
            rules: [
              {
                required: true,
                message: i18n.t('Please input your Last Name!')
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Password">
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
          })(<Input type="password" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Confirm Password">
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
          })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            {i18n.t('Register')}
          </Button>
          {this.props.processing && <Icon type="loading" />}
        </FormItem>
      </Form>
    )
  }
}
const WrappedRegisterForm = Form.create()(RegisterForm)
export { WrappedRegisterForm as RegisterForm }
