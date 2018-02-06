import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {connect, Dispatch} from 'react-redux';
import {offerActionCreators} from '../../actions'
import {categoryActionCreators} from '../../actions'
import {Offer} from '../../models'
import {Category, CategoryDetails} from '../../models'
import {RootState} from '../../reducers'
import {offerConsts} from '../../constants'
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
    initOffer =(offerType : string) : Offer=> {
        let {categorys} = this.props
        let currentCategory: CategoryDetails
        let newCategorys = categorys.filter((category : Category) => {
            return category.type === offerType
        })
        if (newCategorys.length > 0) {
            currentCategory = newCategorys[0].details
            return {
                storage: currentCategory.Storage? currentCategory.Storage[0]: undefined,
                breed: currentCategory.Breed ? currentCategory.Breed[0]: undefined,
                grade: currentCategory.Grade? currentCategory.Grade[0]: undefined,
                slaughterSpec: currentCategory["Slaughter Specification"]? currentCategory["Slaughter Specification"][0]: undefined,
                primalCut: currentCategory["Primal Cut"]? currentCategory["Primal Cut"][0]: undefined,
                bone: currentCategory.Bone? currentCategory.Bone[0]: undefined,
            }
        } else {
            return {}
        }

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
    handleChange = (e : React.FormEvent < HTMLSelectElement >) => {
        const {name, value} = e.currentTarget;
        const {offer} = this.state;
        this.setState({
            offer: {
                ...offer,
                [name]: value
            }
        });
        if (name == "type") {
            let newOffer = this.initOffer(value)
            this.setState({
                offer: {
                    ...offer,
                    ...newOffer,
                    [name]: value
                }
            })
        }
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
        if (offer.type) {
            if (offerId) 
                dispatch(offerActionCreators.edit(offer, offerId));
            else 
                dispatch(offerActionCreators.new(offer));
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
    renderSelect(items : Array < string >, field : string) {
        let offerField : (keyof Offer | undefined)
        let select = null
        switch (field) {
            case "Storage":
                offerField = "storage"
                break;
            case "Breed":
                offerField = "breed"
                break;
            case "Grade":
                offerField = "grade"
                break;
            case "Slaughter Specification":
                offerField = "slaughterSpec"
                break;
            case "Primal Cut":
                offerField = "primalCut"
                break;
            case "Bone":
                offerField = "bone"
                break;
        }

        if (offerField != undefined) 
            return select = (
                <div key={field} className="form-group col-md-4">
                    <label className="from-lable">{field}</label>
                    <select
                        className="form-control"
                        name={offerField}
                        value={String(this.state.offer[offerField])}
                        onChange={this.handleChange}>
                        {items.map((item, index) => 
                            <option key={index} value={item}>{item}</option>)}
                    </select>
                </div>
            );
        }
    render() {
        const {id, type, images} = this.state.offer;
        const {editing, categorys, uploading} = this.props
        let options = null
        let currentCategory : Category
        let newCategorys : Category[] = []
        if (type && categorys && categorys.length > 0) {
            newCategorys = categorys.filter((category : Category) => {
                return category.type === type
            })
            if (newCategorys.length > 0) {
                currentCategory = newCategorys[0]
                options = Object
                    .keys(newCategorys[0].details)
                    .map((key : keyof CategoryDetails) => {
                        return this.renderSelect(currentCategory.details[key], key)
                    })
            }
        }
        return (
            <div className="col-md-10 offset-md-1">
                <h2 className="header">{id
                        ? 'Edit'
                        : 'Create'}
                    Offer page</h2>
                <form name="form" className="row" onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label className="from-lable">Offer type</label>
                            <select
                                className="form-control"
                                name="type"
                                value={type}
                                onChange={this.handleChange}>
                                {offerConsts
                                    .OFFER_TYPE
                                    .map((item, index) => <option key={index}>{item}</option>)}
                            </select>
                        </div>
                    <div className="row">
                        {options}
                    </div>
                    <div className="row">
                    <div className="form-group col-md-12">
                        <label className="from-lable">Images</label>
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
                        <button className="btn btn-primary">Submit</button>
                        {editing && <i className="fa fa-plus-circle" aria-hidden="true"></i>
}
                        <Link to="/offers" className="btn btn-link">Cancel</Link>
                    </div>
                </form>
            </div>
            ); } } function mapStateToProps(state:RootState) {const {offer, category} = state;
            const {editing, loading, offerData, image, uploading} = offer;
            const {items} = category
            return {editing, categorys: items, offerData, image, uploading};
}
            const connectedEditPage = connect(mapStateToProps)(EditPage); export {connectedEditPage as EditPage}