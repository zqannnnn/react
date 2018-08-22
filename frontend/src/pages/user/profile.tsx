import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import {Location} from 'history';
import {consts} from "../../../../src/config/static"
import {
  userActionCreators,
  AuthInfo,
  currencyActionCreators,
  lightboxActionCreators
} from '../../actions'
import { RootState, UserState } from '../../reducers'
import { User, Currency, Image } from '../../models'
import { Row, Col, Select, Button } from 'antd'
import { UploadFile } from 'antd/lib/upload/interface'
import i18n from 'i18next'
import { UserForm, UserValuesProps, CompanyForm, CompanyValuesProps } from '../../components/form'

interface ProfileProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch<RootState>
  userState: UserState
  authInfo: AuthInfo
  currencies: Currency[]
}
interface ProfileState {
  userId: string
  user: User
  userSelf: boolean
  personalVisible: boolean
  modalVisible: boolean
  path?:string
}
class ProfilePage extends React.Component<ProfileProps, ProfileState> {
  constructor(props: ProfileProps) {
    super(props)
    this.state = {
      user: {},
      userId: '',
      userSelf: true,
      personalVisible: false,
      modalVisible: false
    }
  }
  componentDidMount() {
    let userId = this.props.match.params.id
    if (userId) {
      userId &&
        this.setState({
          ...this.state,
          userId
        })
      userId && this.props.dispatch(userActionCreators.getById(userId))
    } else {
      this.props.authInfo.id &&
        this.props.dispatch(userActionCreators.getById(this.props.authInfo.id))
      if (!this.props.currencies)
        this.props.dispatch(currencyActionCreators.getAll())
    }
  }
  showPersonalModal = () => {
    this.setState({
      personalVisible: true
    })
  }
  showCompanyModal = () => {
    this.setState({
      modalVisible: true
    })
  }
  hideCompanyModal = () => {
    this.setState({
      modalVisible: false
    })
  }
  hidePersonalModal = () => {
    this.setState({
      personalVisible: false
    })
  }

  componentWillReceiveProps(nextProps: ProfileProps) {
    const { userState } = nextProps
    const { userData } = userState
    const { authInfo } = this.props
    const { user } = this.state
    if(nextProps.match.path !== this.state.path){
      let userId = nextProps.match.params.id
      let path = nextProps.match.path
      if(path){
        this.setState({
          path:path
        })
      }
      if (userId) {
        userId &&
          this.setState({
            userId:userId, 
          })
        userId && nextProps.dispatch(userActionCreators.getById(userId))
      } else {
          nextProps.authInfo.id &&
          nextProps.dispatch(userActionCreators.getById(nextProps.authInfo.id))
        if (!nextProps.currencies)
          nextProps.dispatch(currencyActionCreators.getAll())
      }
    }
    if (userData) {
      this.setState({
        user: {
          ...userData,
          ...user
        },
        userSelf: userData.id === authInfo.id
      })
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
    this.props.dispatch(currencyActionCreators.upCurrencyStatus(value))
  }
  personalSubmit = (values: UserValuesProps) => {
    const { user } = this.state
    const { dispatch } = this.props
    let newUser = {
      ...user,
      firstName: values.firstName,
      email: values.email,
      lastName: values.lastName
    }
    dispatch(userActionCreators.update(newUser))
    this.setState({ user: newUser })
  }
  companySubmit = (values: CompanyValuesProps, fileList: UploadFile[]) => {
    const { user } = this.state
    const { dispatch } = this.props
    let businessLicenses: Image[] = []
    fileList.forEach((file: any) => businessLicenses.push({ path: file.url }))
    let newUser:User = {
      ...user,
      companyName: values.companyName,
      companyAddress: values.companyAddress,
      businessLicenses,
      licenseStatus:consts.LICENSE_STATUS_UNCONFIRMED
    }
    dispatch(userActionCreators.update(newUser))
    this.setState({ user: newUser })
  }
  //for render select input
  renderCurrencySelect = () => {
    let preferCurrency = this.state.user.preferredCurrencyCode || ''
    const { currencies } = this.props
    return (
      <Select
        value={String(preferCurrency)}
        onSelect={(value: string) =>
          this.handleSelect(value, 'preferredCurrencyCode')
        }
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
  handlePreview = (file: UploadFile) => {
    file.url && this.openLightbox(file.url)
  }

  openLightbox = (image: string) => {
    this.props.dispatch(lightboxActionCreators.open(image))
  }

  render() {
    const { user, userSelf } = this.state
    let imagePaths: string[]
    if (user && user.businessLicenses) {
      imagePaths = user.businessLicenses.map(image => image.path)
    } else {
      imagePaths = []
    }
    return (
      <Row type="flex" justify="space-around" align="middle" className="profile-page">
        <Col span={20}>
          <h2 className="header-center">{i18n.t('User Profile')}</h2>
          <div className="subtitle">
            {i18n.t('Personal Information')}
            <span className={userSelf ? 'edit' : 'none'}>
              <a onClick={this.showPersonalModal}>{i18n.t('Edit')}</a>
            </span>
            <UserForm
              handleSubmit={this.personalSubmit}
              user={user}
              visible={this.state.personalVisible}
              handleCancel={this.hidePersonalModal}
              renderCurrencySelect={this.renderCurrencySelect}
            />
          </div>
          <div className="view-content">
            <Row>
              <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 17, offset: 5 }}
              >
                <label>{i18n.t('Name')}:</label>
                <div className="message">
                  {user.firstName} {user.lastName}
                </div>
              </Col>
            </Row>
            <Row>
              <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 17, offset: 5 }}
              >
                <label>{i18n.t('Email')}:</label>
                <div className="message">{user.email}</div>
              </Col>
            </Row>
            <Row className={userSelf ? '' : 'none'}>
              <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 17, offset: 5 }}
              >
                <label>{i18n.t('Preferred Currency')}</label>
                <div className={userSelf ? 'message' : 'none'}>
                  {user.preferredCurrencyCode}
                </div>
              </Col>
            </Row>
          </div>
          <div className="subtitle">
            {i18n.t('Company Information')}
            <span className={userSelf ? ' edit' : 'none'}>
              <a onClick={this.showCompanyModal}>{i18n.t('Edit')}</a>
            </span>

            <CompanyForm
              handleSubmit={this.companySubmit}
              user={user}
              modalVisible={this.state.modalVisible}
              handleCancel={this.hideCompanyModal}
              handlePreview={this.handlePreview}
            />
          </div>
          <div className="view-content">
            <Row>
              <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 17, offset: 5 }}
              >
                <label>{i18n.t('Company Name')}:</label>
                <div className="message">{user.companyName}</div>
              </Col>
            </Row>
            <Row>
              <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 17, offset: 5 }}
              >
                <label>{i18n.t('Company Address')}:</label>
                <div className="message">{user.companyAddress}</div>
              </Col>
            </Row>
            <Row>
              <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 17, offset: 5 }}
              >
                <label>{i18n.t('Business License')}:</label>
                <div className="image-wr">
                  {imagePaths && (
                    <div className="images-container">
                      {imagePaths.map((image, index) => (
                        <div key={index} className="image-wrapper">
                          <img
                            className="image cursor-pointer"
                            onClick={() => this.openLightbox(imagePaths[index])}
                            src={image}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { user, auth, currency } = state
  return {
    userState: user,
    authInfo: auth.authInfo,
    currencies: currency.items
  }
}
const connectedProfilePage = connect(mapStateToProps)(ProfilePage)
export { connectedProfilePage as ProfilePage }
