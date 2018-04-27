import * as React from 'react';
import {Link} from 'react-router-dom';
import {connect, Dispatch} from 'react-redux';

import {userActionCreators,AuthInfo,currencyActionCreators,uploadActionCreators,lightboxActionCreators} from '../../actions';
import {RootState,UserState,UploadState} from '../../reducers';
import {User,Currency,Image} from '../../models'
import {userConsts} from '../../constants'
import {FormattedMessage} from 'react-intl';
interface ProfileProps{
    dispatch: Dispatch<RootState>;
    userState:UserState;
    authInfo:AuthInfo;
    currencys:Currency[];
    upload:UploadState;
}
interface ProfileState {
    user : User;
    submitted : boolean;
}
class ProfilePage extends React.Component < ProfileProps,ProfileState > {
    constructor(props : ProfileProps) {
        super(props);

        this.state = {
            user:{},
            submitted: false,
        };
    }
    componentDidMount() {
        this.props.dispatch(userActionCreators.getById(this.props.authInfo.id));
        if(!this.props.currencys)
            this.props.dispatch(currencyActionCreators.getAll());
    }
    componentWillReceiveProps(nextProps : ProfileProps) {
        const {userState,upload} = nextProps;
        const {userData} = userState;
        const {image} = upload
        const {submitted,user} = this.state;
        if (userData && !submitted) {
            this.setState({
                user: {
                    ...userData,
                    ...user
                }
            });
        }
        if (image) {
            if (user.businessLicenses){
                this.setState({
                    user: {
                        ...user,
                        businessLicenses: [...user.businessLicenses,{path:image}]
                    }
                });
            }else{
                this.setState({
                    user: {
                        ...user,
                        businessLicenses: [{path:image}]
                    }
                });
            }
            this.props.dispatch(uploadActionCreators.clear());
        }
    }
    handleUpload = (e : React.FormEvent < HTMLInputElement >) => {
        const {files} = e.currentTarget
        let license = files
            ? files[0]
            : null
        this
            .props
            .dispatch(uploadActionCreators.uploadImage(license))
    }
    handleDeltetImage = (imageIndex:number) => {
        const {user} = this.state
        const {businessLicenses} = user
        if (businessLicenses){
            let newBusinessLicenses = businessLicenses.filter((image:Image,index:number)=>{
                return index!=imageIndex
            })
            this.setState({user:{...user,businessLicenses:newBusinessLicenses}})
        }
    }
    handleChange = (event : React.FormEvent < HTMLInputElement >) => {
        const {name, value} = event.currentTarget;
        const {user} = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }
    handleSelect = (e : React.FormEvent < HTMLSelectElement >) => {
        const {name, value} = e.currentTarget;
        const {user} = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }
    handleSubmit = (event : React.FormEvent < HTMLFormElement >) => {
        event.preventDefault();

        this.setState({submitted: true});
        let user = this.state.user
        if(user.companyName){
            user.companyInfoFilled = true
        }
        this.props.dispatch(userActionCreators.update(user));
    }
    //for render select input
    renderCurrencySelect = (optionItems :  Currency[]) => {
        return (
            <select
                className="form-control"
                name="preferedCurrencyCode"
                value={String(this.state.user.preferedCurrencyCode)}
                onChange={this.handleSelect}>
                <option></option>
                {optionItems.map((item, index) => 
                    <option key={index} value={item.code}>{item.code}</option>)}
            </select>
        );
    }
    openLightbox = (images:string[],index:number)=>{
        this.props.dispatch(lightboxActionCreators.open(images,index))
    }
    render() {
        const {userState,currencys} = this.props;
        const {processing} = userState;
        const {user, submitted} = this.state;
        let licensePaths: string []
        if(user.businessLicenses){
            licensePaths = user.businessLicenses.map(license=>license.path)
        }else{
            licensePaths = []
        }
        return (
            <div className="page col-md-8 offset-md-2">
                <div className="header">
                    <FormattedMessage id="pages.userProfile" defaultMessage="User Profile"/>
                </div>
                <div className="subtitle">
                    <FormattedMessage id="profile.personalInfo" defaultMessage="Personal Information"/>
                </div>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor="fristName">
                            <FormattedMessage id="userFields.firstName" defaultMessage="First Name"/>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            name="firstName"
                            value={user.firstName||''}
                            onChange={this.handleChange}/> {submitted && !user.firstName && <div className="invalid-feedback">First Name is required</div>
                        }
                    </div>
                    <div className='form-group'>
                        <label htmlFor="lastName">
                            <FormattedMessage id="userFields.lastName" defaultMessage="Last Name"/>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            name="lastName"
                            value={user.lastName||''}
                            onChange={this.handleChange}/> {submitted && !user.lastName && <div className="invalid-feedback">Last Name is required</div>
                        }
                    </div>
                    <div className='form-group'>
                        <label htmlFor="email">
                            <FormattedMessage id="userFields.email" defaultMessage="Email"/>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            name="email"
                            value={user.email||''}
                            disabled={true}
                            /> 
                    </div>
                    <div className="form-group">
                        <label>
                            <FormattedMessage id="userFields.preferedCurrency" defaultMessage="Prefered Currency"/>
                        </label>
                        {currencys&&this.renderCurrencySelect(currencys)}
                    </div>
                    <div className="subtitle">
                        <FormattedMessage id="profile.companyInfo" defaultMessage="Company Information"/>
                    </div>
                    <div className='form-group'>
                        <label htmlFor="companyName">
                            <FormattedMessage id="userFields.companyName" defaultMessage="Company Name"/>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            name="companyName"
                            value={user.companyName||''}
                            onChange={this.handleChange}/> 
                    </div>
                    <div className='form-group'>
                        <label htmlFor="companyAddress">
                            <FormattedMessage id="userFields.companyAddress" defaultMessage="Company Address"/>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            name="companyAddress"
                            value={user.companyAddress||''}
                            onChange={this.handleChange}
                        /> 
                    </div>
                    <div className="row">
                        <div className="form-group col-md-8">
                            <label>
                                <FormattedMessage id="userFields.businessLicense" defaultMessage="Business License"/>
                            </label>
                            <div className="images-container">
                                {licensePaths.map((image, index) => <div key={index} className="image-wrapper">
                                    <i className="fa fa-times-circle remove-icon"  aria-hidden="true" onClick = {()=>{
                                            this.handleDeltetImage(index)
                                        }}></i>
                                    <img className="image" onClick={()=>this.openLightbox(licensePaths,index)}  src={image}/>
                                </div>)}
                                <div className="image-add">
                                    <i className="fa fa-plus-circle add-icon" aria-hidden="true"></i>
                                    <input type="file" onChange={this.handleUpload}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    {user.companyConfirmed&&<div className="row">
                        <FormattedMessage id="userTips.companyInfo" defaultMessage="Please fullfill company information for adding offer"/>
                    </div>}
                    <div className="form-group">
                        <button className="btn btn-primary">Submit</button>
                        {processing && 
                            <i className="fa fa-spinner" aria-hidden="true"></i>
                        }
                        <Link to="/" className="btn btn-link">Cancel</Link>
                    </div>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state : RootState) {
    const {user,auth,currency,upload} = state
    return {
        userState:user,
        authInfo:auth.authInfo,
        currencys:currency.items,
        upload
    };
}

const connectedProfilePage = connect(mapStateToProps)(ProfilePage);
export {connectedProfilePage as ProfilePage};