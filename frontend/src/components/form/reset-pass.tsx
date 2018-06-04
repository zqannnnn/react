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
  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      this.props.handleSubmit(values.password)
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
      callback('Two passwords that you enter is inconsistent!')
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
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
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
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="Password">
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input your password!'
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
                message: 'Please confirm your password!'
              },
              {
                validator: this.compareToFirstPassword
              }
            ]
          })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
          {this.props.processing && <Icon type="loading" />}
        </FormItem>
      </Form>
    )
  }
}

const WrappedResetPassForm = Form.create()(ResetPassForm)
export { WrappedResetPassForm as ResetPassForm }
