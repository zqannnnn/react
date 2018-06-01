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
import { Offer } from '../../models'
import { Category, CategoryDetails, Currency } from '../../models'
import { RootState } from '../../reducers'
import { offerConsts, userConsts } from '../../constants'
import { FormattedMessage } from 'react-intl'
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
  Icon,
  Modal
} from 'antd'

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
  previewVisible: boolean
  previewImage: string
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
      current: 0,
      previewVisible: false,
      previewImage: ' '
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
  handleUpload = (files: FileList | null, isCertificate?: boolean) => {
    let image = files ? files[0] : null
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
  handleDeleteImage = (imageIndex: number) => {
    const { offer } = this.state
    const { images } = offer
    if (images) {
      let newImages = images.filter(
        (image: { path: string }, index: number) => {
          return index != imageIndex
        }
      )
      this.setState({ offer: { ...offer, images: newImages } })
    }
  }

  handleDeleteCertificate = (index: number) => {
    const { offer } = this.state
    const { certificates } = offer
    if (certificates) {
      let newCertificates = certificates.filter(
        (image: { path: string }, i: number) => {
          return i != index
        }
      )
      this.setState({ offer: { ...offer, certificates: newCertificates } })
    }
  }

  openLightbox = (images: string[], index: number) => {
    this.props.dispatch(lightboxActionCreators.open(images, index))
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
    let imagePaths: string[]
    if (this.state.offer.images) {
      imagePaths = this.state.offer.images.map(image => image.path)
    } else {
      imagePaths = []
    }
    let certificatePaths: string[]
    if (this.state.offer.certificates) {
      certificatePaths = this.state.offer.certificates.map(image => image.path)
    } else {
      certificatePaths = []
    }
    const { previewVisible, previewImage } = this.state
    switch (current) {
      case 0:
        return (
          <>
            <label>
              <FormattedMessage
                id="itemFields.offerType"
                defaultMessage="Offer Type"
              />
            </label>
            <Row type="flex" justify="start">
              <Col sm={12} md={12} lg={12}>
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
          </>
        )
      case 1:
        return (
          <>
            <label>
              <FormattedMessage
                id="itemFields.images"
                defaultMessage="Images"
              />
            </label>
            <div className="images-container">
              {imagePaths.map((image, index) => (
                <div key={index} className="image-wrapper">
                  <i
                    className="fa fa-times-circle remove-icon"
                    aria-hidden="true"
                    onClick={() => {
                      this.handleDeleteImage(index)
                    }}
                  />
                  <img
                    className="image"
                    src={image}
                    onClick={() => this.openLightbox(imagePaths, index)}
                  />
                </div>
              ))}
              <div className="image-add">
                <i className="fa fa-plus-circle add-icon" aria-hidden="true" />
                <input
                  type="file"
                  onChange={e => this.handleUpload(e.target.files)}
                />
              </div>
            </div>
            <Modal footer={null}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>

            <label>
              <FormattedMessage
                id="itemFields.certificates"
                defaultMessage="Certificates"
              />
            </label>
            <div className="images-container">
              {certificatePaths.map((certificate, index) => (
                <div key={index} className="image-wrapper">
                  <i
                    className="fa fa-times-circle remove-icon"
                    aria-hidden="true"
                    onClick={() => {
                      this.handleDeleteCertificate(index)
                    }}
                  />
                  <img
                    className="image"
                    src={certificate}
                    onClick={() => this.openLightbox(certificatePaths, index)}
                  />
                </div>
              ))}
              <div className="image-add">
                <i className="fa fa-plus-circle add-icon" aria-hidden="true" />
                <input
                  type="file"
                  onChange={e => this.handleUpload(e.target.files, true)}
                />
              </div>
            </div>
          </>
        )
      case 2:
        return (
          <>
            <Row type="flex" justify="start">
              <Col xs={20} sm={20} md={20} lg={20} offset={2}>
                <div className={submitted && !title ? ' has-error' : ''}>
                  <label className="edits-title">
                    <FormattedMessage
                      id="itemFields.title"
                      defaultMessage="Title"
                    />
                  </label>
                  <Input
                    type="text"
                    name="title"
                    value={title}
                    onChange={this.handleInputChange}
                    placeholder="请输入标题"
                    size="large"
                  />
                  {submitted &&
                    !title && (
                      <div className="invalid-feedback">
                        <FormattedMessage
                          id="itemErrors.missingTitle"
                          defaultMessage="Title is required"
                        />
                      </div>
                    )}
                </div>
              </Col>
            </Row>
            <Row
              type="flex"
              justify="start"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            >
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                <label>
                  <FormattedMessage
                    id="itemFields.bone"
                    defaultMessage="Bone"
                  />
                </label>
                {currentCategory &&
                  this.renderSelect(currentCategory.details['Bone'], 'bone')}
              </Col>
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                <label>
                  <FormattedMessage
                    id="itemFields.storage"
                    defaultMessage="Storage"
                  />
                </label>
                {currentCategory &&
                  this.renderSelect(
                    currentCategory.details['Storage'],
                    'storage'
                  )}
              </Col>
            </Row>
            <Row
              type="flex"
              justify="start"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            >
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                <label>
                  <FormattedMessage
                    id="itemFields.grade"
                    defaultMessage="Grade"
                  />
                </label>
                {currentCategory &&
                  this.renderSelect(currentCategory.details['Grade'], 'grade')}
              </Col>
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                <label>
                  <FormattedMessage
                    id="itemFields.slaughterSpec"
                    defaultMessage="Slaughter Specification"
                  />
                </label>
                {currentCategory &&
                  this.renderSelect(
                    currentCategory.details['Slaughter Specification'],
                    'slaughterSpec'
                  )}
              </Col>
            </Row>
            <Row
              type="flex"
              justify="start"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            >
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                <label>
                  <FormattedMessage
                    id="itemFields.marbleScore"
                    defaultMessage="Marble Score"
                  />
                </label>
                {currentCategory &&
                  this.renderSelect(
                    currentCategory.details['Marble Score'],
                    'marbleScore'
                  )}
              </Col>
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                {currentCategory &&
                  currentCategory.type != 'Sheep' && (
                    <div>
                      <label>
                        <FormattedMessage
                          id="itemFields.breed"
                          defaultMessage="Breed"
                        />
                      </label>
                      {this.renderSelect(
                        currentCategory.details['Breed'],
                        'breed'
                      )}
                    </div>
                  )}
              </Col>
            </Row>
            <Row
              type="flex"
              justify="start"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            >
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                {currentCategory &&
                  currentCategory.type == 'Beef' && (
                    <div>
                      <label>
                        <FormattedMessage
                          id="itemFields.fed"
                          defaultMessage="Fed"
                        />
                      </label>
                      {this.renderSelect(currentCategory.details['Fed'], 'fed')}
                    </div>
                  )}
              </Col>
            </Row>
            <Row
              type="flex"
              justify="start"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            >
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                {fed == 'Grain fed' && (
                  <div>
                    <label>
                      <FormattedMessage
                        id="itemFields.grainFedDays"
                        defaultMessage="Grain fed days"
                      />
                    </label>
                    <div>
                      <InputNumber
                        min={0}
                        max={100000}
                        defaultValue={0}
                        onChange={(value: number) =>
                          this.handleInputNumber(value, 'grainFedDays')
                        }
                      />
                      <span className="label-right">
                        <FormattedMessage
                          id="itemFields.day"
                          defaultMessage="Day"
                        />
                      </span>
                    </div>
                  </div>
                )}
              </Col>
            </Row>
            <Row
              type="flex"
              justify="start"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            >
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                <label>
                  <FormattedMessage
                    id="itemFields.primalCuts"
                    defaultMessage="Primal Cuts"
                  />
                </label>
                <Input
                  type="text"
                  name="primalCuts"
                  value={primalCuts}
                  onChange={this.handleInputChange}
                />
              </Col>
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                <div>
                  <label>
                    <FormattedMessage
                      id="itemFields.trimmings"
                      defaultMessage="Trimmings"
                    />
                  </label>
                  <div>
                    <InputNumber
                      min={0}
                      max={100000}
                      defaultValue={0}
                      onChange={(value: number) =>
                        this.handleInputNumber(value, 'trimmings')
                      }
                    />
                    <span className="label-right">CL</span>
                  </div>
                </div>
              </Col>
            </Row>
            <Row
              type="flex"
              justify="start"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            >
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                <label>
                  <FormattedMessage
                    id="itemFields.brand"
                    defaultMessage="Brand"
                  />
                </label>
                <Input
                  type="text"
                  name="brand"
                  value={brand}
                  onChange={this.handleInputChange}
                />
              </Col>
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                <div>
                  <label>
                    <FormattedMessage
                      id="itemFields.factoryNum"
                      defaultMessage="Factory Number"
                    />
                  </label>
                  <Input
                    type="text"
                    name="factoryNum"
                    value={factoryNum}
                    onChange={this.handleInputChange}
                  />
                </div>
              </Col>
            </Row>
            <Row
              type="flex"
              justify="start"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            >
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                <label>
                  <FormattedMessage
                    id="itemFields.placeOfOrigin"
                    defaultMessage="Place Of Origin"
                  />
                </label>
                <Input
                  type="text"
                  name="placeOfOrigin"
                  value={placeOfOrigin}
                  onChange={this.handleInputChange}
                />
              </Col>
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                <label>
                  <FormattedMessage
                    id="itemFields.deliveryTerm"
                    defaultMessage="Delivery Term"
                  />
                </label>
                <Input
                  type="text"
                  name="deliveryTerm"
                  value={deliveryTerm}
                  onChange={this.handleInputChange}
                />
              </Col>
            </Row>
            <Row
              type="flex"
              justify="start"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            >
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                <div>
                  <label>
                    <FormattedMessage
                      id="itemFields.quantity"
                      defaultMessage="Quantity"
                    />
                  </label>
                  <div>
                    <InputNumber
                      max={999999}
                      defaultValue={1}
                      min={1}
                      value={quantity}
                      onChange={(value: number) =>
                        this.handleInputNumber(value, 'quantity')
                      }
                    />
                    <span className="label-right">KG</span>
                  </div>
                </div>
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col sm={17} md={17} lg={17} className="edits-select" offset={2}>
                <label>
                  <FormattedMessage
                    id="itemFields.price"
                    defaultMessage="Price"
                  />
                </label>
                {currencys && (
                  <div>
                    <Col sm={3} md={3} lg={3}>
                      <InputNumber
                        min={0}
                        max={99999}
                        defaultValue={0}
                        value={price}
                        onChange={(value: number) =>
                          this.handleInputNumber(value, 'price')
                        }
                      />
                    </Col>
                    <Col sm={3} md={3} lg={3}>
                      <Select
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
                    </Col>
                    <Col>
                      <span className="label-right">/KG</span>
                    </Col>
                  </div>
                )}
              </Col>
            </Row>
            <Row
              type="flex"
              justify="start"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            >
              <Col sm={8} md={8} lg={8} offset={2}>
                <div className="edits-select">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="button-margin"
                  >
                    <FormattedMessage
                      id="editButton.submit"
                      defaultMessage="Submit"
                    />
                  </Button>
                  {editing && <Icon type="loading" />}
                  <Button>
                    <Link to="/">
                      <FormattedMessage
                        id="editButton.cancel"
                        defaultMessage="Cancel"
                      />
                    </Link>
                  </Button>
                </div>
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
      <div className="edits-container-wrap">
        <h2 className="header-center">
          {this.state.offer.id ? (
            <FormattedMessage
              id="pages.editOfferPage"
              defaultMessage="Edit Offer Page"
            />
          ) : (
            <FormattedMessage
              id="pages.createOfferPage"
              defaultMessage="Create Offer Page"
            />
          )}
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
      </div>
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
