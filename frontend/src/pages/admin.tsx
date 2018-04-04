import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';
import {connect,Dispatch} from 'react-redux';
import {List as OfferList} from '../pages/offer'
import {List as OrderList} from '../pages/order'
import {AuthInfo} from '../actions';
import {RootState} from '../reducers'
interface AdminProps  {
    dispatch: Dispatch<RootState>;
    authInfo: AuthInfo;
}

class AdminPage extends React.Component<AdminProps> {
    constructor(props:AdminProps) {
        super(props);
    }

    render() {
        const {authInfo} = this.props;
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
                    <OfferList {...this.props,{selectType:'finished'}}/>
                </div>
                <div className="orders-container col-md-8 offset-md-2">
                    <div className="header">
                        <div className="title">Orders</div>
                    </div>
                    <OrderList {...this.props,{selectType:'finished'}}/>
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

const connectedHomePage = connect(mapStateToProps)(AdminPage);
export {connectedHomePage as AdminPage};