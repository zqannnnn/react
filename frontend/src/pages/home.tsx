import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';
import {connect,Dispatch} from 'react-redux';
import {ListPage as OfferListPage} from '../pages/offer'
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
            <div className="">
                <div className="header">All Offers</div>
                <OfferListPage {...this.props}/>
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