import * as React from 'react'
import { Form, Input, Modal, Select } from 'antd'
import { Dispatch } from 'redux'
import { FormComponentProps } from 'antd/lib/form'
import i18n from 'i18next'
import { User, Currency, Country } from '../../models'
import { currencyActionCreators } from '../../actions'
const FormItem = Form.Item
export interface UserValuesProps {
  firstName: string
  email: string
  lastName: string
  preferredCurrencyCode?: string
  countryCode?: string
}
export interface State {
  preferredCurrencyCode?: string
  countryCode?: string
}
interface UserFormProps extends FormComponentProps {
  handleSubmit: (values: UserValuesProps) => void
  handleCancel: () => void
  visible: boolean
  user: User
  countries: Country[]
  currencies: Currency[]
}
class UserForm extends React.Component<UserFormProps, State> {
  constructor(props: UserFormProps) {
    super(props)
    this.state = {
      preferredCurrencyCode: '',
      countryCode: ''
    }
  }
  componentDidMount() {
    const { user } = this.props
    let preferredCurrencyCode = user.preferredCurrencyCode
    let countryCode = user.countryCode
    if (user) {
      this.setState({
        preferredCurrencyCode: preferredCurrencyCode,
        countryCode: countryCode
      })
    }
  }
  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    this.props.form.validateFields((err, values: UserValuesProps) => {
      values.preferredCurrencyCode = this.state.preferredCurrencyCode
      values.countryCode = this.state.countryCode
      if (!err) {
        this.props.handleSubmit(values)
        this.props.handleCancel()
      }
    })
  }
  handleCountrySelect = (value: string) => {
    const { countries } = this.props
    if (countries) {
      this.setState({
        countryCode: value
      })
    }
  }
  handleCurrencySelect = (value: string) => {
    const { user } = this.props
    this.setState({
      preferredCurrencyCode: value
    })
  }
  renderCountrySelect = () => {
    const { countries } = this.props
    return (
      <Select
        value={this.state.countryCode}
        onSelect={(value: string) => this.handleCountrySelect(value)}
      >
        {countries &&
          countries.map((item, index) => (
            <Select.Option key={index} value={item.code}>
              {item.name}
            </Select.Option>
          ))}
      </Select>
    )
  }
  renderCurrencySelect = () => {
    const { currencies } = this.props
    return (
      <Select
        value={this.state.preferredCurrencyCode}
        onSelect={(value: string) => this.handleCurrencySelect(value)}
      >
        {currencies &&
          currencies.map((item, index) => (
            <Select.Option key={index} value={item.code}>
              {item.code}({item.description})
            </Select.Option>
          ))}
      </Select>
    )
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
            {this.renderCurrencySelect()}
          </FormItem>
          <FormItem label="Country">{this.renderCountrySelect()}</FormItem>
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
