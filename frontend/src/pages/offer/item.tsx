import * as React from 'react';
import {Link} from 'react-router-dom';
import {offerConsts} from '../../constants'
import { AuthInfo } from '../../actions';
import {Offer} from '../../models'
interface ItemProps  {
    key:number;
    offer: Offer;
    authInfo:AuthInfo;
    handleCancellOffer:(id: string) => void;
    handleFinishOffer:(id: string) => void;
}
class Item extends React.Component<ItemProps> {
    constructor(props:ItemProps) {
        super(props);
    }

    handleCancell(id:string) {
        this.props.handleCancellOffer(id);
    }
    handleFinish(id:string) {
        let r=confirm("Are you sure?")
        if(r)
            this.props.handleFinishOffer(id);
    }
    render() {
        const {offer,authInfo} = this.props;
        return (
            <div key={offer.id} className="block">
                <div className="header">{offer.type}</div>
                <div className="title">
                    {offer.title}
                </div>
                <div className="desc">
                    <span>{offer.storage&&"Storage:"+offer.storage+","}</span>
                    <span>{offer.breed&&"Breed:"+offer.breed+","}</span>
                    <span>{offer.grade&&"Grade:"+offer.grade+","}</span>
                    <span>{offer.slaughterSpec&&"Slaughter Specificatin:"+offer.slaughterSpec+","}</span>
                    <span>{offer.primalCuts&&"Primal Cut:"+offer.primalCuts}</span>
                </div>
                <Link to={'/offer/' + offer.id}><div className="image-wr">{offer.images&&offer.images[0]?<img src={offer.images[0].path}></img>:<img src="/asset/no-image.jpg"></img>}</div></Link>

                <div className="status">{offer.status!=offerConsts.OFFER_STATUS_FINISHED?'On Sale':'Sold'}</div>
                {authInfo.isAdmin&&offer.status!=offerConsts.OFFER_STATUS_FINISHED&&<div className="admin-menu" onClick = {()=>{
                        if(offer.id)
                            this.handleFinish(offer.id)
                    }
                }>Set Sold</div>}
                <div className="footer">
                    <div className="price">${offer.price}</div>
                        <Link className="" to={'/offer/' + offer.id}>details</Link>
                        {(authInfo.id==offer.userId||authInfo.isAdmin)&&<div className="menu">
                        <Link to={'/offer/edit/' + offer.id} className="control-btn">✎</Link>
                        <div >{offer.cancelling
                            ? <i className="fa fa-spinner" aria-hidden="true"></i>
                            : offer.cancellError
                                ? <span className="text-danger">- ERROR: {offer.cancellError}</span>
                                : offer.status!==offerConsts.OFFER_STATUS_CANCELLED &&< i onClick = {()=>{
                                    if(offer.id)
                                        this.handleCancell(offer.id)
                                }
                            }
                        className = "fa fa-times-circle" aria-hidden="true" ></i>}</div>
                    </div>}
                </div>
            </div>
        )
    }
}
export {Item};