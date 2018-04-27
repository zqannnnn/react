import * as React from 'react';
import {connect,Dispatch} from 'react-redux';
import {offerActionCreators,orderActionCreators,adminActionCreators} from '../actions';
import {RootState,OfferState,OrderState,AdminState} from '../reducers'
import {AuthInfo} from '../actions';
import {List} from '../components'
import {FormattedMessage} from 'react-intl';
interface AdminProps  {
    dispatch: Dispatch<RootState>;
    offer: OfferState;
    order:OrderState;
    admin:AdminState;
}

class AdminPage extends React.Component<AdminProps> {
    constructor(props:AdminProps) {
        super(props);
    }
    componentDidMount() {
        this.props
            .dispatch(offerActionCreators.getAll({selectType:'finished'}));
        this.props
            .dispatch(orderActionCreators.getAll({selectType:'finished'}));
        this.props
            .dispatch(adminActionCreators.listUnconfirmedCompanies());
    }
    render() {
        const {offer,order,admin} = this.props;
        return (
            <div className="page">
                <div className="banner">
                    <div className="banner-bg"></div>
                    <div className="title">
                        <FormattedMessage id="pages.adminPage" defaultMessage="Admin Page"/>
                    </div>
                </div>
                <div className="list-container col-md-8 offset-md-2">
                    {offer.items&&<List items={offer.items} title="Finished Offers"/>}
                </div>
                <div className="list-container col-md-8 offset-md-2">
                    {order.items&&<List items={order.items} title="Finished Orders"/>}
                </div>
                <div className="list-container col-md-8 offset-md-2">
                    {admin.unconfirmedCompanies&&<List items={admin.unconfirmedCompanies} title="Unconfirmed Companies"/>}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state:RootState) {
    const {offer,order,admin} = state;
    return {offer,order,admin};
}

const connectedHomePage = connect(mapStateToProps)(AdminPage);
export {connectedHomePage as AdminPage};