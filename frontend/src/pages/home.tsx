import * as React from 'react';
import {Link} from 'react-router-dom';
import {connect,Dispatch} from 'react-redux';
import {offerActionCreators,orderActionCreators} from '../actions';
import {RootState,OfferState,OrderState} from '../reducers'
import {AuthInfo} from '../actions';
import {Offer,Order} from '../models'
import {Item as OfferItem} from './offer'
import {Item as OrderItem} from './order'
interface HomeProps  {
    dispatch: Dispatch<RootState>;
    offer: OfferState;
    order:OrderState;
    authInfo:AuthInfo;
}

class HomePage extends React.Component<HomeProps> {
    constructor(props:HomeProps) {
        super(props);
    }
    componentDidMount() {
        this.props
            .dispatch(offerActionCreators.getAll({selectType:'all'}));
        this.props
            .dispatch(orderActionCreators.getAll({selectType:'all'}));
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
                    <div className="title">All Offer</div>
                </div>
                <div className="offers-container col-md-8 offset-md-2">
                    <div className="header">
                        <div className="title">New Offers</div>
                        <div className="subtitle">
                            <div className="des">People looking for sell</div>
                            <Link className="link" to={'/offers'}>👁 view all offers</Link>
                        </div>
                    </div>
                    <div className="block-container" >
                        {offer.items&&offer.items.map((item, index) =>
                            <OfferItem key={index} offer={item} authInfo={authInfo} handleCancellOffer={this.handleCancellOffer} handleFinishOffer={this.handleFinishOffer}/>
                        )}
                    </div>
                </div>
                <div className="orders-container col-md-8 offset-md-2">
                    <div className="header">
                        <div className="title">New Orders</div>
                        <div className="subtitle">
                            <div className="des">People looking for buy</div>
                            <Link className="link" to={'/orders'}>👁 view all orders</Link>
                        </div>
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

const connectedHomePage = connect(mapStateToProps)(HomePage);
export {connectedHomePage as HomePage};