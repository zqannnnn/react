import * as React from 'react';
import {connect,Dispatch} from 'react-redux';
import {offerActionCreators,orderActionCreators} from '../actions';
import {RootState,OfferState,OrderState} from '../reducers'
import {AuthInfo} from '../actions';
import {Offer,Order,ListItem} from '../models'
import {Item as OfferItem} from './offer/item'
import {Item as OrderItem} from './order/item'
import {Item as CompanyItem} from './company/item'
interface ItemProps  {
    dispatch: Dispatch<RootState>;
    key:number;
    item:ListItem;
}
class Item extends React.Component<ItemProps> {
    constructor(props:ItemProps) {
        super(props);
    }
    renderItem = (type:string)=>{
        const item = this.props.item
        switch (type){
            case "Offer":
                return <OfferItem offer={item}/>;
            case "Order":
                return <OrderItem order={item}/>;
            case "Company":
                return <CompanyItem company={item}/>;
            default:
                break;
        }
    }
    render() {
        let itemType = this.props.item.itemType
        return (
            <>
                {itemType&&this.renderItem(itemType)}
            </>
        )
    }
}


const connectedItem = connect()(Item);
export {connectedItem as Item};