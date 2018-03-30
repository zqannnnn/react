import * as React from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import {connect} from 'react-redux';

import {history} from './helpers/history';
import {actionCreators as alertActions} from './actions/alert';
import {PrivateRoute} from './components/private-route';
import {AdminRoute} from './components/admin-route';
import {NavBar} from './components/navbar';
import {HomePage} from './pages/home';
import {LoginPage} from './pages/auth';
import {RegisterPage} from './pages/auth';
import {LostPassPage} from './pages/auth/lost-pass';
import {ResetPassPage} from './pages/auth/reset-pass';
import {ListPage as OrderListPage, EditPage as OrderEditPage} from './pages/order';
import {ListPage as OfferListPage, EditPage as OfferEditPage, ViewPage as OfferViewPage} from './pages/offer';
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
            <div>
                <Router history={history}>
                        <div className="">
                            <NavBar/>
                            {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                            <Switch>
                                <PrivateRoute exact path="/" component={HomePage}/>
                                <PrivateRoute path="/reset/pass" component={ResetPassPage}/>
                                <PrivateRoute path="/orders" component={OrderListPage}/>
                                <PrivateRoute path="/order/new" component={OrderEditPage}/>
                                <PrivateRoute path="/order/edit/:id" component={OrderEditPage}/>
                                <PrivateRoute path="/offers" component={OfferListPage}/>
                                <PrivateRoute path="/offer/new" component={OfferEditPage}/>
                                <PrivateRoute path="/offer/edit/:id" component={OfferEditPage}/>
                                <PrivateRoute path="/offer/:id" component={OfferViewPage}/>
                                <Route path="/login" component={LoginPage}/>
                                <Route path="/register" component={RegisterPage}/>
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
