import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {connect, Dispatch} from 'react-redux';
import {adminActionCreators,lightboxActionCreators} from '../../actions'
import {User} from '../../models'
import {Category, CategoryDetails} from '../../models'
import {RootState, AdminState} from '../../reducers'
import {FormattedMessage} from 'react-intl';
interface ConfirmProps extends RouteComponentProps < {
    id: string
} > {
    dispatch: Dispatch < RootState >;
    comfirmingCompany: User;
    loading: boolean;
    processing:boolean;
}
class ConfirmPage extends React.Component < ConfirmProps > {
    constructor(props : ConfirmProps) {
        super(props);
    }
    componentDidMount() {
        let companyId = this.props.match.params.id
        companyId && this
            .props
            .dispatch(adminActionCreators.getConfirmingConpany(companyId))
    }
    handleConfirm = (id:string)=> {
        this.props.dispatch(adminActionCreators.confirm(id));
    }
    handleDisconfirm = (id:string)=> {
        this.props.dispatch(adminActionCreators.disconfirm(id));
    }
    openLightbox = (images:string[],index:number)=>{
        this.props.dispatch(lightboxActionCreators.open(images,index))
    }
    render() {
        const {comfirmingCompany, loading,processing} = this.props
        let licensePaths: string [] = []
        let id = this.props.match.params.id
        if (comfirmingCompany){
            const {businessLicenses}= comfirmingCompany
            if(businessLicenses){
                licensePaths = businessLicenses.map(license=>license.path)
            }
        }else{
            licensePaths = []
        }
        
        return (
            <div className="col-md-8 offset-md-2 view-page page">
                <h2 className="header">
                    <FormattedMessage
                        id="pages.companyConfirmPage"
                        defaultMessage="Company Confirm Page"/>
                </h2>
                {loading
                    ? <i className="fa fa-spinner" aria-hidden="true"></i>
                    : (comfirmingCompany?<div className="content">
                        <div className="group">
                            <div className="label">
                                <FormattedMessage id="companyFeilds.companyName" defaultMessage="Name"/>
                            </div>
                            <div className="detail">{comfirmingCompany.companyName || "null"}</div>
                        </div>
                        <div className="group">
                            <div className="label">
                                <FormattedMessage id="companyFeilds.companyAddress" defaultMessage="Address"/>
                            </div>
                            <div className="detail">{comfirmingCompany.companyAddress || "null"}</div>
                        </div>

                        <div className="group">
                            <div className="label">
                                <FormattedMessage
                                    id="companyFeilds.bussinesLicense"
                                    defaultMessage="Bussines License"/>
                            </div>
                            <div className="images-container">
                                {licensePaths
                                    .map((image, index) => <div key={index} className="image-wrapper">
                                        <img className="image cursor-pointer" onClick={()=>this.openLightbox(licensePaths,index)}  src={image}/>
                                </div>)}
                            </div>

                        </div>
                        <div className="form-group col-md-12 space-between">
                            {<div className="control-btn main-blue" onClick={()=>this.handleDisconfirm(id)}>
                                <i className="fa fa-times" aria-hidden="true"></i>
                            </div>}
                            {processing && <i className="fa fa-plus-circle" aria-hidden="true"></i>
                            }
                            <div className="control-btn main-blue" onClick={()=>this.handleConfirm(id)}>
                                <i className="fa fa-check" aria-hidden="true"></i>
                            </div>
                        </div>
                    </div>:"")
                }
            </div>
        );
    }
}

function mapStateToProps(state : RootState) {
    const {admin} = state;
    return {comfirmingCompany: admin.confirmingCompany, loading: admin.loading, processing:admin.processing};
}
const connectedConfirmPage = connect(mapStateToProps)(ConfirmPage);
export {connectedConfirmPage as CompanyConfirmPage}