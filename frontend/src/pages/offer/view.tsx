import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {connect, Dispatch} from 'react-redux';
import {offerActionCreators} from '../../actions'
import {Offer} from '../../models'
import {Category, CategoryDetails} from '../../models'
import {RootState} from '../../reducers'
import {FormattedMessage} from 'react-intl';
interface OfferProps extends RouteComponentProps < { id: string } > {
    dispatch: Dispatch < RootState >;
    offer: Offer;
}
interface OfferState {
    offerId?: string;
    loading:boolean;
}
class ViewPage extends React.Component < OfferProps, OfferState > {
    constructor(props : OfferProps) {
        super(props);
        this.state={
            loading:true
        }
    }
    componentDidMount() {
        let offerId = this.props.match.params.id
        offerId && this.setState({
            ...this.state,
            offerId
        })
        offerId && this.props.dispatch(offerActionCreators.getById(offerId))
    }
    componentWillReceiveProps(nextProps : OfferProps) {
        const {offer} = nextProps;
        if (offer){
            this.setState({loading:false});
        }
    }
    render() {
        const {offer} = this.props
        const {loading} = this.state
        return (
            <div className="col-md-8 offset-md-2 view-page page">
                <h2 className="header">
                    <FormattedMessage id="pages.offerViewPage" defaultMessage="Offer View Page"/>
                </h2>
                {loading?<i className="fa fa-spinner" aria-hidden="true"></i>:<div className="content">
                <div className="group">
                        <div className="label">
                            <FormattedMessage id="itemFeilds.title" defaultMessage="Title"/>
                        </div>
                        <div className="detail">{offer.title}</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.storage" defaultMessage="Storage"/>
                    </div>
                    <div className="detail">{offer.storage}</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.breed" defaultMessage="Breed"/>
                    </div>
                    <div className="detail">{offer.breed}</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.grade" defaultMessage="Grade"/>
                    </div>
                    <div className="detail">{offer.grade}</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.marbleScore" defaultMessage="MarbleScore"/>
                    </div>
                    <div className="detail">{offer.marbleScore}</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.slaughterSpec" defaultMessage="Slaughter Specification"/>
                    </div>
                    <div className="detail">{offer.slaughterSpec}</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.bone" defaultMessage="Bone"/>
                    </div>
                    <div className="detail">{offer.bone}</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.primalCuts" defaultMessage="Primal Cuts"/>
                    </div>
                    <div className="detail">{offer.primalCuts}</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.trimmings" defaultMessage="Trimmings"/>
                    </div>
                    <div className="detail">{offer.trimmings&&offer.trimmings+"CL"}</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.fed" defaultMessage="Fed"/>
                    </div>
                    <div className="detail">{offer.fed}{offer.grainFedDays?<span><br/>
                        {offer.grainFedDays} Day
                        </span>:''}
                    </div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.price" defaultMessage="Price"/>
                    </div>
                    <div className="detail">{offer.price&&offer.currencyCode?offer.price+offer.currencyCode+"/KG":""}</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.quantity" defaultMessage="Quantity"/>
                    </div>
                    <div className="detail">{offer.quantity&&offer.quantity+"KG"}</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.brand" defaultMessage="Brand"/>
                    </div>
                    <div className="detail">{offer.brand}</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.factoryNum" defaultMessage="Factory Number"/>
                    </div>
                    <div className="detail">{offer.factoryNum}</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.deliveryTerm" defaultMessage="Delivery Term"/>
                    </div>
                    <div className="detail">{offer.deliveryTerm}</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.placeOfOrigin" defaultMessage="Place Of Origin"/>
                    </div>
                    <div className="detail">{offer.placeOfOrigin}</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.image" defaultMessage="Images"/>
                    </div>
                    <div className="images">
                        {offer.images&&offer.images.map((image, index)=>
                            <div key={index} className="image-wr col">
                                <img className="img" src={image.path}></img>
                            </div>
                        )}
                    </div>
                </div>
            </div>}
        </div>); 
    } 
} 
            
function mapStateToProps(state:RootState) {
    const {offer} = state;
    const {offerData} = offer;
    return { offer:offerData};
}
const connectedViewPage = connect(mapStateToProps)(ViewPage); 
export {connectedViewPage as ViewPage}