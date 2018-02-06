import * as React from 'react';
import {Link} from 'react-router-dom';
import {connect, Dispatch} from 'react-redux';

import {userActionCreators} from '../../actions';
import {RootState} from '../../reducers';
import {User} from '../../models'
import {userConsts} from '../../constants'
interface RegisterProps{
    dispatch: Dispatch < RootState >;
    processing: boolean;
}
interface RegisterState {
    user : {
        email: string;
        userName: string;
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
                userName: '',
                password: '',
                rePassword: '',
                userType:userConsts.USER_TYPE_BUYER
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
        const {email,userName,password,rePassword,userType} = this.state.user;
        if (email && userName && password && rePassword && password === rePassword) {
            let newUser:User = {email,userName,password,userType,isActive:true}    
            dispatch(userActionCreators.new(newUser));
        }
    }

    render() {
        const {processing} = this.props;
        const {user, submitted, confirmFocused} = this.state;
        return (
            <div className="page one-row">
                <div className="header">Register User</div>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div
                        className={'form-group' + (submitted && !user.email
                        ? ' has-error'
                        : '')}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            className="form-control"
                            name="email"
                            value={user.email||''}
                            onChange={this.handleChange}/> {submitted && !user.email && <div className="invalid-feedback">Email is required</div>
}
                    </div>
                    <div
                        className={'form-group' + (submitted && !user.userName
                        ? ' has-error'
                        : '')}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            name="userName"
                            value={user.userName||''}
                            onChange={this.handleChange}/> {submitted && !user.userName && <div className="invalid-feedback">Username is required</div>
}
                    </div>
                    <div
                        className={'form-group' + (submitted && !user.password
                        ? ' has-error'
                        : '')}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={user.password||''}
                            onChange={this.handleChange}/> {submitted && !user.password && <div className="invalid-feedback">Password is required</div>
}
                    </div>
                    <div
                        className='form-group'>
                        <label htmlFor="rePassword">Confirm Password</label>
                        <input
                            type="password"
                            className={"form-control"+ (submitted && !user.rePassword || confirmFocused && user.rePassword != user.password || submitted && user.rePassword != user.password
                                ? ' is-invalid'
                                : '')}
                            name="rePassword"
                            value={user.rePassword||''}
                            onFocus={this.onFocusConfirm}
                            onChange={this.handleChange}/> {user.password != user.rePassword && <div className="invalid-feedback">Password does not match the confirm password.</div>}
                        {submitted && !user.rePassword && <div className="invalid-feedback">Comfirm Password is required</div>}
                    </div>
                    <div className="form-group">
                        <label className="from-lable">User Type</label>
                            <select
                                className="form-control"
                                name="userType"
                                value={user.userType}
                                onChange={this.handleSelect}>
                                <option value={userConsts.USER_TYPE_BUYER}>Buyer</option>
                                <option value={userConsts.USER_TYPE_SELLER}>SELLER</option>
                            </select>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">Submit</button>
                        {processing && <i className="fa fa-spinner" aria-hidden="true"></i>
}
                        <Link to="/" className="btn btn-link">Cancel</Link>
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