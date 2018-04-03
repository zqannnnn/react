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
    onlyMine?:boolean;
}
class List extends React.Component<ListProps> {
    constructor(props:ListProps) {
        super(props);
    }
    componentDidMount() {
        this
            .props
            .dispatch(orderActionCreators.getAll({onlyMine:this.props.onlyMine}));
    }

    handleCancellOrder(id:string) {
        this.props.dispatch(orderActionCreators.cancell(id));
    }
    render() {
        const {order,authInfo} = this.props;
        return (
            <div className="">
                {order.error && <span className="text-danger">ERROR: {order.error}</span>}
                <div className="order-block-container" >
                    {order.items&&order.items.map((item, index) =>
                        item.status!==orderConsts.ORDER_STATUS_CANCELLED&&
                        (<div key={item.id} className="order-block">
                            <div className="header">{item.type}</div>
                            <div className="desc">
                                <span>{item.storage&&"Storage:"+item.storage+","}</span>
                                <span>{item.breed&&"Breed:"+item.breed+","}</span>
                                <span>{item.grade&&"Grade:"+item.grade+","}</span>
                                <span>{item.slaughterSpec&&"Slaughter Specificatin:"+item.slaughterSpec+","}</span>
                                <span>{item.primalCut&&"Primal Cut:"+item.primalCut}</span>
                            </div>
                            
                            <div className="footer">
                                <div className="status">On Sale</div>
                                <Link className="" to={'/order/' + item.id}>details</Link>
                                <div className="menu">
                                
                                {authInfo.id==item.userId&&<Link to={'/order/edit/' + item.id} className="control-btn">✎</Link>}
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
                                </div>
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