import * as React from 'react';
import {Link} from 'react-router-dom';
import {connect,Dispatch} from 'react-redux';
import {offerConsts} from '../../constants'
import {offerActionCreators} from '../../actions';
import {RootState,OfferState} from '../../reducers'
import { AuthInfo } from '../../actions';
import {Offer} from '../../models'
import {Category, CategoryDetails} from '../../models'
interface ListProps  {
    dispatch: Dispatch<RootState>;
    offer: OfferState;
    authInfo:AuthInfo;
}
class ListPage extends React.Component<ListProps> {
    constructor(props:ListProps) {
        super(props);
    }
    componentDidMount() {
        this
            .props
            .dispatch(offerActionCreators.getAll());
    }

    handleCancellOffer(id:string) {
        this.props.dispatch(offerActionCreators.cancell(id));
    }
    render() {
        const {offer} = this.props;
        return (
            <div className="">
                {offer.error && <span className="text-danger">ERROR: {offer.error}</span>}
                <table className="table table-striped table-hover">
                    <thead>
                        <tr className="table-header">
                            <th>
                                <Link to={'/offer/new'}>
                                    <i className="fa fa-plus-circle" aria-hidden="true"></i>
                                </Link>
                            </th>
                            <th>Type</th>
                            <th>Image</th>
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
                        {offer.items && offer
                            .items
                            .map((item, index) => {
                                item.status!==offerConsts.OFFER_STATUS_CANCELLED?
                                (<tr key={item.id} className={"table-row"}>
                                <td>{item.cancelling
                                        ? <i className="fa fa-spinner" aria-hidden="true"></i>
                                        : item.cancellError
                                            ? <span className="text-danger">- ERROR: {item.cancellError}</span>
                                            : item.status!==offerConsts.OFFER_STATUS_CANCELLED &&< i onClick = {()=>{
                                                if(item.id)
                                                    this.handleCancellOffer(item.id)
                                            }
                                                
                                            }
                                    className = "fa fa-minus-square" aria-hidden="true" ></i>}</td>
                                <td>{item.images&&<img src={item.images[0]}></img>}</td>
                                <td>{item.type}</td>
                                <td>{item.storage}</td>
                                <td>{item.breed}</td>
                                <td>{item.grade}</td>
                                <td>{item.slaughterSpec}</td>
                                <td>{item.primalCut}</td>
                                <td>{item.bone}</td>
                                <td>
                                    <Link to={'/offer/' + item.id} className="control-btn">✎
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
    const {offer} = state;
    return {offer};
}

const connectedListPage = connect(mapStateToProps)(ListPage);
export {connectedListPage as ListPage};