import * as React from 'react';
import {Link} from 'react-router-dom';
import {connect,Dispatch} from 'react-redux';
import {offerConsts} from '../../constants'
import {offerActionCreators} from '../../actions';
import {RootState,OfferState} from '../../reducers'
import { AuthInfo } from '../../actions';
import {Offer} from '../../models'
import {Category, CategoryDetails} from '../../models'
interface ListProps  {
    dispatch: Dispatch<RootState>;
    offer: OfferState;
    authInfo:AuthInfo;
    onlyMine?:boolean
}
class ListPage extends React.Component<ListProps> {
    constructor(props:ListProps) {
        super(props);
    }
    componentDidMount() {
        this
            .props
            .dispatch(offerActionCreators.getAll({onlyMine:this.props.onlyMine}));
    }

    handleCancellOffer(id:string) {
        this.props.dispatch(offerActionCreators.cancell(id));
    }
    render() {
        const {offer,authInfo} = this.props;
        return (
            <div className="">
                {offer.error && <span className="text-danger">ERROR: {offer.error}</span>}
                <div className="offer-block-container" >
                        {offer.items&&offer.items.map((item, index) =>
                            item.status!==offerConsts.OFFER_STATUS_CANCELLED&&
                            (<div key={item.id} className="offer-block">
                                <div className="image-wr">{item.images&&<img src={item.images[0].path}></img>}</div>
                                <div className="content">
                                    <div className="type">{item.type}</div>
                                    <div className="details">
                                        <span>{item.storage&&"Storage:"+item.storage+","}</span>
                                        <span>{item.breed&&"Breed:"+item.breed+","}</span>
                                        <span>{item.grade&&"Grade:"+item.grade+","}</span>
                                        <span>{item.slaughterSpec&&"Slaughter Specificatin:"+item.slaughterSpec+","}</span>
                                        <span>{item.primalCut&&"Primal Cut:"+item.primalCut}</span>
                                    </div>
                                </div> 
                                <div className="menu">

                                    {authInfo.id==item.userId&&<Link to={'/offer/' + item.id} className="control-btn">✎
                                    </Link>}
                                    <div >{item.cancelling
                                            ? <i className="fa fa-spinner" aria-hidden="true"></i>
                                            : item.cancellError
                                                ? <span className="text-danger">- ERROR: {item.cancellError}</span>
                                                : item.status!==offerConsts.OFFER_STATUS_CANCELLED &&< i onClick = {()=>{
                                                    if(item.id)
                                                        this.handleCancellOffer(item.id)
                                                }
                                                    
                                                }
                                        className = "fa fa-times-circle" aria-hidden="true" ></i>}</div>
                                        </div> 
                            </div>))
                        }
                    
                </div>
            </div>
        )
    }
}

function mapStateToProps(state:RootState) {
    const {offer,auth} = state;
    return {offer,authInfo:auth.authInfo};
}

const connectedListPage = connect(mapStateToProps)(ListPage);
export {connectedListPage as ListPage};