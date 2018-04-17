import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {connect, Dispatch} from 'react-redux';
import {orderActionCreators} from '../../actions'
import {Order} from '../../models'
import {Category, CategoryDetails} from '../../models'
import {RootState} from '../../reducers'
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
                <h2 className="header">Order View page</h2>
                {loading?<i className="fa fa-spinner" aria-hidden="true"></i>:<div className="content">
                    <div className="group">
                        <div className="label">Storage</div>
                        <div className="detail">{order.storage||"null"}</div>
                    </div>
                    <div className="group">
                        <div className="label">Breed</div>
                        <div className="detail">{order.breed||"null"}</div>
                    </div>
                    <div className="group">
                        <div className="label">Grade</div>
                        <div className="detail">{order.grade||"null"}</div>
                    </div>
                    <div className="group">
                        <div className="label">Slaughter Specification</div>
                        <div className="detail">{order.slaughterSpec||"null"}</div>
                    </div>
                    <div className="group">
                        <div className="label">Bone</div>
                        <div className="detail">{order.bone||"null"}</div>
                    </div>
                    <div className="group">
                        <div className="label">Primal Cut</div>
                        <div className="detail">{order.primalCuts||"null"}</div>
                    </div>
                    <div className="group">
                        <div className="label">Price</div>
                        <div className="detail">${order.price||"null"}</div>
                    </div>
                </div>}
            </div>
        ); 
    } 
} 
            
function mapStateToProps(state:RootState) {
    const {order} = state;
    const {orderData} = order;
    return { order:orderData};
}
const connectedViewPage = connect(mapStateToProps)(ViewPage); 
export {connectedViewPage as ViewPage}