import * as React from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import {connect} from 'react-redux';

import {history} from './helpers/history';
import {actionCreators as alertActions} from './actions/alert';
import {PrivateRoute} from './components/private-route';
import {AdminRoute} from './components/admin-route';
import {NavBar} from './components/navbar';
import {HomePage} from './pages/home';
import {LoginPage} from './pages/login';
import {LostPassPage} from './pages/auth/lost-pass';
import {ResetPassPage} from './pages/auth/reset-pass';
import {ListPage as OrderListPage, EditPage as OrderEditPage} from './pages/order';
import {Alert} from './models/alert' 
import { RootState } from './reducers/index'
interface AppProps {
    dispatch: (action: any) => void;
    alert: Alert;
  }
class App extends React.Component<AppProps,any> {
    constructor(props:AppProps) {
        super(props);

        const {dispatch} = this.props;
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });
    }

    render() {
        const {alert} = this.props;
        return (
            <div className="container">
                <Router history={history}>
                        <div className="col-md-10 offset-md-1">
                            <NavBar/>
                            {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                            <Switch>
                                <PrivateRoute exact path="/" component={HomePage}/>
                                <PrivateRoute path="/reset/pass" component={ResetPassPage}/>
                                <Route path="/orders" component={OrderListPage}/>
                                <Route path="/order/new" component={OrderEditPage}/>
                                <Route path="/order/:id" component={OrderEditPage}/>
                                <Route path="/login" component={LoginPage}/>
                                <Route path="/lost/pass" component={LostPassPage}/>
                            </Switch>
                        </div>
                </Router>
            </div>

        );
    }
}

function mapStateToProps(state:RootState) {
    const {alert} = state;
    return {alert};
}

export default connect(mapStateToProps)(App);
