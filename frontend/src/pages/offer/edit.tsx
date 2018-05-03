import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {connect, Dispatch} from 'react-redux';
import {offerActionCreators,categoryActionCreators,currencyActionCreators,uploadActionCreators,lightboxActionCreators,alertActionCreators,AuthInfo} from '../../actions'
import {Offer} from '../../models'
import {Category, CategoryDetails,Currency} from '../../models'
import {RootState} from '../../reducers'
import {offerConsts} from '../../constants'
import {FormattedMessage} from 'react-intl';
interface OfferProps extends RouteComponentProps < { id: string } > {
    dispatch: Dispatch < RootState >;
    loading: boolean;
    editing: boolean;
    offerData: Offer;
    categorys: Category[];
    currencys: Currency[];
    image: string;
    uploading: boolean;
    authInfo:AuthInfo;
}
interface OfferState {
    offer : Offer;
    offerId?: string;
    submitted : boolean;
}
class EditPage extends React.Component < OfferProps, OfferState > {
    constructor(props : OfferProps) {
        super(props);
        this.state = {
            submitted: false,
            offer: {
                type: "Beef"
            }
        };
    }
    componentDidMount() {
        let offerId = this.props.match.params.id
        offerId && this.setState({
            ...this.state,
            offerId
        })
        if(!this.props.categorys)
            this.props.dispatch(categoryActionCreators.getAll());
        if(!this.props.currencys)
            this.props.dispatch(currencyActionCreators.getAll());
        offerId && this.props.dispatch(offerActionCreators.getById(offerId))
    }
    componentWillReceiveProps(nextProps : OfferProps) {
        const {offerData,image,categorys} = nextProps;
        const {submitted, offerId,offer} = this.state;
        if (offerId && offerData && !submitted) {
            this.setState({
                offer: {
                    ...offerData,
                    ...offer
                }
            });
        }
        if(!offerId&&categorys){
            this.setState({
                offer: {
                    ...offer,
                }
            })
        }
        if (image) {
            if (offer.images)
                this.setState({
                    offer: {
                        ...offer,
                        images: [...offer.images,{path:image}]
                    }
                });
            else
                this.setState({
                    offer: {
                        ...offer,
                        images: [{path:image}]
                    }
                });
            this.props.dispatch(uploadActionCreators.clear());
        }
    }
    handleSelectChange = (e : React.FormEvent < HTMLSelectElement >) => {
        const {name, value} = e.currentTarget;
        const {offer} = this.state;
        this.setState({
            offer: {
                ...offer,
                [name]: value
            }
        });
    }
    handleInputChange = (e : React.FormEvent < HTMLInputElement >) => {
        const {name, value} = e.currentTarget;
        const {offer} = this.state;
        this.setState({
            offer: {
                ...offer,
                [name]: value
            }
        });
        
    }
    handleUpload = (e : React.FormEvent < HTMLInputElement >) => {
        const {files} = e.currentTarget
        let image = files
            ? files[0]
            : null
        this
            .props
            .dispatch(uploadActionCreators.uploadImage(image))
    }
    handleSubmit = (event : React.FormEvent < HTMLFormElement >) => {
        event.preventDefault();
        this.setState({submitted:true})
        if(!this.props.authInfo.companyConfirmed){
            this.props.dispatch(alertActionCreators.error("You are not allowed to add offer, please fullfill company info first."))
            return
        }
        const {offer, offerId} = this.state;
        const {dispatch} = this.props;
        if (offer.type&&offer.title) {
            if (offerId) 
                dispatch(offerActionCreators.edit(offer, offerId));
            else 
                dispatch(offerActionCreators.new(offer));
        }else{
            //dispatch(alertActionCreators.error(""));
        }
    }
    handleDeltetImage = (imageIndex:number) => {
        const {offer} = this.state
        const {images} = offer
        if (images){
            let newImages = images.filter((image:{path:string},index:number)=>{
                return index!=imageIndex
            })
            this.setState({offer:{...offer,images:newImages}})
        }
    }
    openLightbox = (images:string[],index:number)=>{
        this.props.dispatch(lightboxActionCreators.open(images,index))
    }
    //for render select input
    renderSelect(optionItems : Array < string >, field : keyof Offer) {
        return (
            <select
                className="form-control"
                name={field}
                value={String(this.state.offer[field])}
                onChange={this.handleSelectChange}>
                <option></option>
                {optionItems.map((item, index) => 
                    <option key={index} value={item}>{item}</option>)}
            </select>
        );
        }
    render() {
        let {id, type, images,price,bone,title,quantity,primalCuts,brand,factoryNum,deliveryTerm,placeOfOrigin,fed,grainFedDays,trimmings} = this.state.offer;
        let {submitted} = this.state
        let {editing, categorys, currencys, uploading} = this.props
        let options = null
        let currentCategory : Category = categorys&&categorys.filter(
            (category:Category)=>{
                return category.type===type})[0]
        let imagePaths: string []
        if(images){
            imagePaths = images.map(image=>image.path)
        }else{
            imagePaths = []
        }
            
        return (
            <div className="col-md-10 offset-md-1 edit-page">
                <h2 className="header">{id? 
                    <FormattedMessage id="pages.editOfferPage" defaultMessage="Edit Offer Page"/>:
                    <FormattedMessage id="pages.createOfferPage" defaultMessage="Create Offer Page"/>}
                </h2>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="form-group col-md-4">
                            <label>
                                <FormattedMessage id="itemFields.offerType" defaultMessage="Offer Type"/></label>
                                <select
                                    className="form-control"
                                    name="type"
                                    value={type}
                                    onChange={this.handleSelectChange}>
                                    {offerConsts
                                        .OFFER_TYPE
                                        .map((item, index) => <option key={index}>{item}</option>)}
                                </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className={'form-group col-md-12' + (submitted && !title
                        ? ' has-error'
                        : '')}>
                            <label>
                                <FormattedMessage id="itemFields.title" defaultMessage="Title"/>
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                name="title"
                                value={title}
                                onChange={this.handleInputChange}/>
                                {submitted && !title && 
                                <div className="invalid-feedback">
                                    <FormattedMessage id="itemErrors.missingTitle" defaultMessage="Title is required"/>
                                </div>}
                        </div>
                        <div className="form-group col-md-4">
                            <label>
                                <FormattedMessage id="itemFields.bone" defaultMessage="Bone"/>
                            </label>
                            {currentCategory&&this.renderSelect(currentCategory.details["Bone"],"bone")}
                        </div>
                        <div className="form-group col-md-4">
                            <label>
                                <FormattedMessage id="itemFields.storage" defaultMessage="Storage"/>
                            </label>
                            {currentCategory&&this.renderSelect(currentCategory.details["Storage"],"storage")}
                        </div>
                        <div className="form-group col-md-4">
                            <label>
                                <FormattedMessage id="itemFields.grade" defaultMessage="Grade"/>
                            </label>
                            {currentCategory&&this.renderSelect(currentCategory.details["Grade"],"grade")}
                        </div>
                        <div className="form-group col-md-4">
                            <label>
                                <FormattedMessage id="itemFields.slaughterSpec" defaultMessage="Slaughter Specification"/>
                            </label>
                            {currentCategory&&this.renderSelect(currentCategory.details["Slaughter Specification"],"slaughterSpec")}
                        </div>
                        <div className="form-group col-md-4">
                            <label>
                                <FormattedMessage id="itemFields.marbleScore" defaultMessage="Marble Score"/>
                            </label>
                            {currentCategory&&this.renderSelect(currentCategory.details["Marble Score"],"marbleScore")}
                        </div>
                        {currentCategory&&currentCategory.type!="Sheep"&&<div className="form-group col-md-4">
                            <label>
                                <FormattedMessage id="itemFields.breed" defaultMessage="Breed"/>
                            </label>
                            {this.renderSelect(currentCategory.details["Breed"],"breed")}
                        </div>}
                        {currentCategory&&currentCategory.type=="Beef"&&<div className="form-group col-md-4">
                            <label>
                                <FormattedMessage id="itemFields.fed" defaultMessage="Fed"/>
                            </label>
                            {this.renderSelect(currentCategory.details["Fed"],"fed")}
                        </div>}
                        {fed=="Grain fed"&&<div className="form-group col-md-4">
                            <label>
                                <FormattedMessage id="itemFields.grainFedDays" defaultMessage="Grain fed days"/>
                            </label>
                            <div className="flex">
                                <input
                                    className="form-control"
                                    type="number"
                                    name="grainFedDays"
                                    value={grainFedDays}
                                    onChange={this.handleInputChange}/>
                                <span className="label-right">
                                    <FormattedMessage id="itemFields.day" defaultMessage="Day"/>
                                </span>
                            </div>
                        </div>}
                        <div className="form-group col-md-4">
                            <label>
                                <FormattedMessage id="itemFields.primalCuts" defaultMessage="Primal Cuts"/>
                            </label>
                            <input
                                    className="form-control"
                                    type="text"
                                    name="primalCuts"
                                    value={primalCuts}
                                    onChange={this.handleInputChange}/>
                        </div>
                        <div className="form-group col-md-4">
                                <label>
                                    <FormattedMessage id="itemFields.trimmings" defaultMessage="Trimmings"/>
                                </label>
                                <div className="flex">
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="trimmings"
                                        value={trimmings}
                                        onChange={this.handleInputChange}/>
                                    <span className="label-right">
                                        CL
                                    </span>
                                </div>
                        </div>
                        <div className="form-group col-md-4">
                            <label>
                                <FormattedMessage id="itemFields.brand" defaultMessage="Brand"/>
                            </label>
                            <input
                                    className="form-control"
                                    type="text"
                                    name="brand"
                                    value={brand}
                                    onChange={this.handleInputChange}/>
                        </div>
                        <div className="form-group col-md-4">
                            <label>
                                <FormattedMessage id="itemFields.factoryNum" defaultMessage="Factory Number"/>
                            </label>
                            <input
                                    className="form-control"
                                    type="text"
                                    name="factoryNum"
                                    value={factoryNum}
                                    onChange={this.handleInputChange}/>
                        </div>
                        <div className="form-group col-md-4">
                            <label>
                                <FormattedMessage id="itemFields.placeOfOrigin" defaultMessage="Place Of Origin"/>
                            </label>
                            <input
                                    className="form-control"
                                    type="text"
                                    name="placeOfOrigin"
                                    value={placeOfOrigin}
                                    onChange={this.handleInputChange}/>
                        </div>
                        <div className="form-group col-md-4">
                            <label>
                                <FormattedMessage id="itemFields.deliveryTerm" defaultMessage="Delivery Term"/>
                            </label>
                            <input
                                    className="form-control"
                                    type="text"
                                    name="deliveryTerm"
                                    value={deliveryTerm}
                                    onChange={this.handleInputChange}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-md-4">
                                <label>
                                    <FormattedMessage id="itemFields.quantity" defaultMessage="Quantity"/>
                                </label>
                                <div className="flex">
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="quantity"
                                        value={quantity}
                                        onChange={this.handleInputChange}/>
                                    <span className="label-right">
                                        KG
                                    </span>
                                </div>
                        </div>
                        <div className="form-group col-md-4">
                                <label>
                                    <FormattedMessage id="itemFields.price" defaultMessage="Price"/>
                                </label>
                                {currencys&&<div className="flex">
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="price"
                                        value={price}
                                        onChange={this.handleInputChange}/>
                                    <select
                                        className="form-control select-right"
                                        name="currencyCode"
                                        value={String(this.state.offer["currencyCode"])}
                                        onChange={this.handleSelectChange}>
                                        <option>
                                            <FormattedMessage id="itemFields.currency" defaultMessage="Currency"/>
                                        </option>
                                        {currencys.map((item, index) => 
                                            <option key={index} value={item.code}>{item.code}</option>)}
                                    </select>
                                    <span className="label-right">/KG</span>
                                </div>}
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-md-8">
                            <label>
                                <FormattedMessage id="itemFields.images" defaultMessage="Images"/>
                            </label>
                            <div className="images-container">
                                {imagePaths.map((image, index) => <div key={index} className="image-wrapper">
                                    <i className="fa fa-times-circle remove-icon"  aria-hidden="true" onClick = {()=>{
                                            this.handleDeltetImage(index)
                                        }}></i>
                                    <img className="image" src={image} onClick={()=>this.openLightbox(imagePaths,index)}/>
                                </div>)}
                                <div className="image-add">
                                    <i className="fa fa-plus-circle add-icon" aria-hidden="true"></i>
                                    <input type="file" onChange={this.handleUpload}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group col-md-12">
                        <button className="btn btn-primary">
                            <FormattedMessage id="editButton.submit" defaultMessage="Submit"/>
                        </button>
                        {editing && <i className="fa fa-plus-circle" aria-hidden="true"></i>
}
                        <Link to="/" className="btn btn-link">
                            <FormattedMessage id="editButton.cancel" defaultMessage="Cancel"/>
                        </Link>
                    </div>
                </form>
            </div>
            ); } } 
function mapStateToProps(state:RootState) {
    const {offer, category,currency,upload,auth} = state;
    const {editing, loading, offerData} = offer;
    return {editing, categorys: category.items,currencys: currency.items, offerData, image:upload.image, uploading:upload.uploading,authInfo:auth.authInfo};
}
const connectedEditPage = connect(mapStateToProps)(EditPage); 
export {connectedEditPage as EditPage}