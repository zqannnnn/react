import * as React from 'react'
import { Form, Icon, Input, Modal, Upload } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import i18n from 'i18next'
import { authHeader } from '../../helpers/auth'
import { User } from '../../models'
import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface'
const FormItem = Form.Item
export interface CompanyValuesProps {
  companyName: string
  companyAddress: string
}
export interface ProfileState {
  previewVisible: boolean
  fileList: UploadFile[]
}
interface CompanyFormProps extends FormComponentProps {
  handleSubmit: (values: CompanyValuesProps, file: UploadFile[]) => void
  handleCancel: () => void
  handlePreview: (file: UploadFile) => void
  modalVisible: boolean
  user: User
}
class UserForm extends React.Component<CompanyFormProps, ProfileState> {
  constructor(props: CompanyFormProps) {
    super(props)
    this.state = {
      previewVisible: false,
      fileList: []
    }
  }
  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    this.props.form.validateFields((err, values: CompanyValuesProps) => {
      if (!err) {
        this.props.handleSubmit(values, this.state.fileList)
        this.props.handleCancel()
      }
    })
  }

  handleChange = (fileParam: UploadChangeParam) => {
    let fileList = fileParam.fileList
    fileList = fileList.map(file => {
      if (file.response) {
        file.url = file.response.path
      }
      return file
    })
    fileList = fileList.filter(file => {
      if (file.response) {
        return file.status === 'done'
      }
      return true
    })

    this.setState({ fileList })
  }
  componentWillReceiveProps(nextProps: CompanyFormProps) {
    const { user } = nextProps
    if (user && user.businessLicenses) {
      let licenseList = user.businessLicenses.map(
        (license, index): UploadFile => ({
          url: license.path,
          name: '',
          uid: index,
          size: 200,
          type: 'done'
        })
      )
      this.setState({ fileList: licenseList })
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { fileList } = this.state
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    return (
      <Modal
        title={i18n.t('Company Information')}
        visible={this.props.modalVisible}
        onOk={this.handleSubmit}
        onCancel={this.props.handleCancel}
        okText={i18n.t('OK')}
        cancelText={i18n.t('Cancel')}
      >
        <Form>
          <FormItem label="companyName">
            {getFieldDecorator('companyName', {
              rules: [
                {
                  required: true,
                  message: i18n.t('Please input your companyName!')
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label="companyAddress">
            {getFieldDecorator('companyAddress', {
              rules: [
                {
                  required: true,
                  message: i18n.t('Please input your companyAddress!')
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label="Business License">
            <div className="upload-profile clearfix">
              <Upload
                action="/upload/image"
                headers={authHeader()}
                listType="picture-card"
                fileList={fileList}
                accept="image/*"
                onChange={this.handleChange}
                onPreview={this.props.handlePreview}
              >
                <div>
                  <Icon type="plus" />
                  <div className="ant-upload-text">{i18n.t('Upload')}</div>
                </div>
              </Upload>
            </div>
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
const WrappedUserForm = Form.create({
  mapPropsToFields(props: CompanyFormProps) {
    const { user } = props
    if (user)
      return {
        companyName: Form.createFormField({
          value: user.companyName
        }),
        companyAddress: Form.createFormField({
          value: user.companyAddress
        })
      }
  }
})(UserForm)
export { WrappedUserForm as CompanyForm }
