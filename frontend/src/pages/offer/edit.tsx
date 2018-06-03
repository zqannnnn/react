import * as React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import {
  offerActionCreators,
  categoryActionCreators,
  currencyActionCreators,
  uploadActionCreators,
  lightboxActionCreators,
  alertActionCreators,
  AuthInfo
} from '../../actions'
import { Offer, Image } from '../../models'
import { Category, CategoryDetails, Currency } from '../../models'
import { RootState } from '../../reducers'
import { offerConsts, userConsts } from '../../constants'
import {
  Steps,
  Button,
  message,
  Row,
  Col,
  Input,
  InputNumber,
  Select,
  Upload,
  Icon
} from 'antd'
import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface'
import i18n from 'i18next'

const Step = Steps.Step

interface OfferProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch<RootState>
  loading: boolean
  editing: boolean
  offerData: Offer
  categorys: Category[]
  currencys: Currency[]
  image: string
  authInfo: AuthInfo
}
interface OfferState {
  offer: Offer
  offerId?: string
  submitted: boolean
  imageUploading: boolean
  certificateUploading: boolean
  current: number
}

class EditPage extends React.Component<OfferProps, OfferState> {
  constructor(props: OfferProps) {
    super(props)
    this.state = {
      submitted: false,
      offer: {
        type: 'Beef'
      },
      imageUploading: false,
      certificateUploading: false,
      current: 0
    }
  }
  next() {
    const current = this.state.current + 1
    this.setState({ current })
  }
  prev() {
    const current = this.state.current - 1
    this.setState({ current })
  }

