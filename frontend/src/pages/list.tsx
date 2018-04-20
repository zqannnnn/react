import * as React from 'react';
import {connect,Dispatch} from 'react-redux';
import {offerActionCreators,orderActionCreators} from '../actions';
import {RootState,OfferState,OrderState} from '../reducers'
import {AuthInfo} from '../actions';
import {Item as OfferItem} from './offer'
import {Item as OrderItem} from './order'
interface ListProps  {
    dispatch: Dispatch<RootState>;
    offer: OfferState;
    order:OrderState;
    authInfo:AuthInfo;
    selectType:string;
    listType:string;
}
class List extends React.Component<ListProps> {
    constructor(props:ListProps) {
        super(props);
    }
    componentDidMount() {
        if(this.props.listType==='offer')
            this
                .props
                .dispatch(offerActionCreators.getAll({selectType:this.props.selectType}));
        else
            this
                .props
                .dispatch(orderActionCreators.getAll({selectType:this.props.selectType}));
    }

    handleCancellOffer = (id:string) => {
        this.props.dispatch(offerActionCreators.cancell(id));
    }
    handleFinishOffer = (id:string)=> {
        this.props.dispatch(offerActionCreators.finish(id));
    }
    handleCancellOrder = (id:string) => {
        this.props.dispatch(orderActionCreators.cancell(id));
    }
    handleFinishOrder = (id:string)=> {
        this.props.dispatch(orderActionCreators.finish(id));
    }
    render() {
        const {offer,order,authInfo,listType,selectType} = this.props;
        return (
            <div className="page">
                <div className="banner">
                    <div className="banner-bg"></div>
                    <div className="title">{selectType==='mine'?'My ':'All '}{listType==='offer'?'Offer':'Order'}</div>
                </div>
                {offer.error && <span className="text-danger">ERROR: {offer.error}</span>}
                <div className="block-container col-md-8 offset-md-2" >
                {listType==='offer'?
                    offer.items&&offer.items.map((item, index) =>
                        <OfferItem key={index} offer={item} authInfo={authInfo} handleCancellOffer={this.handleCancellOffer} handleFinishOffer={this.handleFinishOffer}/>
                    ):
                    order.items&&order.items.map((item, index) =>
                        <OrderItem key={index} order={item} authInfo={authInfo} handleCancellOrder={this.handleCancellOrder} handleFinishOrder={this.handleFinishOrder}/>
                    )
                }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state:RootState) {
    const {offer,order,auth} = state;
    return {offer,order,authInfo:auth.authInfo};
}

const connectedList = connect(mapStateToProps)(List);
export {connectedList as ListPage};