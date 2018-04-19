import * as React from 'react';
import {connect,Dispatch} from 'react-redux';
import {offerActionCreators,orderActionCreators} from '../actions';
import {RootState,OfferState,OrderState} from '../reducers'
import {AuthInfo} from '../actions';
import {Offer,Order} from '../models'
import {Item as OfferItem} from './offer'
import {Item as OrderItem} from './order'
interface AdminProps  {
    dispatch: Dispatch<RootState>;
    offer: OfferState;
    order:OrderState;
    authInfo:AuthInfo;
}

class AdminPage extends React.Component<AdminProps> {
    constructor(props:AdminProps) {
        super(props);
    }
    componentDidMount() {
        this.props
            .dispatch(offerActionCreators.getAll({selectType:'finished'}));
        this.props
            .dispatch(orderActionCreators.getAll({selectType:'finished'}));
    }
    handleCancellOffer = (id:string) => {
        this.props.dispatch(offerActionCreators.cancell(id));
    }
    handleFinishOffer = (id:string)=> {
        this.props.dispatch(offerActionCreators.finish(id));
    }
    handleCancellOrder = (id:string) => {
        this.props.dispatch(orderActionCreators.cancell(id));
    }
    handleFinishOrder = (id:string)=> {
        this.props.dispatch(orderActionCreators.finish(id));
    }
    render() {
        const {authInfo,offer,order} = this.props;
        return (
            <div className="page">
                <div className="banner">
                    <div className="banner-bg"></div>
                    <div className="title">Finished Offers/Orders</div>
                </div>
                <div className="offers-container col-md-8 offset-md-2">
                    <div className="header">
                        <div className="title">Offers</div>
                    </div>
                    <div className="block-container" >
                        {offer.items&&offer.items.map((item, index) =>
                            <OfferItem key={index} offer={item} authInfo={authInfo} handleCancellOffer={this.handleCancellOffer} handleFinishOffer={this.handleFinishOffer}/>
                        )}
                    </div>
                </div>
                <div className="orders-container col-md-8 offset-md-2">
                    <div className="header">
                        <div className="title">Orders</div>
                    </div>
                    <div className="block-container" >
                        {order.items&&order.items.map((item, index) =>
                            <OrderItem key={index} order={item} authInfo={authInfo} handleCancellOrder={this.handleCancellOrder} handleFinishOrder={this.handleFinishOrder}/>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state:RootState) {
    const {auth,offer,order} = state;
    return {authInfo:auth.authInfo,offer,order};
}

const connectedHomePage = connect(mapStateToProps)(AdminPage);
export {connectedHomePage as AdminPage};