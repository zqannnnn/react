import * as React from 'react';
import {connect,Dispatch} from 'react-redux';
import {offerActionCreators,orderActionCreators} from '../actions';
import {RootState} from '../reducers'
import {AuthInfo} from '../actions';
import {ListItem} from '../models';
import {Item} from '.'
interface ListProps  {
    dispatch: Dispatch<RootState>;
    items:ListItem[];
    title?:string;
}
class List extends React.Component<ListProps> {
    constructor(props:ListProps) {
        super(props);
    }
    render() {
        const {items,title} = this.props;
        return (
            <div>
                {title&&<div className="header">
                        <div className="title">{title}</div>
                    </div>}

                <div className="block-container row" >
                    {items.map((item, index) =>
                        <Item key={index} item={item} />
                    )}
                </div>
            </div>
        )
    }
}

const connectedList = connect()(List);
export {connectedList as List};
