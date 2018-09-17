import * as React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import { adminActionCreators, lightboxActionCreators } from '../../actions'
import { Goods } from '../../models'
import { RootState, AdminState } from '../../reducers'
import { Icon, Row, Col } from 'antd'
import i18n from 'i18next'

interface ConfirmProps
  extends RouteComponentProps<{
      id: string
    }> {
  dispatch: Dispatch<RootState>
  comfirmingGoods: Goods
  loading: boolean
  processing: boolean
}
class GoodsConfirmPage extends React.Component<ConfirmProps> {
  constructor(props: ConfirmProps) {
    super(props)
  }
  componentDidMount() {
    let goodsId = this.props.match.params.id
    goodsId &&
      this.props.dispatch(adminActionCreators.getConfirmingGoods(goodsId))
  }
  handleConfirm = (id: string) => {
    this.props.dispatch(adminActionCreators.goodsConfirm(id))
  }
  handleDisconfirm = (id: string) => {
    this.props.dispatch(adminActionCreators.goodsDisconfirm(id))
  }
  openLightbox = (image: string) => {
    this.props.dispatch(lightboxActionCreators.open(image))
  }
  renderFiles(url:string,index:number){
    let fileName = url.split('/')[3]
    return (
      <div key={index} className="image-wrapper">
        <span>{fileName}:</span>  <a href={url} download={fileName}>download</a>
      </div>)
  }
  render() {
    const { comfirmingGoods, loading, processing } = this.props
    let licensePaths: string[]= []
    let id = this.props.match.params.id
    if (comfirmingGoods) {
      const { proof } = comfirmingGoods
      if (proof) {
        licensePaths = proof
      }
    } else {
      licensePaths = []
    }
    let imagePaths: string[]
    if (comfirmingGoods && comfirmingGoods.images) {
      imagePaths = comfirmingGoods.images.map(image => image.path)
    } else {
      imagePaths = []
    }
    return (
      <Row className="page">
        <Col
          xs={{ span: 22, offset: 1 }}
          sm={{ span: 18, offset: 3 }}
          md={{ span: 14, offset: 5 }}
          lg={{ span: 10, offset: 7 }}
        >
          {  <div className="header-center">{i18n.t('Goods Confirm Page')}</div>}
          {loading ? (
            <Icon type="loading" />
          ) : comfirmingGoods? (
            <div>
              <div>
                <div className="confirm-title">{i18n.t('Title')}:</div>
                <div>{comfirmingGoods.title || 'null'}</div>
              </div>
              <div>
              <div className="confirm-title">{i18n.t('Description')}:</div>
              <div>{comfirmingGoods.desc || 'null'}</div>
              <div className="confirm-title">{i18n.t('Address')}:</div>
              <div>{comfirmingGoods.address || 'null'}</div>

              <div className="confirm-title">{i18n.t('Quantity')}:</div>
              <div>{comfirmingGoods.quantity || 'null'}</div>
              <div className="confirm-title">{i18n.t('Category')}:</div>
              <div>{comfirmingGoods.category || 'null'}</div>
              <div className="confirm-title">{i18n.t('Goods View ')}:</div>
              <div><Link className="" to={'/goods/' + comfirmingGoods.id}>
                      {i18n.t('Read More')}
                    </Link></div>
                <div className="confirm-title">
                  {i18n.t('Images')}:
                </div>
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
              </div>
              <div className="confirm-title">
                  {i18n.t('Proof')}:
                </div>
              <div>
                {licensePaths.map((url, index) => (
                  this.renderFiles(url,index)
                  ))}
              
              </div>
              <div>
                <div style={{ float: 'left' }}>
                  <Icon
                    type="close"
                    style={{
                      cursor: 'pointer',
                      fontSize: 18,
                      color: '#B0290C'
                    }}
                    onClick={() => this.handleDisconfirm(id)}
                  />
                </div>
                {processing && <Icon type="loading" />}
                <div className="float-right">
                  <Icon
                    type="check"
                    style={{
                      cursor: 'pointer',
                      fontSize: 18,
                      color: '#08c'
                    }}
                    onClick={() => this.handleConfirm(id)}
                  />
                </div>
              </div>
            </div>
          ) : (
            ''
          )} 
        </Col>
      </Row>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { admin } = state
  return {
    comfirmingGoods: admin.confirmingGoods,
    loading: admin.loading,
    processing: admin.processing
  }
}
const connectedConfirmPage = connect(mapStateToProps)(GoodsConfirmPage)
export { connectedConfirmPage as GoodsConfirmPage }