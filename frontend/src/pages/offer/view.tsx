import * as React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import { offerActionCreators } from '../../actions'
import { Offer } from '../../models'
import { Category, CategoryDetails } from '../../models'
import { RootState } from '../../reducers'
import { FormattedMessage } from 'react-intl'
import { Exchange } from '../../components/exchange'
import { Icon } from 'antd'
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
  render() {
    const { offer } = this.props
    const { loading } = this.state
    return (
      <div className="edits-container-wrap">
        <h3 className="header-center">
          <FormattedMessage
            id="pages.offerViewPage"
            defaultMessage="Offer View Page"
          />
        </h3>
        {loading ? (
          <Icon type="loading" />
        ) : (
          <div>
            <h3>
              <FormattedMessage id="itemFeilds.title" defaultMessage="Title:" />
            </h3>
            <div>{offer.title}</div>
            <h3>
              <FormattedMessage
                id="itemFeilds.storage"
                defaultMessage="Storage:"
              />
            </h3>
            <div>{offer.storage}</div>
            <h3 className="label">
              <FormattedMessage id="itemFeilds.breed" defaultMessage="Breed:" />
            </h3>
            <div>{offer.breed}</div>
            <h3 className="label">
              <FormattedMessage id="itemFeilds.grade" defaultMessage="Grade:" />
            </h3>
            <div>{offer.grade}</div>
            <h3>
              <FormattedMessage
                id="itemFeilds.marbleScore"
                defaultMessage="MarbleScore:"
              />
            </h3>
            <div>{offer.marbleScore}</div>
            <h3>
              <FormattedMessage
                id="itemFeilds.slaughterSpec"
                defaultMessage="Slaughter Specification:"
              />
            </h3>
            <div>{offer.slaughterSpec}</div>
            <h3>
              <FormattedMessage id="itemFeilds.bone" defaultMessage="Bone:" />
            </h3>
            <div>{offer.bone}</div>
            <h3>
              <FormattedMessage
                id="itemFeilds.primalCuts"
                defaultMessage="Primal Cuts:"
              />
            </h3>
            <div>{offer.primalCuts}</div>
            <h3>
              <FormattedMessage
                id="itemFeilds.trimmings"
                defaultMessage="Trimmings:"
              />
            </h3>
            <div>{offer.trimmings && offer.trimmings + 'CL'}</div>
            <h3>
              <FormattedMessage id="itemFeilds.fed" defaultMessage="Fed:" />
            </h3>
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
            <h3>
              <FormattedMessage id="itemFeilds.price" defaultMessage="Price:" />
            </h3>
            <div>
              <span>{`${offer.price} ${offer.currencyCode}/KG`}</span>
            </div>
            <h3>
              <FormattedMessage
                id="itemFeilds.quantity"
                defaultMessage="Quantity:"
              />
            </h3>
            <div>{offer.quantity && offer.quantity + 'KG'}</div>
            <h3>
              <FormattedMessage id="itemFeilds.brand" defaultMessage="Brand:" />
            </h3>
            <div>{offer.brand}</div>
            <h3>
              <FormattedMessage
                id="itemFeilds.factoryNum"
                defaultMessage="Factory Number:"
              />
            </h3>
            <div>{offer.factoryNum}</div>
            <h3>
              <FormattedMessage
                id="itemFeilds.deliveryTerm"
                defaultMessage="Delivery Term:"
              />
            </h3>
            <div>{offer.deliveryTerm}</div>
            <h3>
              <FormattedMessage
                id="itemFeilds.placeOfOrigin"
                defaultMessage="Place Of Origin:"
              />
            </h3>
            <div>{offer.placeOfOrigin}</div>
            <h3 className="label">
              <FormattedMessage
                id="itemFeilds.image"
                defaultMessage="Images:"
              />
            </h3>
            <div>
              {offer.images &&
                offer.images.map((image, index) => (
                  <div key={index}>
                    <img src={image.path} />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
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
