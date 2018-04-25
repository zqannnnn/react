import * as React from 'react';
import {Link} from 'react-router-dom';
import {connect,Dispatch} from 'react-redux';
import {orderActionCreators,AuthInfo} from '../../actions';
import {RootState,OrderState} from '../../reducers'
import {Order,ListItem} from '../../models'
import {orderConsts} from '../../constants'
interface ItemProps  {
    dispatch: Dispatch<RootState>;
    order: Order;
    authInfo:AuthInfo;
}
class Item extends React.Component<ItemProps> {
    constructor(props:ItemProps) {
        super(props);
    }
    handleCancell = (id:string) => {
        this.props.dispatch(orderActionCreators.cancell(id));
    }
    handleFinish = (id:string)=> {
        let r=confirm("Are you sure?")
        if(r)
            this.props.dispatch(orderActionCreators.finish(id));
    }
    render() {
        const {order,authInfo} = this.props;
        return (
            <div key={order.id} className="block">
                <div className="header">{order.type}</div>
                <div className="desc">
                    <span>{order.storage&&"Storage:"+order.storage+","}</span>
                    <span>{order.breed&&"Breed:"+order.breed+","}</span>
                    <span>{order.grade&&"Grade:"+order.grade+","}</span>
                    <span>{order.slaughterSpec&&"Slaughter Specificatin:"+order.slaughterSpec+","}</span>
                    <span>{order.primalCuts&&"Primal Cut:"+order.primalCuts}</span>
                </div>
                <div className="status">{order.status!=orderConsts.ORDER_STATUS_FINISHED?'On Sale':'Sold'}</div>
                {(authInfo.isAdmin&&order.status!=orderConsts.ORDER_STATUS_FINISHED)&&<div className="admin-menu" onClick = {()=>{
                        if(order.id)
                            this.handleFinish(order.id)
                    }
                }>Set Bought</div>}
                <div className="footer">
                <div className="price">${order.price}</div>
                    <Link className="" to={'/order/' + order.id}>details</Link>
                    {authInfo.id==order.userId&&<div className="menu">
                        <Link to={'/order/edit/' + order.id} className="control-btn">✎</Link>
                        <div >{order.cancelling
                            ? <i className="fa fa-spinner" aria-hidden="true"></i>
                            : order.cancellError
                                ? <span className="text-danger">- ERROR: {order.cancellError}</span>
                                : order.status!==orderConsts.ORDER_STATUS_CANCELLED &&< i onClick = {()=>{
                                    if(order.id)
                                        this.handleCancell(order.id)
                                }
                                }
                        className = "fa fa-times-circle" aria-hidden="true" ></i>}</div>
                    </div>}
                </div>
            </div>
        )
    }
}


function mapStateToProps(state:RootState) {
    const {auth} = state;
    return {authInfo:auth.authInfo};
}

const connectedItem = connect(mapStateToProps)(Item);
export {connectedItem as Item};