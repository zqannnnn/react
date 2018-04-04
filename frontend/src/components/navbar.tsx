import * as React from 'react';
import {NavLink, Link, withRouter, RouteComponentProps} from 'react-router-dom';
import {connect,Dispatch} from 'react-redux';
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
                        <NavLink exact to="/my/orders" className="nav-link" activeClassName="active">My Orders</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink exact to="/my/offers" className="nav-link" activeClassName="active">My Offers</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink exact to="/order/new" className="nav-link" activeClassName="active">Add Order</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink exact to="/offer/new" className="nav-link" activeClassName="active">Add Offer</NavLink>
                    </li>
                    {authInfo&&authInfo.isAdmin&&
                        <li className="nav-item">
                            <NavLink to="/admin/list" className="nav-link" activeClassName="active">Admin List</NavLink>
                        </li>}
                    <li className="nav-item">
                        <NavLink to="/login" className="nav-link" activeClassName="active" onClick={this.logout()}>{authInfo?"Logout":"Login"}</NavLink>
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