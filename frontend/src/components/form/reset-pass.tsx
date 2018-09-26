import * as React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete
} from 'antd'
import {
  FormComponentProps,
  ValidationRule,
  ValidateCallback
} from 'antd/lib/form'
import i18n from 'i18next'
const FormItem = Form.Item

interface ResetPassFormProps extends FormComponentProps {
  handleSubmit: (values: any) => void
  processing?: boolean
}
interface RegisterFormState {
  confirmDirty: boolean
}
class ResetPassForm extends React.Component<
  ResetPassFormProps,
  RegisterFormState
> {
  state = {
    confirmDirty: false
  }
  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) this.props.handleSubmit(values.password)
    })
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

    return (
      <Form onSubmit={this.handleSubmit} className="auth-form">
        <div className="header">
          <div className="title">{i18n.t('Reset Pass')}</div>
          <div className="tips">{i18n.t('reset your password')}</div>
        </div>
        <FormItem className="form-item" label={i18n.t('Password')}>
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
        <FormItem className="form-item" label={i18n.t('Confirm Password')}>
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
        <FormItem className="form-item">
          <Button type="primary" htmlType="submit" className="submit-btn">
            {i18n.t('Reset')}
          </Button>
          {this.props.processing && <Icon type="loading" />}
        </FormItem>
      </Form>
    )
  }
}

const WrappedResetPassForm = Form.create()(ResetPassForm)
export { WrappedResetPassForm as ResetPass }
