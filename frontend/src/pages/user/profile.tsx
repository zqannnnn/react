import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import {
  userActionCreators,
  AuthInfo,
  currencyActionCreators,
  uploadActionCreators,
  lightboxActionCreators,
  authActionCreators
} from '../../actions'
import { RootState, UserState, UploadState } from '../../reducers'
import { User, Currency, Image } from '../../models'
import { authConsts } from '../../constants'
import { Row, Col, Input, Select, Button, Icon, Upload } from 'antd'
import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface'
import i18n from 'i18next'

interface ProfileProps {
  dispatch: Dispatch<RootState>
  userState: UserState
  authInfo: AuthInfo
  currencys: Currency[]
  upload: UploadState
}
interface ProfileState {
  user: User
  submitted: boolean
}
class ProfilePage extends React.Component<ProfileProps, ProfileState> {
  constructor(props: ProfileProps) {
    super(props)
    this.state = {
      user: {},
      submitted: false
    }
  }
  componentDidMount() {
    this.props.authInfo.id &&
      this.props.dispatch(userActionCreators.getById(this.props.authInfo.id))
    if (!this.props.currencys)
      this.props.dispatch(currencyActionCreators.getAll())
  }
  componentWillReceiveProps(nextProps: ProfileProps) {
    const { userState, upload } = nextProps
    const { userData } = userState
    const { image } = upload
    const { submitted, user } = this.state
    if (userData && !submitted) {
      this.setState({
        user: {
          ...userData,
          ...user
        }
      })
    }
    if (image) {
      if (user.businessLicenses) {
        this.setState({
          user: {
            ...user,
            businessLicenses: [...user.businessLicenses, { path: image }]
          }
        })
      } else {
        this.setState({
          user: {
            ...user,
            businessLicenses: [{ path: image }]
          }
        })
      }
      this.props.dispatch(uploadActionCreators.clear())
    }
  }
  handleUpload = (uploadFile: UploadFile) => {
    let license = uploadFile.originFileObj
    this.props.dispatch(uploadActionCreators.uploadImage(license))
  }
  handleDeleteImage = (uploadFile: UploadFile) => {
    const { user } = this.state
    const { businessLicenses } = user
    const uid = uploadFile.uid
    if (businessLicenses) {
      let newBusinessLicenses = businessLicenses.filter(
        (image: Image, index: number) => {
          return uid != index
        }
      )
      this.setState({
        user: { ...user, businessLicenses: newBusinessLicenses }
      })
      return true
    }
  }
  handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget
    const { user } = this.state
    this.setState({
      user: {
        ...user,
        [name]: value
      }
    })
  }
  handleSelect = (value: string, name: string) => {
    const { user } = this.state
    this.setState({
      user: {
        ...user,
        [name]: value
      }
    })
    this.props.dispatch(currencyActionCreators.upCurrencystatus(value))
  }
  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { dispatch } = this.props
    this.setState({ submitted: true })
    let user = this.state.user
    if (user.firstName && user.lastName && user.email) {
      if (user.companyName) {
        user.licenseStatus = authConsts.LICENSE_STATUS_UNCONFIRMED
      }
      dispatch(userActionCreators.update(user))
    }
    window.scrollTo(0, 0)
    setTimeout(() => dispatch(authActionCreators.refresh()), 1000)
  }
  //for render select input
  renderCurrencySelect = (optionItems: Currency[]) => {
    let preferCurrency = this.state.user.preferredCurrencyCode || ''
    return (
      <Select
        value={String(preferCurrency)}
        onSelect={(value: string) =>
          this.handleSelect(value, 'preferredCurrencyCode')
        }
      >
        {optionItems.map((item, index) => (
          <Select.Option key={index} value={item.code}>
            {item.code}({item.description})
          </Select.Option>
        ))}
      </Select>
    )
  }
  handlePreview = (file: UploadFile) => {
    file.url && this.openLightbox([file.url], 0)
  }

  openLightbox = (images: string[], index: number) => {
    this.props.dispatch(lightboxActionCreators.open(images, index))
  }

  customRequest = () => {
    return false
  }

  render() {
    const { userState, currencys } = this.props
    const { processing } = userState
    const { user, submitted } = this.state
    let licenseList: UploadFile[]
    if (user.businessLicenses) {
      licenseList = user.businessLicenses.map(
        (license, index): UploadFile => ({
          url: license.path,
          name: '',
          uid: index,
          size: 200,
          type: 'done'
        })
      )
    } else {
      licenseList = []
    }
    return (
      <Row className="profile-page">
        <Col
          xs={{ span: 22, offset: 1 }}
          sm={{ span: 16, offset: 4 }}
          md={{ span: 12, offset: 6 }}
          lg={{ span: 10, offset: 7 }}
        >
          <div className="header-center">{i18n.t('User Profile')}</div>
          <div className="subtitle">{i18n.t('Personal Information')}</div>
          <form name="form" onSubmit={this.handleSubmit}>
            <div className={submitted && !user.firstName ? ' has-error' : ''}>
              <label>{i18n.t('First Name')}</label>
              <Input
                type="text"
                name="firstName"
                value={user.firstName || ''}
                onChange={this.handleChange}
              />{' '}
              {submitted &&
                !user.firstName && (
                  <div className="invalid-feedback">
                    {i18n.t('First Name is required')}
                  </div>
                )}
            </div>
            <div className={submitted && !user.lastName ? ' has-error' : ''}>
              <label>{i18n.t('Last Name')}</label>
              <Input
                type="text"
                name="lastName"
                value={user.lastName || ''}
                onChange={this.handleChange}
              />{' '}
              {submitted &&
                !user.lastName && (
                  <div className="invalid-feedback">
                    {i18n.t('Last Name is required')}
                  </div>
                )}
            </div>
            <div>
              <label>{i18n.t('Email')}</label>
              <Input
                type="text"
                name="email"
                value={user.email || ''}
                disabled={true}
              />
            </div>
            <div>
              <label>{i18n.t('Preferred Currency')}</label>
              {currencys && this.renderCurrencySelect(currencys)}
            </div>
            <div className="subtitle">{i18n.t('Company Information')}</div>
            {user.licenseStatus !== authConsts.LICENSE_STATUS_CONFIRMED && (
              <div className="tips">
                {i18n.t('Please fulfill company information for adding offer')}
              </div>
            )}
            <div>
              <label>{i18n.t('Company Name')}</label>
              <Input
                type="text"
                name="companyName"
                value={user.companyName || ''}
                onChange={this.handleChange}
              />
            </div>
            <div>
              <label>{i18n.t('Company Address')}</label>
              <Input
                type="text"
                name="companyAddress"
                value={user.companyAddress || ''}
                onChange={this.handleChange}
              />
            </div>
            <div>
              <div>
                <label>{i18n.t('Business License')}</label>
                <div className="upload-profile clearfix">
                  <Upload
                    listType="picture-card"
                    fileList={licenseList}
                    accept="image/*"
                    customRequest={this.customRequest}
                    onChange={(file: UploadChangeParam) =>
                      this.handleUpload(file.file)
                    }
                    onPreview={this.handlePreview}
                    onRemove={this.handleDeleteImage}
                  >
                    <div>
                      <Icon type="plus" />
                      <div className="ant-upload-text">{i18n.t('Upload')}</div>
                    </div>
                  </Upload>
                </div>
              </div>
            </div>
            <div>
              <Button
                htmlType="submit"
                type="primary"
                className="button-margin"
              >
                {i18n.t('Submit')}
              </Button>
              {processing && <Icon type="loading" />}
              <Button>
                <Link to="/">{i18n.t('Cancel')}</Link>
              </Button>
            </div>
          </form>
        </Col>
      </Row>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { user, auth, currency, upload } = state
  return {
    userState: user,
    authInfo: auth.authInfo,
    currencys: currency.items,
    upload
  }
}

const connectedProfilePage = connect(mapStateToProps)(ProfilePage)
export { connectedProfilePage as ProfilePage }
