import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {connect, Dispatch} from 'react-redux';
import {orderActionCreators} from '../../actions'
import {Order} from '../../models'
import {Category, CategoryDetails} from '../../models'
import {RootState} from '../../reducers'
import {FormattedMessage} from 'react-intl';
interface OrderProps extends RouteComponentProps < { id: string } > {
    dispatch: Dispatch < RootState >;
    order: Order;
}
interface OrderState {
    orderId?: string;
    loading:boolean;
}
class ViewPage extends React.Component < OrderProps, OrderState > {
    constructor(props : OrderProps) {
        super(props);
        this.state={
            loading:true
        }
    }
    componentDidMount() {
        let orderId = this.props.match.params.id
        orderId && this.setState({
            ...this.state,
            orderId
        })
        orderId && this.props.dispatch(orderActionCreators.getById(orderId))
    }
    componentWillReceiveProps(nextProps : OrderProps) {
        const {order} = nextProps;
        if (order){
            this.setState({loading:false});
        }
    }
    render() {
        const {order} = this.props
        const {loading} = this.state
        return (
            <div className="col-md-8 offset-md-2 view-page page">
                <h2 className="header">
                    <FormattedMessage id="pages.orderViewPage" defaultMessage="Order View Page"/>
                </h2>
                {loading?<i className="fa fa-spinner" aria-hidden="true"></i>:<div className="content">
                <div className="group">
                        <div className="label">
                            <FormattedMessage id="itemFeilds.title" defaultMessage="Title"/>
                        </div>
                        <div className="detail">{order.title||"null"}</div>
                    </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.storage" defaultMessage="Storage"/>
                    </div>
                    <div className="detail">{order.storage||"null"}</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.breed" defaultMessage="Breed"/>
                    </div>
                    <div className="detail">{order.breed||"null"}</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.grade" defaultMessage="Grade"/>
                    </div>
                    <div className="detail">{order.grade||"null"}</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.marbleScore" defaultMessage="MarbleScore"/>
                    </div>
                    <div className="detail">{order.marbleScore||"null"}</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.slaughterSpec" defaultMessage="Slaughter Specification"/>
                    </div>
                    <div className="detail">{order.slaughterSpec||"null"}</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.bone" defaultMessage="Bone"/>
                    </div>
                    <div className="detail">{order.bone||"null"}</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.primalCuts" defaultMessage="Primal Cuts"/>
                    </div>
                    <div className="detail">{order.primalCuts||"null"}</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.trimmings" defaultMessage="Trimmings"/>
                    </div>
                    <div className="detail">{order.trimmings||"null"}CL</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.fed" defaultMessage="Fed"/>
                    </div>
                    <div className="detail">{order.fed||"null"}{order.grainFedDays?<span><br/>
                        {order.grainFedDays} Day
                        </span>:''}
                    </div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.price" defaultMessage="Price"/>
                    </div>
                    <div className="detail">{order.price||"null"}{order.currencyCode}</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.quantity" defaultMessage="Quantity"/>
                    </div>
                    <div className="detail">{order.quantity||"null"}KG</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.brand" defaultMessage="Brand"/>
                    </div>
                    <div className="detail">{order.brand||"null"}</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.factoryNum" defaultMessage="Factory Number"/>
                    </div>
                    <div className="detail">{order.factoryNum||"null"}</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.deliveryTerm" defaultMessage="Delivery Term"/>
                    </div>
                    <div className="detail">{order.deliveryTerm||"null"}</div>
                </div>
                <div className="group">
                    <div className="label">
                        <FormattedMessage id="itemFeilds.placeOfOrigin" defaultMessage="Place Of Origin"/>
                    </div>
                    <div className="detail">{order.placeOfOrigin||"null"}</div>
                </div>
            </div>}
        </div>); 
    } 
} 
            
function mapStateToProps(state:RootState) {const {order} = state;
    const {orderData} = order;
    return { order:orderData};
}
const connectedViewPage = connect(mapStateToProps)(ViewPage); export {connectedViewPage as ViewPage}