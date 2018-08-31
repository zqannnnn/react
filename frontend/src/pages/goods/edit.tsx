import * as React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import {
  goodsActionCreators,
  categoryActionCreators,
  lightboxActionCreators,
  AuthInfo
} from '../../actions'
import { Goods, Image } from '../../models'
import { Category } from '../../models'
import { RootState } from '../../reducers'
import { goodsConsts } from '../../constants'
import { authHeader } from '../../helpers/auth'
import {
  Steps,
  Button,
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
const { TextArea } = Input

interface GoodsProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch<RootState>
  loading: boolean
  processing: boolean
  goodsProp: Goods
  categories: Category[]
  image: string
  authInfo: AuthInfo
}
interface GoodsState {
  goods: Goods
  goodsId?: string
  submitted: boolean
  current: number
  fileList: UploadFile[]
  certificateList: UploadFile[]
}

class EditPage extends React.Component<GoodsProps, GoodsState> {
  constructor(props: GoodsProps) {
    super(props)
    this.state = {
      submitted: false,
      goods: {
        category: 'Beef',
        ifExist: true
      },
      current: 0,
      fileList: [],
      certificateList: []
    }
  }
  next() {
    if (this.state.goods) {
      const current = this.state.current + 1
      this.setState({ current })
    }
  }
  prev() {
    const current = this.state.current - 1
    this.setState({ current })
  }

