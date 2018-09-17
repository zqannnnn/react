import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { consts } from "../../../../src/config/static"
import {
    userActionCreators,
    AuthInfo,
    currencyActionCreators,
    countryActionCreators,
    lightboxActionCreators
} from '../../actions'
import { RootState, UserState } from '../../reducers'
import { User, Currency, Image, Consignee, Country } from '../../models'
import { Row, Col, Select, Button } from 'antd'
import { UploadFile } from 'antd/lib/upload/interface'
import i18n from 'i18next'
import { UserForm, UserValuesProps, CompanyForm, CompanyValuesProps } from '../../components/form'
import { ChatButton } from '../../components/chat'
import { Record, EditableTable } from '../../components/consignee-editor/'
import './profile.scss'


interface ProfileProps extends RouteComponentProps<{ id: string }> {
    dispatch: Dispatch<RootState>
    userProp: UserState
    authInfo: AuthInfo
    currencies: Currency[]
    countries: Country[]
}

interface ProfileState {
    userId: string
    user: User
    userSelf: boolean
    personalVisible: boolean
    companyVisible: boolean
    path?: string
    selectable: boolean
}

class ProfilePage extends React.Component<ProfileProps, ProfileState> {
    constructor(props: ProfileProps) {
        super(props)
        this.state = {
            user: {},
            userId: '',
            userSelf: false,
            personalVisible: false,
            companyVisible: false,
            selectable: false
        }
    }
    componentDidMount() {
        let userId = this.props.match.params.id
        if (userId) {
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
            if (!this.props.countries)
                this.props.dispatch(countryActionCreators.getAll())
        }
    }

    showPersonalModal = () => {
        this.setState({
            personalVisible: true
        })
    }
    showCompanyModal = () => {
        this.setState({
            companyVisible: true
        })
    }
    personalSubmit = (values: UserValuesProps, ) => {
        const { user } = this.state
        const { dispatch, countries } = this.props
        let newUser = {
            ...user,
            firstName: values.firstName,
            email: values.email,
            lastName: values.lastName,
            preferredCurrencyCode: values.preferredCurrencyCode,
            countryCode: values.countryCode
        }
        dispatch(userActionCreators.update(newUser))
        this.setState({ user: newUser })
    }
    hidePersonalModal = () => {
        this.setState({
            personalVisible: false
        })
    }
    hideCompanyModal = () => {
        this.setState({
            companyVisible: false
        })
    }

