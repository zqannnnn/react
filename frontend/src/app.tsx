import * as React from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import {connect} from 'react-redux';

import {history} from './helpers/history';
import {actionCreators as alertActions} from './actions/alert';
import {PrivateRoute,AdminRoute,NavBar,Lightbox} from './components';
import {LoginPage,RegisterPage,LostPassPage,ResetPassPage} from './pages/auth';
import {EditPage as OrderEditPage, ViewPage as OrderViewPage} from './pages/order';
import {EditPage as OfferEditPage, ViewPage as OfferViewPage} from './pages/offer';
import {ProfilePage} from './pages/user'
import {AdminPage,HomePage,ListPage } from './pages';

import {Alert} from './models/alert' 
import { RootState,LightboxState } from './reducers'
interface AppProps {
    dispatch: (action: any) => void;
    alert: Alert;
    lightbox:LightboxState
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
        const {alert,lightbox} = this.props;
        return (
            <div>
                <Router history={history}>
                        <div className="">
                            <NavBar/>
                            {lightbox.showing&&<Lightbox />}
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
                                <PrivateRoute path="/profile" component={ProfilePage}/>
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
    const {alert,lightbox} = state;
    return {alert,lightbox};
}

export default connect(mapStateToProps)(App);
