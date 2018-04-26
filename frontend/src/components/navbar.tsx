import * as React from 'react';
import {NavLink, Link, withRouter, RouteComponentProps} from 'react-router-dom';
import {connect,Dispatch} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import {authActionCreators, AuthInfo} from '../actions';
import {RootState} from '../reducers';
interface NavProps extends RouteComponentProps <{}> {
    dispatch: Dispatch<RootState>;
    authInfo: AuthInfo;
}
class NavBar extends React.Component <NavProps> {
    constructor(props : NavProps) {
        super(props);
    }
    logout() {
        return (e : React.MouseEvent < HTMLElement >) => this
            .props
            .dispatch(authActionCreators.logout());
    }
    render() {
        const {authInfo} = this.props
        return (
            <nav className="navbar navbar-expand-lg justify-content-between" role="navigation">
            <NavLink exact to="/" className="navbar-brand" activeClassName="active">Home</NavLink>
                <ul className="navbar-nav nav">
                    <li className="nav-item">
                        <NavLink exact to="/orders/my" className="nav-link" activeClassName="active">
                            <FormattedMessage id="navbar.myOrders" defaultMessage="My Orders"/>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink exact to="/offers/my" className="nav-link" activeClassName="active">
                            <FormattedMessage id="navbar.myOffers" defaultMessage="My Offers"/>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink exact to="/order/new" className="nav-link" activeClassName="active">
                            <FormattedMessage id="navbar.addOrder" defaultMessage="Add Order"/>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink exact to="/offer/new" className="nav-link" activeClassName="active">
                            <FormattedMessage id="navbar.addOffer" defaultMessage="Add Offer"/>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink exact to="/profile" className="nav-link" activeClassName="active">
                            <FormattedMessage id="navbar.myProfile" defaultMessage="My Profile"/>
                        </NavLink>
                    </li>
                    {authInfo&&authInfo.isAdmin&&
                        <li className="nav-item">
                            <NavLink to="/admin" className="nav-link" activeClassName="active"><FormattedMessage id="navbar.adminList"  defaultMessage="Admin"/></NavLink>
                        </li>}
                    <li className="nav-item">
                        <NavLink to="/login" className="nav-link" activeClassName="active" onClick={this.logout()}>{authInfo?<FormattedMessage id="navbar.logout" defaultMessage="Logout"/>:<FormattedMessage id="navbar.login" defaultMessage="Login"/>}</NavLink>
                    </li>
                   
                </ul>
            </nav>
        );
    }
}
function mapStateToProps(state : RootState) {
    const {auth} = state;
    const {authInfo} = auth;
    return {authInfo};
}
const connectedNavBar = withRouter(connect(mapStateToProps)(NavBar));
export {connectedNavBar as NavBar};