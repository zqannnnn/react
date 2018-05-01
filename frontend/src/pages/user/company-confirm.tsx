import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {connect, Dispatch} from 'react-redux';
import {adminActionCreators} from '../../actions'
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
    render() {
        const {comfirmingCompany, loading} = this.props
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
                            <div className="images">
                                {comfirmingCompany.businessLicenses && comfirmingCompany
                                    .businessLicenses
                                    .map((image, index) => <div key={index} className="image-wr col">
                                        <img className="img" src={image.path}></img>
                                    </div>)}
                            </div>
                        </div>
                        {/* <div className="form-group col-md-12">
                        <div>&#10003</div>
                        {processing && <i className="fa fa-plus-circle" aria-hidden="true"></i>
}
                    </div> */}
                    </div>:"")}
            </div>
        );
    }
}

function mapStateToProps(state : RootState) {
    const {admin} = state;
    return {comfirmingCompany: admin.confirmingCompany, loading: admin.loading};
}
const connectedConfirmPage = connect(mapStateToProps)(ConfirmPage);
export {connectedConfirmPage as CompanyConfirmPage}