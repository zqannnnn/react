import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {connect, Dispatch} from 'react-redux';
import {offerActionCreators} from '../../actions'
import {Offer} from '../../models'
import {Category, CategoryDetails} from '../../models'
import {RootState} from '../../reducers'
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
            <div className="col-md-10 offset-md-1 view-page">
                <h2 className="header">Offer View page</h2>
                {loading?<i className="fa fa-spinner" aria-hidden="true"></i>:<div className="content">
                    <div className="group">
                        <div className="label">Storage</div>
                        <div className="detail">{offer.storage}</div>
                    </div>
                    <div className="group">
                        <div className="label">Breed</div>
                        <div className="detail">{offer.breed}</div>
                    </div>
                    <div className="group">
                        <div className="label">Grade</div>
                        <div className="detail">{offer.grade}</div>
                    </div>
                    <div className="group">
                        <div className="label">Slaughter Specification</div>
                        <div className="detail">{offer.slaughterSpec}</div>
                    </div>
                    <div className="group">
                        <div className="label">Bone</div>
                        <div className="detail">{offer.bone}</div>
                    </div>
                    <div className="group">
                        <div className="label">Primal Cut</div>
                        <div className="detail">{offer.primalCut}</div>
                    </div>
                </div>}
            </div>
        ); 
    } 
} 
            
function mapStateToProps(state:RootState) {const {offer} = state;
    const {offerData} = offer;
    return { offer:offerData};
}
const connectedViewPage = connect(mapStateToProps)(ViewPage); export {connectedViewPage as ViewPage}