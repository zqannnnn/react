import * as React from 'react';
import {Link} from 'react-router-dom';
import {connect,Dispatch} from 'react-redux';
import {orderConsts} from '../../constants';
import {orderActionCreators,AuthInfo} from '../../actions';
import {RootState,OrderState} from '../../reducers'
import {Order,Category, CategoryDetails} from '../../models'
interface ListProps  {
    dispatch: Dispatch<RootState>;
    order: OrderState;
    authInfo:AuthInfo;
    selectType?:string;
}
class List extends React.Component<ListProps> {
    constructor(props:ListProps) {
        super(props);
    }
    componentDidMount() {
        this
            .props
            .dispatch(orderActionCreators.getAll({selectType:this.props.selectType}));
    }

    handleCancellOrder(id:string) {
        this.props.dispatch(orderActionCreators.cancell(id));
    }
    handleFinishOrder(id:string) {
        let r=confirm("Are you sure?")
        if(r)
            this.props.dispatch(orderActionCreators.finish(id));
    }
    render() {
        const {order,authInfo} = this.props;
        return (
            <div className="">
                {order.error && <span className="text-danger">ERROR: {order.error}</span>}
                <div className="blocks-container" >
                    {order.items&&order.items.map((item, index) =>
                        item.status!==orderConsts.ORDER_STATUS_CANCELLED&&
                        (<div key={item.id} className="block">
                            <div className="header">{item.type}</div>
                            <div className="desc">
                                <span>{item.storage&&"Storage:"+item.storage+","}</span>
                                <span>{item.breed&&"Breed:"+item.breed+","}</span>
                                <span>{item.grade&&"Grade:"+item.grade+","}</span>
                                <span>{item.slaughterSpec&&"Slaughter Specificatin:"+item.slaughterSpec+","}</span>
                                <span>{item.primalCut&&"Primal Cut:"+item.primalCut}</span>
                            </div>
                            
                            
                            <div className="status">{item.status!=orderConsts.ORDER_STATUS_FINISHED?'On Sale':'Sold'}</div>
                            {(authInfo.isAdmin&&item.status!=orderConsts.ORDER_STATUS_FINISHED)&&<div className="admin-menu" onClick = {()=>{
                                    if(item.id)
                                        this.handleFinishOrder(item.id)
                                }
                            }>Set Bought</div>}
                            <div className="footer">
                            <div className="price">${item.price}</div>
                                <Link className="" to={'/order/' + item.id}>details</Link>
                                {authInfo.id==item.userId&&<div className="menu">
                                    <Link to={'/order/edit/' + item.id} className="control-btn">✎</Link>
                                    <div >{item.cancelling
                                        ? <i className="fa fa-spinner" aria-hidden="true"></i>
                                        : item.cancellError
                                            ? <span className="text-danger">- ERROR: {item.cancellError}</span>
                                            : item.status!==orderConsts.ORDER_STATUS_CANCELLED &&< i onClick = {()=>{
                                                if(item.id)
                                                    this.handleCancellOrder(item.id)
                                            }
                                            }
                                    className = "fa fa-times-circle" aria-hidden="true" ></i>}</div>
                                </div>}
                            </div>
                        </div>))
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state:RootState) {
    const {order,auth} = state;
    return {order,authInfo:auth.authInfo};
}

const connectedList = connect(mapStateToProps)(List);
export {connectedList as List};