import * as React from 'react'
import { Form, Input, Modal } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import i18n from 'i18next'
import { User, Currency } from '../../models'

const FormItem = Form.Item
export interface UserValuesProps {
  firstName: string
  email: string
  lastName: string
}
interface UserFormProps extends FormComponentProps {
  handleSubmit: (values: UserValuesProps) => void
  handleCancel: () => void
  renderCurrencySelect: () => JSX.Element
  visible: boolean
  user: User
}
class UserForm extends React.Component<UserFormProps> {
  constructor(props: UserFormProps) {
    super(props)
  }
  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    this.props.form.validateFields((err, values: UserValuesProps) => {
      if (!err) {
        this.props.handleSubmit(values)
        this.props.handleCancel()
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Modal
        title={i18n.t('Personal Information')}
        visible={this.props.visible}
        onOk={this.handleSubmit}
        onCancel={this.props.handleCancel}
        okText={i18n.t('OK')}
        cancelText={i18n.t('Cancel')}
      >
        <Form className="login-form">
          <FormItem label="First Name">
            {getFieldDecorator('firstName', {
              rules: [
                {
                  required: true,
                  message: i18n.t('Please input your firstName!')
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label="Last Name">
            {getFieldDecorator('lastName', {
              rules: [
                {
                  required: true,
                  message: i18n.t('Please input your lastName!')
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label="Email">
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: i18n.t('The input is not valid!')
                },
                {
                  required: true,
                  message: i18n.t('Please input your E-mail!')
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label="Preferred Currency">
            {this.props.renderCurrencySelect()}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
const WrappedUserForm = Form.create({
  mapPropsToFields(props: UserFormProps) {
    const { user } = props
    if (user)
      return {
        firstName: Form.createFormField({
          value: user.firstName
        }),
        email: Form.createFormField({
          value: user.email
        }),
        lastName: Form.createFormField({
          value: user.lastName
        })
      }
  }
})(UserForm)
export { WrappedUserForm as UserForm }
