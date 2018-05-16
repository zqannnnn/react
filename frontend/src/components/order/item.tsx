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
interface ItemState {
    commentInputShowing:boolean;
    comment:string
}
class Item extends React.Component<ItemProps,ItemState> {
    constructor(props:ItemProps) {
        super(props);
        this.state = {
            commentInputShowing:false,
            comment: props.order.comment||''
        }
    }
    handleCancell = (id:string) => {
        this.props.dispatch(orderActionCreators.cancell(id));
    }
    handleFinish = (id:string)=> {
        let r=confirm("Are you sure?")
        if(r)
            this.props.dispatch(orderActionCreators.finish(id));
    }
    triggerCommentInput = ()=>{
        let value = this.state.commentInputShowing
        this.setState({commentInputShowing:!value})
    }
    handleInputChange = (e : React.FormEvent < HTMLInputElement >) => {
        const {name, value} = e.currentTarget;
        this.setState({
            ...this.state,
            [name]: value
        });
    }
    sendComment = (id:string)=>{
        this.props.dispatch(orderActionCreators.addComment(id,this.state.comment))
        this.setState({commentInputShowing:false})
    }
    render() {
        const {order,authInfo} = this.props;
        const {commentInputShowing,comment} = this.state
        return (
            <div key={order.id} className="block col-sm-6 col-md-4 col-lg-3 ">
                <div className="boxmain">
                <div className="header">{order.type}</div>
                <div className="desc">
                    <span>{order.storage&&"Storage:"+order.storage+","}</span>
                    <span>{order.breed&&"Breed:"+order.breed+","}</span>
                    <span>{order.grade&&"Grade:"+order.grade+","}</span>
                    <span>{order.slaughterSpec&&"Slaughter Specificatin:"+order.slaughterSpec+","}</span>
                    <span>{order.primalCuts&&"Primal Cut:"+order.primalCuts}</span>
                </div>
                <div className="space-between content">
                    <div className="status">{order.status == 0?"Canceled":order.status!=orderConsts.ORDER_STATUS_FINISHED?'On Sale':'Sold'}</div>
                    {authInfo.isAdmin&&order.status!=orderConsts.ORDER_STATUS_FINISHED?<div className="control-btn" onClick = {()=>{
                            if(order.id)
                                this.handleFinish(order.id)
                        }
                    }>Set Sold</div>:
                   ''}
                </div>
                {order.price&&<div className="content">${order.price}</div>}
                <div className="menu content">
                    <Link className="control-btn" to={'/order/' + order.id}>Read More</Link>
                    {(authInfo.id==order.userId||authInfo.isAdmin)?
                    <>
                        {order.status===orderConsts.ORDER_STATUS_CREATED &&<>
                            <Link to={'/order/edit/' + order.id} className="control-btn">Edit ✎</Link>
                            <div className="control-btn" onClick = {()=>{
                                    if(order.id)
                                        this.handleCancell(order.id)
                                    }
                                }>
                                Cancel < i className = "fa fa-times-circle" aria-hidden="true" ></i>
                            </div>
                        </>}
                        {(authInfo.isAdmin&&order.status==orderConsts.ORDER_STATUS_FINISHED)?
                        <div className="control-btn" onClick={()=>{this.triggerCommentInput()}}>{"Comment "}
                            <i className={"fa fa-comment-o "+(commentInputShowing?"icon-active":"")} aria-hidden="true"  ></i>
                        </div>:''}
                    </>:''}
                </div>
                {commentInputShowing?<div className="input-wr content">
                    <input
                        type="text"
                        name="comment"
                        value={comment}
                        onChange={this.handleInputChange}/>
                    <div className="input-btn-wr">
                        <i className="fa fa-share-square-o input-btn" aria-hidden="true" onClick={()=>{
                            if(order.id)
                                this.sendComment(order.id)
                        }}></i>
                    </div>
                </div>:<div className="comment content">
                    {order.comment}
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
