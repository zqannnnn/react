import * as React from 'react'
import { Link } from 'react-router-dom'
import { Form, Icon, Input, Button, Checkbox, Modal, InputNumber } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import i18n from 'i18next'

const FormItem = Form.Item
export interface ConsigneeValuesProps {
  name: string
  email: string
  address: string
  phoneNum: number
}
interface ConsigneeFormProps extends FormComponentProps {
  handleSubmitConsignee: (values: ConsigneeValuesProps) => void
  handleConfirm: (values: ConsigneeValuesProps) => void
}
class ConsigneeForm extends React.Component<ConsigneeFormProps> {
  state = { visible: false }
  handleSubmitConsignee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    this.props.form.validateFields((err, ConsigneeValuesProps) => {
      if (!err) this.props.handleSubmitConsignee(ConsigneeValuesProps)
    })
  }

  handleConfirm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    this.props.form.validateFields(
      (err: string, values: ConsigneeValuesProps) => {
        if (!err) {
          this.props.handleConfirm(values)
          this.setState({
            visible: false
          })
        }
      }
    )
  }

  showModal = () => {
    this.setState({
      visible: true
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmitConsignee}>
        <Button type="primary" onClick={this.showModal}>
          Add Consignee
        </Button>
        <Modal
          title="Add Consignee"
          visible={this.state.visible}
          onOk={this.handleConfirm}
          onCancel={this.handleCancel}
        >
          <div className="modalsBody">
            <FormItem label="Consignee">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: i18n.t('Please input your consignee name!')
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
            <FormItem label="Phone">
              {getFieldDecorator('phoneNum', {
                rules: [
                  {
                    message: i18n.t('The input is not valid!'),
                    pattern: new RegExp(/\d{11}/)
                  },
                  {
                    required: true,
                    message: i18n.t('Please input your phone number!')
                  }
                ]
              })(<Input maxLength={11} />)}
            </FormItem>
            <FormItem label="Address">
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: i18n.t('Please input your consignee address!')
                  }
                ]
              })(<Input />)}
            </FormItem>
          </div>
        </Modal>
      </Form>
    )
  }
}

const WrappedLoginForm = Form.create()(ConsigneeForm)
export { WrappedLoginForm as ConsigneeForm }
