import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {connect, Dispatch} from 'react-redux';
import {offerActionCreators,categoryActionCreators,alertActionCreators} from '../../actions'
import {Offer} from '../../models'
import {Category, CategoryDetails} from '../../models'
import {RootState} from '../../reducers'
import {offerConsts} from '../../constants'
import {FormattedMessage} from 'react-intl';
interface OfferProps extends RouteComponentProps < { id: string } > {
    dispatch: Dispatch < RootState >;
    loading: boolean;
    editing: boolean;
    offerData: Offer;
    categorys: Category[];
    image: string;
    uploading: boolean
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
        offerId && this.props.dispatch(offerActionCreators.getById(offerId))
    }
    componentWillReceiveProps(nextProps : OfferProps) {
        const {offerData,image,categorys} = nextProps;
        const {submitted, offerId,offer} = this.state;
        if (offerId && offerData && !submitted) {
            this.setState({
                offer: {
                    ...offer,
                    ...offerData
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
        let screenshot = files
            ? files[0]
            : null
        this
            .props
            .dispatch(offerActionCreators.uploadImage(screenshot))
    }
    handleSubmit = (event : React.FormEvent < HTMLFormElement >) => {
        event.preventDefault();
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
                return imageIndex!=imageIndex
            })
            this.setState({offer:{...offer,images:newImages}})
        }
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
        const {id, type, images,price,bone,title,quantity,primalCut,deliveryTerm} = this.state.offer;
        const {editing, categorys, uploading} = this.props
        let options = null
        let currentCategory : Category = categorys&&categorys.filter(
            (category:Category)=>{
                return category.type===type})[0]
        
        return (
            <div className="col-md-10 offset-md-1">
                <h2 className="header">{id? 
                    <FormattedMessage id="offerEdit.editOfferPage" defaultMessage="Edit Offer Page"/>:
                    <FormattedMessage id="offerEdit.createOfferPage" defaultMessage="Create Offer Page"/>}
                </h2>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="form-group col-md-4">
                            <label className="form-lable">
                                <FormattedMessage id="offerEdit.offerType" defaultMessage="Offer Type"/></label>
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
                        <div className="form-group col-md-12">
                            <label className="form-lable">
                                <FormattedMessage id="offerEdit.title" defaultMessage="Title"/>
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                name="title"
                                value={title}
                                onChange={this.handleInputChange}/>
                        </div>
                        <div className="form-group col-md-4">
                            <label className="form-lable">
                                <FormattedMessage id="offerEdit.bone" defaultMessage="Bone"/>
                            </label>
                            {currentCategory&&this.renderSelect(currentCategory.details["Bone"],"bone")}
                        </div>
                        <div className="form-group col-md-4">
                            <label className="form-lable">
                                <FormattedMessage id="offerEdit.storage" defaultMessage="Storage"/>
                            </label>
                            {currentCategory&&this.renderSelect(currentCategory.details["Storage"],"storage")}
                        </div>
                        <div className="form-group col-md-4">
                            <label className="form-lable">
                                <FormattedMessage id="offerEdit.grade" defaultMessage="Grade"/>
                            </label>
                            {currentCategory&&this.renderSelect(currentCategory.details["Grade"],"grade")}
                        </div>
                        <div className="form-group col-md-4">
                            <label className="form-lable">
                                <FormattedMessage id="offerEdit.slaughterSpec" defaultMessage="Slaughter Specification"/>
                            </label>
                            {currentCategory&&this.renderSelect(currentCategory.details["Slaughter Specification"],"slaughterSpec")}
                        </div>
                        <div className="form-group col-md-4">
                            <label className="form-lable">
                                <FormattedMessage id="offerEdit.marbleScore" defaultMessage="Marble Score"/>
                            </label>
                            {currentCategory&&this.renderSelect(currentCategory.details["Marble Score"],"marbleScore")}
                        </div>
                        {currentCategory&&currentCategory.type!="Sheep"&&<div className="form-group col-md-4">
                            <label className="form-lable">
                                <FormattedMessage id="offerEdit.breed" defaultMessage="Breed"/>
                            </label>
                            {this.renderSelect(currentCategory.details["Breed"],"breed")}
                        </div>}
                        <div className="form-group col-md-4">
                            <label className="form-lable">
                                <FormattedMessage id="offerEdit.primalCut" defaultMessage="Primal Cut"/>
                            </label>
                            <input
                                    className="form-control"
                                    type="text"
                                    name="primalCut"
                                    value={primalCut}
                                    onChange={this.handleInputChange}/>
                        </div>
                        <div className="form-group col-md-4">
                            <label className="form-lable">
                                <FormattedMessage id="offerEdit.deliveryTerm" defaultMessage="Delivery Term"/>
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
                                <label className="form-lable">
                                    <FormattedMessage id="offerEdit.quantity" defaultMessage="Quantity"/>
                                </label>
                                <div className="row col">
                                <input
                                    className="form-control col-md-10"
                                    type="number"
                                    name="quantity"
                                    value={quantity}
                                    onChange={this.handleInputChange}/>
                                    <span className="col-md-2">
                                        <FormattedMessage id="offerEdit.ton" defaultMessage="Ton"/>
                                    </span>
                                </div>
                        </div>
                        <div className="form-group col-md-4">
                                <label className="form-lable">
                                    <FormattedMessage id="offerEdit.price" defaultMessage="Price"/>
                                </label>
                                <div className="row col">
                                <input
                                    className="form-control col-md-10"
                                    type="number"
                                    name="price"
                                    value={price}
                                    onChange={this.handleInputChange}/>
                                    <span className="col-md-2">USD/kg</span>
                                </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-md-8">
                            <label className="from-lable">
                                <FormattedMessage id="offerEdit.images" defaultMessage="Images"/>
                            </label>
                            <div className="images-container">
                                {images&&images.map((image, index) => <div key={index} className="image-wrapper">
                                    <i className="fa fa-times-circle remove-icon"  aria-hidden="true" onClick = {()=>{
                                            this.handleDeltetImage(index)
                                        }}></i>
                                    <img className="image" src={image.path}/>
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
                            <FormattedMessage id="offerEdit.submit" defaultMessage="Submit"/>
                        </button>
                        {editing && <i className="fa fa-plus-circle" aria-hidden="true"></i>
}
                        <Link to="/offers" className="btn btn-link">
                            <FormattedMessage id="offerEdit.cancel" defaultMessage="Cancel"/>
                        </Link>
                    </div>
                </form>
            </div>
            ); } } 
function mapStateToProps(state:RootState) {
    const {offer, category} = state;
    const {editing, loading, offerData, image, uploading} = offer;
    const {items} = category
    return {editing, categorys: items, offerData, image, uploading};
}
const connectedEditPage = connect(mapStateToProps)(EditPage); 
export {connectedEditPage as EditPage}