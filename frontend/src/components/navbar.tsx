import * as React from 'react';
import {NavLink, Link, withRouter, RouteComponentProps} from 'react-router-dom';
import {connect,Dispatch} from 'react-redux';
import {actionCreators as authActionCreators, AuthInfo} from '../actions/auth';
import {RootState} from '../reducers/index';
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
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary" role="navigation">
                <ul className="navbar-nav ">
                    <li className="nav-item">
                        <NavLink exact to="/" className="nav-link" activeClassName="active">Home</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink exact to="/orders" className="nav-link" activeClassName="active">My Orders</NavLink>
                    </li>
                    <li className="nav-item">
                        <Link to="/login" className="nav-link" onClick={this.logout()}>Logout</Link>
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