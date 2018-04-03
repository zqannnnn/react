import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';
import {connect,Dispatch} from 'react-redux';
import {List as OfferList} from '../pages/offer'
import {List as OrderList} from '../pages/order'
import {AuthInfo} from '../actions';
import {RootState} from '../reducers'
interface HomeProps  {
    dispatch: Dispatch<RootState>;
    authInfo: AuthInfo;
}

class HomePage extends React.Component<HomeProps> {
    constructor(props:HomeProps) {
        super(props);
    }

    render() {
        const {authInfo} = this.props;
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
                            <Link className="link" to={'/offers?type=all'}>👁 view all offers</Link>
                        </div>
                    </div>
                    <OfferList {...this.props}/>
                </div>
                <div className="orders-container col-md-8 offset-md-2">
                    <div className="header">
                        <div className="title">New Orders</div>
                        <div className="subtitle">
                            <div className="des">People looking for buy</div>
                            <Link className="link" to={'/orders?type=all'}>👁 view all orders</Link>
                        </div>
                    </div>
                    <OrderList {...this.props}/>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state:RootState) {
    const {auth} = state;
    const {authInfo} = auth;
    return {authInfo};
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export {connectedHomePage as HomePage};