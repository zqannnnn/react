import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { RouteComponentProps, Link } from 'react-router-dom'
import { consts } from "../../../../src/config/static"
import {
    userActionCreators,
    AuthInfo,
    currencyActionCreators,
    lightboxActionCreators,
    alertActionCreators,
    transactionActionCreators,
    categoryActionCreators,
    goodsActionCreators
} from '../../actions'
import { RootState, UserState } from '../../reducers'
import { User, Currency, Image, Consignee, Transaction, Goods, Category } from '../../models'
import { Row, Col, Select, Button, Icon } from 'antd'
import { UploadFile } from 'antd/lib/upload/interface'
import i18n from 'i18next'
import { UserValuesProps, CompanyValuesProps } from '../../components/form'
import { Record, EditableTable } from '../../components/consignee-editor/'
import '../user/profile.scss'
import{ GoodsInfo } from '../../components'
import { authConsts } from '../../constants'


interface ShippingProps extends RouteComponentProps<{ id: string; goodsId: string }> {
    dispatch: Dispatch<RootState>
    userProp: UserState
    authInfo: AuthInfo
    currencies: Currency[]
    processing: boolean
    categories: Category[]
    transProp: Transaction
    goodsProp: Goods
}

interface ShippingState {
    transaction: Transaction
    userId: string
    user: User
    userSelf: boolean
    personalVisible: boolean
    companyVisible: boolean
    path?: string
    submitted: boolean
    transactionId?: string
    goodsId?: string
    selectable: boolean
}

class ShippingPage extends React.Component<ShippingProps, ShippingState> {
    constructor(props: ShippingProps) {
        super(props)
        this.state = {
            submitted: false,
            user: {},
            transaction: {
                currencyCode: 'USD',
                isMakerSeller: true,
                goods: {}
            },
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
        let transactionId = this.props.match.params.id
        transactionId &&
        this.setState({
            ...this.state,
            transactionId
        })
        let goodsId = this.props.match.params.goodsId
        goodsId &&
        this.setState({
            ...this.state,
            goodsId
        })
        if (!this.props.categories)
        this.props.dispatch(categoryActionCreators.getAll())
        if (!this.props.currencies)
        this.props.dispatch(currencyActionCreators.getAll())
        transactionId &&
        this.props.dispatch(transactionActionCreators.getById(transactionId))
        goodsId && this.props.dispatch(goodsActionCreators.getById(goodsId))

        if (this.props.authInfo && this.props.authInfo.preferredCurrencyCode) {
        const transaction = this.state.transaction
        this.setState({
            transaction: {
            ...transaction,
            currencyCode: this.props.authInfo.preferredCurrencyCode
            }
        })
        }
        this.setState({ selectable: true })
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
    hideCompanyModal = () => {
        this.setState({
            companyVisible: false
        })
    }
    hidePersonalModal = () => {
        this.setState({
            personalVisible: false
        })
    }

    componentWillReceiveProps(nextProps: ShippingProps) {
        const { userProp } = nextProps
        const { userData, processing } = userProp
        const { authInfo } = this.props
        const { user } = this.state
        const { transProp, goodsProp, categories } = nextProps
        const { submitted, transactionId, goodsId, transaction } = this.state
        const goods = transaction.goods
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
                if (!nextProps.currencies)
                    nextProps.dispatch(currencyActionCreators.getAll())
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
        if (transactionId && transProp && !submitted) {
            this.setState({
              transaction: {
                ...transaction,
                ...transProp
              }
            })
          }
          if (!transactionId && categories) {
            this.setState({
              transaction: {
                ...transaction
              }
            })
          }
          if (goodsId && goodsProp && !submitted) {
            this.setState({
              transaction: {
                ...transaction,
                goods: {
                  ...goods,
                  ...goodsProp
                }
              }
            })
          }
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

    handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        this.setState({ submitted: true })
        if (this.state.transaction.isMakerSeller) {
          if (
            this.props.authInfo.licenseStatus !==
            authConsts.LICENSE_STATUS_CONFIRMED
          ) {
            this.props.dispatch(
              alertActionCreators.error(
                'You are not allowed to add new Offer, please finish company info first.'
              )
            )
            window.scrollTo(0, 0)
            return
          }
        }
        const { transaction, transactionId, goodsId } = this.state
        const { dispatch } = this.props
        if (transaction.price) {
          transaction.goodsId = goodsId
          if (transactionId)
            dispatch(transactionActionCreators.edit(transaction, transactionId))
          else dispatch(transactionActionCreators.new(transaction))
        } else {
          
        }
        window.scrollTo(0, 0)
      }

    openLightbox = (image: string) => {
        this.props.dispatch(lightboxActionCreators.open(image))
    }

    render() {
        const { user } = this.state
        const { goods } = this.state.transaction
        let { processing } = this.props
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
        let imagePaths: string[]
        if (user && user.businessLicenses) {
            imagePaths = user.businessLicenses.map(image => image.path)
        } else {
            imagePaths = []
        }
        return (
            <Row type="flex" justify="space-around" align="middle" className="edit-page page">
                <Col
                    xs={{ span: 20, offset: 2 }}
                    sm={{ span: 20, offset: 1 }}
                >
                    <h2 className="header-center">
                        {this.state.transaction.id
                        ? i18n.t('Edit Transaction Page')
                        : i18n.t('Create Transaction Page')}
                    </h2>
                    <form name="form" onSubmit={this.handleSubmit}>
                        <div className="steps-content">
                        {goods && (
                            <div className="field">
                            <GoodsInfo
                            goods={goods}
                            openLightbox={this.openLightbox}
                            />
                            <Row>
                                <Col
                                xs={{ span: 20, offset: 2 }}
                                sm={{ span: 20, offset: 2 }}
                                md={{ span: 20, offset: 2 }}
                                lg={{ span: 20, offset: 2 }}
                                className="field"
                                offset={2}
                                >
                                   <div className="view-content">
                                        <div className="field" style={{ marginBottom: 0 }}>
                                            <label>{i18n.t('Address')}:</label>
                                            {dataSource && <EditableTable
                                                data={dataSource}
                                                selectable={this.state.selectable}
                                                handleSubmit={this.handleSubmitConsignee}
                                                handleDelete={this.handleDeleteConsignee}
                                                handleDefault={this.handleDefaultConsignee}
                                                defaultConsigneeId={this.state.user.defaultConsigneeId}
                                            />}
                                        </div>
                                    </div> 
                                </Col>
                            </Row>
                            <Row>
                                <Col
                                sm={20}
                                md={8}
                                lg={8}
                                offset={2}
                                className="footer"
                                >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                >
                                    {i18n.t('Submit')}
                                </Button>
                                {processing && <Icon type="loading" />}
                                <Button className="button-left">
                                    <Link to="/">{i18n.t('Cancel')}</Link>
                                </Button>
                                </Col>
                            </Row>
                            </div>
                        )}
                        </div>
                    </form>
                </Col>
            </Row>
        )
    }
}

function mapStateToProps(state: RootState) {
    const { user, auth, currency, transaction, category, goods } = state
    const { processing, transData } = transaction
    const { goodsData } = goods
    return {
        userProp: user,
        authInfo: auth.authInfo,
        currencies: currency.items,
        processing,
        categories: category.items,
        transProp: transData,
        goodsProp: goodsData
    }
}
const connectedShippingPage = connect(mapStateToProps)(ShippingPage)
export { connectedShippingPage as ShippingPage }
