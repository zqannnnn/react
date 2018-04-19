import * as React from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import {connect} from 'react-redux';

import {history} from './helpers/history';
import {actionCreators as alertActions} from './actions/alert';
import {PrivateRoute,AdminRoute,NavBar} from './components';
import {LoginPage,RegisterPage,LostPassPage,ResetPassPage} from './pages/auth';
import {EditPage as OrderEditPage, ViewPage as OrderViewPage} from './pages/order';
import {EditPage as OfferEditPage, ViewPage as OfferViewPage} from './pages/offer';
import {AdminPage,HomePage,ListPage } from './pages';

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
                                <PrivateRoute path="/orders/my" component={()=><ListPage selectType='mine' listType='order'/>}/>
                                <PrivateRoute path="/orders" component={()=><ListPage selectType='all' listType='order'/>}/>
                                <PrivateRoute path="/order/new" component={OrderEditPage}/>
                                <PrivateRoute path="/order/:id" component={OrderViewPage}/>
                                <PrivateRoute path="/order/edit/:id" component={OrderEditPage}/>
                                <PrivateRoute path="/offers/my" component={()=><ListPage selectType='mine' listType='offer'/>} />
                                <PrivateRoute path="/offers" component={()=><ListPage selectType='all' listType='offer'/>} />
                                <PrivateRoute path="/offer/new" component={OfferEditPage}/>
                                <PrivateRoute path="/offer/edit/:id" component={OfferEditPage}/>
                                <PrivateRoute path="/offer/:id" component={OfferViewPage}/>
                                <AdminRoute path="/admin" component={AdminPage}/>
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