  componentDidMount() {
    let goodsId = this.props.match.params.id
    goodsId &&
      this.setState({
        ...this.state,
        goodsId
      })
    if (!this.props.categories)
      this.props.dispatch(categoryActionCreators.getAll())

    goodsId && this.props.dispatch(goodsActionCreators.getById(goodsId))
  }
  componentWillReceiveProps(nextProps: GoodsProps) {
    const { goodsProp } = nextProps
    const { submitted, goodsId, goods } = this.state
    if (goodsId && goodsProp && !submitted) {
      this.setState({
        goods: {
          ...goods,
          ...goodsProp
        }
      })
    }
    if (goods && goods.images) {
      let licenseList = goods.images.map(
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
    if (goods && goods.certificates) {
      let licenseList = goods.certificates.map(
        (license, index): UploadFile => ({
          url: license.path,
          name: '',
          uid: index,
          size: 200,
          type: 'done'
        })
      )
      this.setState({ certificateList: licenseList })
    }
  }
  handleSelectChange = (value: string, name: string) => {
    const { goods } = this.state
    this.setState({
      goods: {
        ...goods,
        [name]: value
      }
    })
  }
  handleInputChange = (
    e: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>
  ) => {
    const { value, name } = e.currentTarget
    const { goods } = this.state
    this.setState({
      goods: {
        ...goods,
        [name]: value
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
  certificateChange = (fileParam: UploadChangeParam) => {
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

    this.setState({ certificateList: fileList })
  }
  handleInputNumber = (value: string | number, name: string | number) => {
    const { goods } = this.state
    this.setState({
      goods: {
        ...goods,
        [name]: value
      }
    })
  }

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    this.setState({ submitted: true })
    const { goods, goodsId, fileList, certificateList } = this.state

    const { dispatch } = this.props
    if (goods.category && goods.title && goods.quantity) {
      let images: Image[] = []
      let certificates: Image[] = []
      fileList.forEach((file: any) => images.push({ path: file.url }))
      certificateList.forEach((file: any) =>
        certificates.push({ path: file.url })
      )
      let newGoods = {
        ...goods,
        certificates: certificates,
        images: images
      }
      if (goodsId) dispatch(goodsActionCreators.edit(newGoods, goodsId))
      else dispatch(goodsActionCreators.new(newGoods))
    } else {
      //dispatch(alertActionCreators.error(""));
    }
    window.scrollTo(0, 0)
  }
  openLightbox = (image: string) => {
    this.props.dispatch(lightboxActionCreators.open(image))
  }

  handlePreview = (file: UploadFile) => {
    file.url && this.openLightbox(file.url)
  }
  //for render select input
  renderSelect(optionItems: Array<string>, field: keyof Goods) {
    let selectValue = this.state.goods[field] || ''
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
      title,
      desc,
      quantity,
      primalCuts,
      brand,
      factoryNum,
      deliveryTerm,
      placeOfOrigin,
      fed,
      grainFedDays,
      trimmings,
      category
    } = this.state.goods
    let { submitted, fileList, certificateList } = this.state
    let { processing, categories } = this.props
    let currentCategory: Category =
      categories &&
      categories.filter((item: Category) => {
        return item.type === category
      })[0]
    switch (current) {
      case 0:
        return (
          <Row>
            <Col
              xs={{ span: 20, offset: 2 }}
              sm={{ span: 20, offset: 2 }}
              md={{ span: 9, offset: 2 }}
              lg={{ span: 9, offset: 2 }}
              className="edits-input"
            >
              <label>{i18n.t('Category')}</label>
              <Select
                size="large"
                value={category}
                onSelect={(value: string) =>
                  this.handleSelectChange(value, 'category')
                }
              >
                {goodsConsts.CATEGORY.map((item, index) => (
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
              <div className="upload-transactions-edit">
                <div className="clearfix">
                  <Upload
                    action="/upload/image"
                    headers={authHeader()}
                    accept="image/*"
                    listType="picture-card"
                    fileList={fileList}
                    onChange={this.handleChange}
                    onPreview={this.handlePreview}
                  >
                    <div>
                      <Icon type="plus" />
                      <div className="ant-upload-text">{i18n.t('Upload')}</div>
                    </div>
                  </Upload>
                </div>
              </div>
              <label>{i18n.t('Certificates')}</label>
              <div className="upload-transactions-edit">
                <div className="clearfix">
                  <Upload
                    action="/upload/image"
                    headers={authHeader()}
                    accept="image/*"
                    listType="picture-card"
                    fileList={certificateList}
                    onChange={this.certificateChange}
                    onPreview={this.handlePreview}
                  >
                    <div>
                      <Icon type="plus" />
                      <div className="ant-upload-text">{i18n.t('Upload')}</div>
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
            <div className="edits-input">
              <Row>
                <Col span={20} offset={2} className="edits-input">
                  <div className={submitted && !title ? ' has-error' : ''}>
                    <label className="edits-input">{i18n.t('Title')}</label>
                    <Input
                      placeholder=""
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
                <Col span={20} offset={2} className="edits-input">
                  <label>{i18n.t('Description')}</label>
                  <TextArea
                    placeholder=""
                    name="desc"
                    rows={4}
                    value={desc}
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
                  className="edits-input"
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
                  className="edits-input"
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
                  className="edits-input"
                >
                  <label>{i18n.t('Grade')}</label>
                  {currentCategory &&
                    this.renderSelect(
                      currentCategory.details['Grade'],
                      'grade'
                    )}
                </Col>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 9, offset: 2 }}
                  lg={{ span: 9, offset: 2 }}
                  className="edits-input"
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
                  className="edits-input"
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
                      className="edits-input"
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
                      className="edits-input"
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
                    className="edits-input"
                  >
                    <label>{i18n.t('Grain fed days')}</label>
                    <div className="flex">
                      <InputNumber
                        min={0}
                        max={100000}
                        defaultValue={grainFedDays}
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
                  className="edits-input"
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
                  className="edits-input"
                >
                  <label>{i18n.t('Trimmings')}</label>
                  <div className="flex">
                    <InputNumber
                      min={0}
                      max={100000}
                      defaultValue={trimmings}
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
                  className="edits-input"
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
                  className="edits-input"
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
                  className="edits-input"
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
                  className="edits-input"
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
                  className="edits-input"
                >
                  <div className={submitted && !quantity ? 'has-error' : ''}>
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
                    {submitted &&
                      !quantity && (
                        <div className="invalid-feedback">
                          {i18n.t('Quantity is required')}
                        </div>
                      )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm={20} md={8} lg={8} offset={2} className="edits-input">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="button-margin"
                  >
                    {i18n.t('Submit')}
                  </Button>
                  {processing && <Icon type="loading" />}
                  <Button>
                    <Link to="/">{i18n.t('Cancel')}</Link>
                  </Button>
                </Col>
              </Row>
            </div>
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
      <Row className="edit-page page">
        <Col
          xs={{ span: 22, offset: 1 }}
          sm={{ span: 22, offset: 1 }}
          md={{ span: 20, offset: 2 }}
          lg={{ span: 20, offset: 2 }}
        >
          <h2 className="header-center">
            {this.state.goods.id
              ? i18n.t('Edit Goods Page')
              : i18n.t('Create Goods Page')}
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
                  {i18n.t('Next')}
                </Button>
              )}

              {this.state.current > 0 && (
                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                  {i18n.t('Previous')}
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
  const { goods, category, auth } = state
  const { processing, goodsData } = goods
  return {
    processing,
    categories: category.items,
    goodsProp: goodsData,
    authInfo: auth.authInfo
  }
}
const connectedEditPage = connect(mapStateToProps)(EditPage)
export { connectedEditPage as EditPage }
