import * as React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import { offerActionCreators, lightboxActionCreators } from '../../actions'
import { Offer } from '../../models'
import { Category, CategoryDetails } from '../../models'
import { RootState } from '../../reducers'
import { Exchange } from '../../components/exchange'
import { Icon, Col, Row } from 'antd'
import i18n from 'i18next'
interface OfferProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch<RootState>
  offer: Offer
}
interface OfferState {
  offerId?: string
  loading: boolean
}
class ViewPage extends React.Component<OfferProps, OfferState> {
  constructor(props: OfferProps) {
    super(props)
    this.state = {
      loading: true
    }
  }
  componentDidMount() {
    let offerId = this.props.match.params.id
    offerId &&
      this.setState({
        ...this.state,
        offerId
      })
    offerId && this.props.dispatch(offerActionCreators.getById(offerId))
  }
  componentWillReceiveProps(nextProps: OfferProps) {
    const { offer } = nextProps
    if (offer) {
      this.setState({ loading: false })
    }
  }
  openLightbox = (images: string[], index: number) => {
    this.props.dispatch(lightboxActionCreators.open(images, index))
  }
  render() {
    const { offer } = this.props
    const { loading } = this.state

    let imagePaths: string[]
    if (offer && offer.images) {
      imagePaths = offer.images.map(image => image.path)
    } else {
      imagePaths = []
    }
    return (
      <Row>
        <Col
          xs={{ span: 22, offset: 1 }}
          sm={{ span: 16, offset: 4 }}
          md={{ span: 12, offset: 6 }}
          lg={{ span: 10, offset: 7 }}
        >
          <h3 className="header-center">{i18n.t('Offer View Page')}</h3>
          {loading ? (
            <Icon type="loading" />
          ) : (
            <div>
              <h3>{i18n.t('Title:')}</h3>
              <div>{offer.title}</div>
              <h3>{i18n.t('Storage:')}</h3>
              <div>{offer.storage}</div>
              <h3 className="label">{i18n.t('Breed:')}</h3>
              <div>{offer.breed}</div>
              <h3 className="label">{i18n.t('Grade:')}</h3>
              <div>{offer.grade}</div>
              <h3>{i18n.t('MarbleScore:')}</h3>
              <div>{offer.marbleScore}</div>
              <h3>{i18n.t('Slaughter Specification:')}</h3>
              <div>{offer.slaughterSpec}</div>
              <h3>{i18n.t('Bone:')}</h3>
              <div>{offer.bone}</div>
              <h3>{i18n.t('Primal Cuts::')}</h3>
              <div>{offer.primalCuts}</div>
              <h3>{i18n.t('Trimmings:')}</h3>
              <div>{offer.trimmings && offer.trimmings + 'CL'}</div>
              <h3>{i18n.t('Fed:')}</h3>
              <div>
                {offer.fed}
                {offer.grainFedDays ? (
                  <span>
                    <br />
                    {offer.grainFedDays} Day
                  </span>
                ) : (
                  ''
                )}
              </div>
              <h3>{i18n.t('Price:')}</h3>
              <div>
                <span>{`${offer.price} ${offer.currencyCode}/KG`}</span>
              </div>
              <h3>{i18n.t('Quantity:')}</h3>
              <div>{offer.quantity && offer.quantity + 'KG'}</div>
              <h3>{i18n.t('Brand:')}</h3>
              <div>{offer.brand}</div>
              <h3>{i18n.t('Factory Number:')}</h3>
              <div>{offer.factoryNum}</div>
              <h3>{i18n.t('Delivery Term:')}</h3>
              <div>{offer.deliveryTerm}</div>
              <h3>{i18n.t('Place Of Origin:')}</h3>
              <div>{offer.placeOfOrigin}</div>
              <h3 className="label">{i18n.t('Images:')}</h3>
              <div>
                {imagePaths && (
                  <div className="images-container">
                    {imagePaths.map((image, index) => (
                      <div key={index} className="image-wrapper">
                        <img
                          className="image cursor-pointer"
                          onClick={() => this.openLightbox(imagePaths, index)}
                          src={image}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </Col>
      </Row>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { offer } = state
  const { offerData } = offer
  return { offer: offerData }
}
const connectedViewPage = connect(mapStateToProps)(ViewPage)
export { connectedViewPage as ViewPage }
