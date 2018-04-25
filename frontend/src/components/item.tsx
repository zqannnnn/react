import * as React from 'react';
import {connect,Dispatch} from 'react-redux';
import {offerActionCreators,orderActionCreators} from '../actions';
import {RootState,OfferState,OrderState} from '../reducers'
import {AuthInfo} from '../actions';
import {Offer,Order,ListItem} from '../models'
import {Item as OfferItem} from './offer/item'
import {Item as OrderItem} from './order/item'
interface ItemProps  {
    dispatch: Dispatch<RootState>;
    key:number;
    item:ListItem;
}
class Item extends React.Component<ItemProps> {
    constructor(props:ItemProps) {
        super(props);
    }
    render() {
        const item = this.props.item
        return (
            item.itemType==="Offer"?<OfferItem offer={item}/>:<OrderItem order={item}/>
        )
    }
}


const connectedItem = connect()(Item);
export {connectedItem as Item};