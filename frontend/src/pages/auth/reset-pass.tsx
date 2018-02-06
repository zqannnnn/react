import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect,Dispatch } from 'react-redux';

import {userActionCreators} from '../../actions';
import { RootState } from '../../reducers';
interface ResetPassProps{
    dispatch: Dispatch<RootState>;
    submiting:boolean;
}
interface ResetPassState  {
    password: string
    rePassword: string,
    submitted:boolean;
}
class ResetPassPage extends React.Component<ResetPassProps,ResetPassState> {
    constructor(props:ResetPassProps) {
        super(props);

        this.state = {
            password: '',
            rePassword: '',
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e:React.FormEvent<HTMLInputElement>) {
        const { name, value } = e.currentTarget;
        this.setState({...this.state, [name]: value });
    }

    handleSubmit(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { password,rePassword } = this.state;
        const { dispatch } = this.props;
        if (password&&password==rePassword) {
            dispatch(userActionCreators.resetPass(password));
        }
    }

    render() {
        const { submiting } = this.props;
        const { password,rePassword, submitted } = this.state;
        return (
            <div className="page one-row without-nav">
            <h4 className="header">Reset Password</h4>
            <form name="form" onSubmit={this.handleSubmit}>
            <div
            className={'form-group' + (submitted && !password
            ? ' has-error'
            : '')}>
            <label htmlFor="password">Password</label>
            <input
                type="password"
                className="form-control"
                name="password"
                value={password}
                onChange={this.handleChange}/> {submitted && !password && <div className="help-block">Password is required</div>
}
        </div>
        <div
            className={'form-group' + (submitted && !rePassword || rePassword != password || submitted && rePassword != password
            ? ' has-error'
            : '')}>
            <label htmlFor="rePassword">Confirm Password</label>
            <input
                type="password"
                className="form-control"
                name="rePassword"
                value={rePassword}
                onChange={this.handleChange}/> {password != rePassword && <div className="help-block">Password does not match the confirm password.</div>}
            {submitted && !rePassword && <div className="help-block">Comfirm Password is required</div>}
        </div>
                <div className="form-group">
                    <button className="btn btn-primary">Reset Password</button>
                    {submiting &&
                        <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                    }
                    <Link to="/" className="btn btn-link">Back to Home</Link>
                </div>
               
            </form>
        </div>);
    }
}

function mapStateToProps(state:RootState) {
    const { submiting } = state.user;
    return {
        submiting
    };
}

const connectedResetPassPage = connect(mapStateToProps)(ResetPassPage);
export { connectedResetPassPage as ResetPassPage }; 