import * as React from 'react';
import {Link} from 'react-router-dom';
import {connect, Dispatch} from 'react-redux';

import {userActionCreators} from '../../actions';
import {RootState} from '../../reducers';
import {User} from '../../models'
import {userConsts} from '../../constants'
import {FormattedMessage} from 'react-intl';
interface RegisterProps{
    dispatch: Dispatch < RootState >;
    processing: boolean;
}
interface RegisterState {
    user : {
        email: string;
        firstName: string;
        lastName: string;
        password: string;
        rePassword: string;
        userType:number
    };
    submitted : boolean;
    confirmFocused : boolean;
}
class RegisterPage extends React.Component < RegisterProps,RegisterState > {
    userId : string;
    constructor(props : RegisterProps) {
        super(props);

        this.state = {
            user: {
                email: '',
                firstName: '',
                lastName:'',
                password: '',
                rePassword: '',
                userType:userConsts.USER_TYPE_NORMAL
            },
            submitted: false,
            confirmFocused: false
        };

        this.handleChange = this
            .handleChange
            .bind(this);
        this.handleSubmit = this
            .handleSubmit
            .bind(this);
        this.onFocusConfirm = this
            .onFocusConfirm
            .bind(this);
    }
    handleChange(event : React.FormEvent < HTMLInputElement >) {
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
    onFocusConfirm() {
        this.setState({confirmFocused: true});
    }
    handleSubmit(event : React.FormEvent < HTMLFormElement >) {
        event.preventDefault();

        this.setState({submitted: true});
        const {dispatch} = this.props;
        const {email,firstName,lastName,password,rePassword,userType} = this.state.user;
        if (email && firstName && password && rePassword && password === rePassword) {
            let newUser:User = {email,firstName,lastName,password,userType,isActive:true}    
            dispatch(userActionCreators.new(newUser));
        }
    }

    render() {
        const {processing} = this.props;
        const {user, submitted, confirmFocused} = this.state;
        return (
            <div className="page col-md-8 offset-md-2">
                <div className="header">Register User</div>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group' + (submitted && !user.email
                        ? ' has-error'
                        : '')}>
                        <label htmlFor="email">
                            <FormattedMessage id="authFields.email" defaultMessage="Email"/>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            name="email"
                            value={user.email||''}
                            onChange={this.handleChange}/> 
                        {submitted && !user.email && 
                            <div className="invalid-feedback">
                                <FormattedMessage id="authErrors.emailMissed" defaultMessage="Email is required"/>
                            </div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !user.firstName
                        ? ' has-error'
                        : '')}>
                        <label htmlFor="firstName">
                        <FormattedMessage id="authFields.firstName" defaultMessage="First Name"/>
                        Username</label>
                        <input
                            type="text"
                            className="form-control"
                            name="firstName"
                            value={user.firstName||''}
                            onChange={this.handleChange}/> 
                        {submitted && !user.firstName && 
                            <div className="invalid-feedback">
                                <FormattedMessage id="authErrors.firstNameMissed" defaultMessage="First Name is required"/>
                            </div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !user.firstName
                        ? ' has-error'
                        : '')}>
                        <label htmlFor="lastName">
                            <FormattedMessage id="authFields.lastName" defaultMessage="Last Name"/>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            name="lastName"
                            value={user.lastName||''}
                            onChange={this.handleChange}/> 
                        {submitted && !user.lastName && 
                            <div className="invalid-feedback">
                                <FormattedMessage id="authErrors.lastNameMissed" defaultMessage="Last Name is required"/>
                            </div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !user.password
                        ? ' has-error'
                        : '')}>
                        <label htmlFor="password">
                            <FormattedMessage id="authFields.password" defaultMessage="Password"/>
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={user.password||''}
                            onChange={this.handleChange}/> 
                            {submitted && !user.password && 
                                <div className="invalid-feedback">
                                    <FormattedMessage id="authErrors.password" defaultMessage="Password is required"/>
                                </div>
                            }
                    </div>
                    <div className='form-group'>
                        <label htmlFor="rePassword">
                            <FormattedMessage id="authFields.rePassword" defaultMessage="Confirm Password"/>
                        </label>
                        <input
                            type="password"
                            className={"form-control"+ (submitted && !user.rePassword || confirmFocused && user.rePassword != user.password || submitted && user.rePassword != user.password
                                ? ' is-invalid'
                                : '')}
                            name="rePassword"
                            value={user.rePassword||''}
                            onFocus={this.onFocusConfirm}
                            onChange={this.handleChange}/> {user.password != user.rePassword && <div className="invalid-feedback">Password does not match the confirm password.</div>}
                        {submitted && !user.rePassword && 
                            <div className="invalid-feedback">
                                <FormattedMessage id="authErrors.rePassword" defaultMessage="Comfirm Password is required"/>
                            </div>
                        }
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">
                            <FormattedMessage id="authButtons.submit" defaultMessage="Submit"/>
                        </button>
                        {processing && <i className="fa fa-spinner" aria-hidden="true"></i>
}
                        <Link to="/" className="btn btn-link">
                            <FormattedMessage id="authButtons.cancel" defaultMessage="Cancel"/>
                        </Link>
                    </div>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state : RootState) {
    return {
        ...state.auth
    };
}

const connectedRegisterPage = connect(mapStateToProps)(RegisterPage);
export {connectedRegisterPage as RegisterPage};