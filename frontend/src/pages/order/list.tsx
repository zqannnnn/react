import * as React from 'react';
import {Link} from 'react-router-dom';
import {connect,Dispatch} from 'react-redux';
import orderConstants from '../../constants/order'
import {actionCreators as orderActions} from '../../actions/order';
import {RootState} from '../../reducers/index'
import {State as OrderState} from '../../reducers/order'
import { AuthInfo } from '../../actions/auth';
import {Order} from '../../models/order'
import {Entity as Category, Details as CategoryDetails} from '../../models/category'
interface ListProps  {
    dispatch: Dispatch<RootState>;
    order: OrderState;
    authInfo:AuthInfo;
}
class ListPage extends React.Component<ListProps> {
    constructor(props:ListProps) {
        super(props);
    }
    componentDidMount() {
        this
            .props
            .dispatch(orderActions.getAll());
    }

    handleCancellOrder(id:string) {
        this.props.dispatch(orderActions.cancell(id));
    }
    render() {
        const {order} = this.props;
        return (
            <div className="">
                {order.error && <span className="text-danger">ERROR: {order.error}</span>}
                <table className="table table-striped table-hover">
                    <thead>
                        <tr className="table-header">
                            <th>
                                <Link to={'/order/new'}>
                                    <i className="fa fa-plus-circle" aria-hidden="true"></i>
                                </Link>
                            </th>
                            <th>Type</th>
                            <th>Storage</th>
                            <th>Breed</th>
                            <th>Grade</th>
                            <th>Slaughter Specification</th>
                            <th>Primal Cut</th>
                            <th>Bone</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody >
                        {order.items && order
                            .items
                            .map((item, index) => {
                                item.status!==orderConstants.ORDER_STATUS_CANCELLED?
                                (<tr key={item.id} className={"table-row"}>
                                <td>{item.cancelling
                                        ? <i className="fa fa-spinner" aria-hidden="true"></i>
                                        : item.cancellError
                                            ? <span className="text-danger">- ERROR: {item.cancellError}</span>
                                            : item.status!==orderConstants.ORDER_STATUS_CANCELLED &&< i onClick = {()=>{
                                                if(item.id)
                                                    this.handleCancellOrder(item.id)
                                            }
                                                
                                            }
                                    className = "fa fa-minus-square" aria-hidden="true" ></i>}</td>
                                <td>{item.type}</td>
                                <td>{item.storage}</td>
                                <td>{item.breed}</td>
                                <td>{item.grade}</td>
                                <td>{item.slaughterSpec}</td>
                                <td>{item.primalCut}</td>
                                <td>{item.bone}</td>
                                <td>
                                    <Link to={'/order/' + item.id} className="control-btn">✎
                                    </Link>
                                </td>
                            </tr>):''})
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

function mapStateToProps(state:RootState) {
    const {order} = state;
    return {order};
}

const connectedListPage = connect(mapStateToProps)(ListPage);
export {connectedListPage as ListPage};