  componentDidMount() {
    let offerId = this.props.match.params.id
    offerId &&
      this.setState({
        ...this.state,
        offerId
      })
    if (!this.props.categorys)
      this.props.dispatch(categoryActionCreators.getAll())
    if (!this.props.currencys)
      this.props.dispatch(currencyActionCreators.getAll())
    offerId && this.props.dispatch(offerActionCreators.getById(offerId))
  }
  componentWillReceiveProps(nextProps: OfferProps) {
    const { offerData, image, categorys } = nextProps
    const {
      submitted,
      offerId,
      offer,
      imageUploading,
      certificateUploading
    } = this.state
    if (offerId && offerData && !submitted) {
      this.setState({
        offer: {
          ...offerData,
          ...offer
        }
      })
    }
    if (!offerId && categorys) {
      this.setState({
        offer: {
          ...offer
        }
      })
    }
    if (image && imageUploading) {
      if (offer.images) {
        this.setState({
          offer: {
            ...offer,
            images: [...offer.images, { path: image }]
          }
        })
      } else {
        this.setState({
          offer: {
            ...offer,
            images: [{ path: image }]
          }
        })
      }
      this.props.dispatch(uploadActionCreators.clear())
      this.setState({ imageUploading: false })
    }
    if (image && certificateUploading) {
      if (offer.certificates) {
        this.setState({
          offer: {
            ...offer,
            certificates: [...offer.certificates, { path: image }]
          }
        })
      } else {
        this.setState({
          offer: {
            ...offer,
            certificates: [{ path: image }]
          }
        })
      }
      this.props.dispatch(uploadActionCreators.clear())
      this.setState({ certificateUploading: false })
    }
  }
  handleSelectChange = (value: string, name: string) => {
    const { offer } = this.state
    this.setState({
      offer: {
        ...offer,
        [name]: value
      }
    })
  }
  handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value, name } = e.currentTarget
    const { offer } = this.state
    this.setState({
      offer: {
        ...offer,
        [name]: value
      }
    })
  }

  handleInputNumber = (value: string | number, name: string | number) => {
    const { offer } = this.state
    this.setState({
      offer: {
        ...offer,
        [name]: value
      }
    })
  }

  handleUpload = (uploadFile: UploadFile, isCertificate?: boolean) => {
    let image = uploadFile.originFileObj
    this.props.dispatch(uploadActionCreators.uploadImage(image))
    if (isCertificate) {
      this.setState({ certificateUploading: true })
    } else {
      this.setState({ imageUploading: true })
    }
  }
  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    this.setState({ submitted: true })
    if (
      this.props.authInfo.licenseStatus !== userConsts.LICENSE_STATUS_CONFIRMED
    ) {
      this.props.dispatch(
        alertActionCreators.error(
          'You are not allowed to add offer, please fullfill company info first.'
        )
      )
      window.scrollTo(0, 0)
      return
    }
    const { offer, offerId } = this.state
    const { dispatch } = this.props
    if (offer.type && offer.title) {
      if (offerId) dispatch(offerActionCreators.edit(offer, offerId))
      else dispatch(offerActionCreators.new(offer))
    } else {
      //dispatch(alertActionCreators.error(""));
    }
    window.scrollTo(0, 0)
  }
  handleDeleteImage = (uploadFile: UploadFile) => {
    const { offer } = this.state
    const { images } = offer
    const uid = uploadFile.uid
    if (images) {
      let newImages = images.filter((image: Image, index: number) => {
        return uid != index
      })
      this.setState({
        offer: { ...offer, images: newImages }
      })
      return true
    }
  }

  handleDeleteCertificate = (uploadFile: UploadFile) => {
    const { offer } = this.state
    const { certificates } = offer
    const uid = uploadFile.uid
    if (certificates) {
      let newCertificates = certificates.filter(
        (image: Image, index: number) => {
          return uid != index
        }
      )
      this.setState({ offer: { ...offer, certificates: newCertificates } })
      return true
    }
  }
  openLightbox = (images: string[], index: number) => {
    this.props.dispatch(lightboxActionCreators.open(images, index))
  }

  handlePreview = (file: UploadFile) => {
    file.url && this.openLightbox([file.url], 0)
  }
  //for render select input
  renderSelect(optionItems: Array<string>, field: keyof Offer) {
    let selectValue = this.state.offer[field] || ' '
    return (
      <Select
        value={String(selectValue)}
        onSelect={(value: string) => this.handleSelectChange(value, field)}
      >
        {optionItems.map((item, index) => (
          <Select.Option key={index} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>
    )
  }

  renderItem = (current: number) => {
    let {
      id,
      type,
      images,
      certificates,
      price,
      bone,
      title,
      quantity,
      primalCuts,
      brand,
      factoryNum,
      deliveryTerm,
      placeOfOrigin,
      fed,
      grainFedDays,
      trimmings
    } = this.state.offer
    let { submitted } = this.state
    let { editing, categorys, currencys } = this.props
    let options = null
    let currentCategory: Category =
      categorys &&
      categorys.filter((category: Category) => {
        return category.type === type
      })[0]

    let imageList: UploadFile[]
    if (this.state.offer.images) {
      imageList = this.state.offer.images.map(
        (image, index): UploadFile => ({
          url: image.path,
          name: '',
          uid: index,
          size: 200,
          type: 'done'
        })
      )
    } else {
      imageList = []
    }
    let certificateList: UploadFile[]
    if (this.state.offer.certificates) {
      certificateList = this.state.offer.certificates.map(
        (image, index): UploadFile => ({
          url: image.path,
          name: '',
          uid: index,
          size: 200,
          type: 'done'
        })
      )
    } else {
      certificateList = []
    }
    switch (current) {
      case 0:
        return (
          <Row>
            <Col xs={20} sm={18} md={12} lg={8} offset={1}>
              <label>{i18n.t('Offer Type')}</label>
              <Select
                size="large"
                value={type}
                onSelect={(value: string) =>
                  this.handleSelectChange(value, 'type')
                }
              >
                {offerConsts.OFFER_TYPE.map((item, index) => (
                  <Select.Option key={index} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
        )
      case 1:
        return (
          <Row>
            <Col className="container-upload" span={22} offset={1}>
              <label>{i18n.t('Images')}</label>
              <div className="uploadCls-offers-edit">
                <div className="clearfix">
                  <Upload
                    accept="image/*"
                    listType="picture-card"
                    fileList={imageList}
                    onChange={(file: UploadChangeParam) =>
                      this.handleUpload(file.file)
                    }
                    onPreview={this.handlePreview}
                    onRemove={this.handleDeleteImage}
                  >
                    <div>
                      <Icon type="plus" />
                      <div className="ant-upload-text">Upload</div>
                    </div>
                  </Upload>
                </div>
              </div>
              <label>{i18n.t('Certificates')}</label>
              <div className="uploadCls-offers-edit">
                <div className="clearfix">
                  <Upload
                    accept="image/*"
                    listType="picture-card"
                    fileList={certificateList}
                    onChange={(file: UploadChangeParam) =>
                      this.handleUpload(file.file, true)
                    }
                    onPreview={this.handlePreview}
                    onRemove={this.handleDeleteCertificate}
                  >
                    <div>
                      <Icon type="plus" />
                      <div className="ant-upload-text">Upload</div>
                    </div>
                  </Upload>
                </div>
              </div>
            </Col>
          </Row>
        )
      case 2:
        return (
          <>
            <Row>
              <Col span={20} offset={2}>
                <div className={submitted && !title ? ' has-error' : ''}>
                  <label className="edits-title">{i18n.t('Title')}</label>
                  <Input
                    type="text"
                    name="title"
                    value={title}
                    onChange={this.handleInputChange}
                    size="large"
                  />
                  {submitted &&
                    !title && (
                      <div className="invalid-feedback">
                        {i18n.t('Title is required')}
                      </div>
                    )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 9, offset: 2 }}
                lg={{ span: 9, offset: 2 }}
                className="edits-select"
              >
                <label>{i18n.t('Bone')}</label>
                {currentCategory &&
                  this.renderSelect(currentCategory.details['Bone'], 'bone')}
              </Col>
              <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 9, offset: 2 }}
                lg={{ span: 9, offset: 2 }}
                className="edits-select"
              >
                <label>{i18n.t('Storage')}</label>
                {currentCategory &&
                  this.renderSelect(
                    currentCategory.details['Storage'],
                    'storage'
                  )}
              </Col>
            </Row>
            <Row>
              <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 9, offset: 2 }}
                lg={{ span: 9, offset: 2 }}
                className="edits-select"
              >
                <label>{i18n.t('Grade')}</label>
                {currentCategory &&
                  this.renderSelect(currentCategory.details['Grade'], 'grade')}
              </Col>
              <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 9, offset: 2 }}
                lg={{ span: 9, offset: 2 }}
                className="edits-select"
              >
                <label>{i18n.t('Slaughter Specification')}</label>
                {currentCategory &&
                  this.renderSelect(
                    currentCategory.details['Slaughter Specification'],
                    'slaughterSpec'
                  )}
              </Col>
            </Row>
            <Row>
              <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 9, offset: 2 }}
                lg={{ span: 9, offset: 2 }}
                className="edits-select"
              >
                <label>{i18n.t('Marble Score')}</label>
                {currentCategory &&
                  this.renderSelect(
                    currentCategory.details['Marble Score'],
                    'marbleScore'
                  )}
              </Col>

              {currentCategory &&
                currentCategory.type != 'Sheep' && (
                  <Col
                    xs={{ span: 20, offset: 2 }}
                    sm={{ span: 20, offset: 2 }}
                    md={{ span: 9, offset: 2 }}
                    lg={{ span: 9, offset: 2 }}
                    className="edits-select"
                  >
                    <label>{i18n.t('Breed')}</label>
                    {this.renderSelect(
                      currentCategory.details['Breed'],
                      'breed'
                    )}
                  </Col>
                )}
            </Row>
            <Row>
              {currentCategory &&
                currentCategory.type == 'Beef' && (
                  <Col
                    xs={{ span: 20, offset: 2 }}
                    sm={{ span: 20, offset: 2 }}
                    md={{ span: 9, offset: 2 }}
                    lg={{ span: 9, offset: 2 }}
                    className="edits-select"
                  >
                    <label>{i18n.t('Fed')}</label>
                    {this.renderSelect(currentCategory.details['Fed'], 'fed')}
                  </Col>
                )}

              {fed == 'Grain fed' && (
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 9, offset: 2 }}
                  lg={{ span: 9, offset: 2 }}
                  className="edits-select"
                >
                  <label>{i18n.t('Grain fed days')}</label>
                  <div className="flex">
                    <InputNumber
                      min={0}
                      max={100000}
                      defaultValue={0}
                      onChange={(value: number) =>
                        this.handleInputNumber(value, 'grainFedDays')
                      }
                    />
                    <div className="label-right">{i18n.t('Days')}</div>
                  </div>
                </Col>
              )}
            </Row>
            <Row>
              <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 9, offset: 2 }}
                lg={{ span: 9, offset: 2 }}
                className="edits-select"
              >
                <label>{i18n.t('Primal Cuts')}</label>
                <Input
                  type="text"
                  name="primalCuts"
                  value={primalCuts}
                  onChange={this.handleInputChange}
                />
              </Col>
              <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 9, offset: 2 }}
                lg={{ span: 9, offset: 2 }}
                className="edits-select"
              >
                <label>{i18n.t('Trimmings')}</label>
                <div className="flex">
                  <InputNumber
                    min={0}
                    max={100000}
                    defaultValue={0}
                    onChange={(value: number) =>
                      this.handleInputNumber(value, 'trimmings')
                    }
                  />
                  <div className="label-right">CL</div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 9, offset: 2 }}
                lg={{ span: 9, offset: 2 }}
                className="edits-select"
              >
                <label>{i18n.t('Brand')}</label>
                <Input
                  type="text"
                  name="brand"
                  value={brand}
                  onChange={this.handleInputChange}
                />
              </Col>
              <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 9, offset: 2 }}
                lg={{ span: 9, offset: 2 }}
                className="edits-select"
              >
                <label>{i18n.t('Factory Number')}</label>
                <Input
                  type="text"
                  name="factoryNum"
                  value={factoryNum}
                  onChange={this.handleInputChange}
                />
              </Col>
            </Row>
            <Row>
              <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 9, offset: 2 }}
                lg={{ span: 9, offset: 2 }}
                className="edits-select"
              >
                <label>{i18n.t('Place Of Origin')}</label>
                <Input
                  type="text"
                  name="placeOfOrigin"
                  value={placeOfOrigin}
                  onChange={this.handleInputChange}
                />
              </Col>
              <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 9, offset: 2 }}
                lg={{ span: 9, offset: 2 }}
                className="edits-select"
              >
                <label>{i18n.t('Delivery Term')}</label>
                <Input
                  type="text"
                  name="deliveryTerm"
                  value={deliveryTerm}
                  onChange={this.handleInputChange}
                />
              </Col>
            </Row>
            <Row>
              <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 9, offset: 2 }}
                lg={{ span: 9, offset: 2 }}
                className="edits-select"
              >
                <label>{i18n.t('Quantity')}</label>
                <div className="flex">
                  <InputNumber
                    max={999999}
                    defaultValue={1}
                    min={1}
                    value={quantity}
                    onChange={(value: number) =>
                      this.handleInputNumber(value, 'quantity')
                    }
                  />
                  <div className="label-right">KG</div>
                </div>
              </Col>
              <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 9, offset: 2 }}
                lg={{ span: 9, offset: 2 }}
                className="edits-select"
                offset={2}
              >
                <label>{i18n.t('Price')}</label>
                {currencys && (
                  <div className="flex">
                    <InputNumber
                      min={0}
                      max={99999}
                      defaultValue={0}
                      value={price}
                      onChange={(value: number) =>
                        this.handleInputNumber(value, 'price')
                      }
                    />
                    <Select
                      className="label-right"
                      placeholder="currencys"
                      value={this.state.offer['currencyCode']}
                      onSelect={(value: string) =>
                        this.handleSelectChange(value, 'currencyCode')
                      }
                    >
                      {currencys.map((item, index) => (
                        <Select.Option key={index} value={item.code}>
                          {item.code}
                        </Select.Option>
                      ))}
                    </Select>
                    <div className="label-right">/KG</div>
                  </div>
                )}
              </Col>
            </Row>
            <Row>
              <Col sm={20} md={8} lg={8} offset={2} className="edits-select">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="button-margin"
                >
                  {i18n.t('Submit')}
                </Button>
                {editing && <Icon type="loading" />}
                <Button>
                  <Link to="/">{i18n.t('Cancel')}</Link>
                </Button>
              </Col>
            </Row>
          </>
        )
      default:
        break
    }
  }
  render() {
    const { current } = this.state
    const steps = [
      {
        title: 'First'
      },
      {
        title: 'Second'
      },
      {
        title: 'Last'
      }
    ]
    return (
      <Row className="edit-page">
        <Col
          xs={24}
          sm={{ span: 22, offset: 1 }}
          md={{ span: 20, offset: 2 }}
          lg={{ span: 20, offset: 2 }}
        >
          <h2 className="header-center">
            {this.state.offer.id
              ? i18n.t('Edit Offer Page')
              : i18n.t('Create Offer Page')}
          </h2>
          <form name="form" onSubmit={this.handleSubmit}>
            <Steps current={current}>
              {steps.map(item => <Step key={item.title} title={item.title} />)}
            </Steps>
            <div className="steps-content">
              {this.renderItem(this.state.current)}
            </div>
            <div className="steps-action">
              {this.state.current < steps.length - 1 && (
                <Button type="primary" onClick={() => this.next()}>
                  Next
                </Button>
              )}

              {this.state.current > 0 && (
                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                  Previous
                </Button>
              )}
            </div>
          </form>
        </Col>
      </Row>
    )
  }
}
function mapStateToProps(state: RootState) {
  const { offer, category, currency, upload, auth } = state
  const { editing, loading, offerData } = offer
  return {
    editing,
    categorys: category.items,
    currencys: currency.items,
    offerData,
    image: upload.image,
    authInfo: auth.authInfo
  }
}
const connectedEditPage = connect(mapStateToProps)(EditPage)
export { connectedEditPage as EditPage }