    componentWillReceiveProps(nextProps: ProfileProps) {
        const { userProp } = nextProps
        const { userData, processing } = userProp
        const { authInfo } = this.props
        const { user } = this.state
        if (nextProps.match.path !== this.state.path) {
            let userId = nextProps.match.params.id
            let path = nextProps.match.path
            if (path) {
                this.setState({
                    path: path
                })
            }
            if (userId) {
                userId &&
                    this.setState({
                        userId: userId
                    })
                userId && nextProps.dispatch(userActionCreators.getById(userId))
            } else {
                nextProps.authInfo.id &&
                    nextProps.dispatch(userActionCreators.getById(nextProps.authInfo.id))
            }
        }
        if (userData && !processing) {
            this.setState({
                user: {
                    ...user,
                    ...userData
                },
                userSelf: userData.id === authInfo.id
            })
        }
        this.setState({ selectable: false })
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
    companySubmit = (values: CompanyValuesProps, fileList: UploadFile[]) => {
        const { user } = this.state
        const { dispatch } = this.props
        let businessLicenses: Image[] = []
        fileList.forEach((file: any) => businessLicenses.push({ path: file.url }))
        let newUser: User = {
            ...user,
            companyName: values.companyName,
            companyAddress: values.companyAddress,
            businessLicenses,
            licenseStatus: consts.LICENSE_STATUS_UNCONFIRMED
        }
        dispatch(userActionCreators.update(newUser))
        this.setState({ user: newUser })
    }


    handlePreview = (file: UploadFile) => {
        file.url && this.openLightbox(file.url)
    }
    openLightbox = (image: string) => {
        this.props.dispatch(lightboxActionCreators.open(image))
    }
    handleSubmitConsignee = (values: Record) => {
        const { dispatch } = this.props
        let consignee: Consignee = {
            name: values.name,
            email: values.email,
            phoneNum: values.phoneNum,
            address: values.address
        }
        if (values.id)
            dispatch(userActionCreators.editConsignee(consignee, values.id))
        else dispatch(userActionCreators.newConsignee(consignee))
    }

    handleDeleteConsignee = (id: string) => {
        const { dispatch } = this.props
        dispatch(userActionCreators.deleteConsignee(id))
    }
    handleDefaultConsignee = (id: string) => {
        const { dispatch } = this.props
        dispatch(userActionCreators.setDefaultConsignee(id))
    }

    onSelect = () => {
        
    }

    render() {
        const { user, userSelf } = this.state
        let imagePaths: string[]
        if (user && user.businessLicenses) {
            imagePaths = user.businessLicenses.map(image => image.path)
        } else {
            imagePaths = []
        }
        let dataSource: Record[]
        if (user.consignees) {
            dataSource = user.consignees.map((source, index) => ({
                key: index.toString(),
                id: source.id,
                name: source.name,
                email: source.email,
                phoneNum: source.phoneNum,
                address: source.address
            }))
        } else {
            dataSource = []
        }
        
        return (
            <Row type="flex" justify="space-around" align="middle" className="profile-page">
                <Col
                    xs={{ span: 20, offset: 2 }}
                    sm={{ span: 20, offset: 1 }}
                >
                    <h2 className="header-center">{i18n.t('User Profile')}</h2>
                    {!userSelf && <ChatButton user={user} />}
                    <div className="subtitle">
                        {i18n.t('Personal Information')}
                        {userSelf && <span className='edit'>
                            <a onClick={this.showPersonalModal}>{i18n.t('Edit')}</a>
                        </span>}
                        {this.state.personalVisible && <UserForm
                            handleSubmit={this.personalSubmit}
                            user={user}
                            currencies={this.props.currencies}
                            countries={this.props.countries}
                            visible={this.state.personalVisible}
                            handleCancel={this.hidePersonalModal}
                        />}
                    </div>
                    <div className="view-content">
                        <div className="field">
                            <label>{i18n.t('Name')}:</label>
                            <div className="message">
                                {user.firstName} {user.lastName}
                            </div>
                        </div>
                        <div className="field">
                            <label>{i18n.t('Email')}:</label>
                            <div className="message">{user.email}</div>
                        </div>
                        {userSelf&&<div className="field">
                            <label>{i18n.t('Preferred Currency')}:</label>
                            <div className={userSelf ? 'message' : 'none'}>
                                {user.preferredCurrencyCode}
                            </div>
                        </div>}
                        <div className="field">
                            <div className={userSelf ? '' : 'none'}>
                                <label>{i18n.t('Country')}</label>
                                <div className={userSelf ? 'message' : 'none'}>
                                    {user.country && user.country.name}
                                </div>
                            </div>
                        </div>
                        {userSelf&&<div className="field" style={{ marginBottom: 0 }}>
                            <label>{i18n.t('Address')}:</label>
                            {dataSource && <EditableTable
                                data={dataSource}
                                selectable={this.state.selectable}
                                handleSubmit={this.handleSubmitConsignee}
                                handleDelete={this.handleDeleteConsignee}
                                handleDefault={this.handleDefaultConsignee}
                                defaultConsigneeId={this.state.user.defaultConsigneeId}
                                onSelect={this.onSelect}
                            />}
                        </div>}
                    </div>
                    <div className="subtitle company-information">
                        {i18n.t('Company Information')}
                        {userSelf && <span className='edit'>
                            <a onClick={this.showCompanyModal}>{i18n.t('Edit')}</a>
                        </span>}
                        </div>
                        {this.state.companyVisible && <CompanyForm
                            handleSubmit={this.companySubmit}
                            user={user}
                            modalVisible={this.state.companyVisible}
                            handleCancel={this.hideCompanyModal}
                            handlePreview={this.handlePreview}
                        />}
                    <div className="view-content">
                        <div className="field">
                            <label>{i18n.t('Company Name')}:</label>
                            <div className="message">{user.companyName}</div>
                        </div>
                        <div className="field">
                            <label>{i18n.t('Company Address')}:</label>
                            <div className="message">{user.companyAddress}</div>
                        </div>
                        <div className="field">
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
                        </div>
                    </div>
                </Col>
            </Row>
        )
    }
}

function mapStateToProps(state: RootState) {
    const { user, auth, currency, country } = state
    return {
        userProp: user,
        authInfo: auth.authInfo,
        currencies: currency.items,
        countries: country.items
    }
}
const connectedProfilePage = connect(mapStateToProps)(ProfilePage)
export { connectedProfilePage as ProfilePage }
