import * as React from 'react'
import {Route, Redirect,RouteProps} from 'react-router-dom'
import {connect,Dispatch} from 'react-redux';
import {actionCreators as authActions} from '../actions/auth';
import {history} from '../helpers/history'
import * as QS from 'query-string'
import { RootState } from '../reducers/index';
interface PrivateRouteProps extends RouteProps {
    dispatch: Dispatch<RootState>;
    loggedIn: boolean;
}
class PrivateRoute extends React.Component<PrivateRouteProps> {
    constructor(props:PrivateRouteProps){
        super(props)
    }
    componentDidMount(){
        let params
        if(this.props.location)
            params = QS.parse(this.props.location.search)
        
        if(params&&params.token){
            let authInfo = {token:params.token,id:params.id}
            this.props.dispatch(authActions.setAuth(authInfo))
            
            if(params.route&&params.route=='resetPass')
                history.replace('/reset/pass')
            else
                history.replace('/')
        }
    }
    render() {
        const {
            loggedIn,
            dispatch,
            component:Component,
            ...props
        } = this.props
       return (
            <Route
                {...props}
                render={props => loggedIn
                ? <Route component={Component} {...props}/>
                : (<Redirect
                    to={{
                    pathname: '/login',
                    state: {
                        from: props.location
                    }
                }}/>)}/>
        )
    }
}
function mapStateToProps(state:RootState) {
    const {auth} = state;
    const {loggedIn} = auth;
    return {loggedIn};
}

const connectedPrivateRoute = connect(mapStateToProps)(PrivateRoute);
export {connectedPrivateRoute as PrivateRoute};