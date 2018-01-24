import * as React from 'react';
import { Link, Redirect,RouteComponentProps } from 'react-router-dom';
import {connect,Dispatch} from 'react-redux';

import {actionCreators as authActions} from '../actions/auth';
import {RootState} from '../reducers/index'
interface LoginProps  extends RouteComponentProps <{}> {
    dispatch: Dispatch<RootState>;
    loggingIn: boolean;
    loggedIn:boolean;
}
interface LoginState  {
    username: string;
    password: string;
    submitted: boolean;
}
class LoginPage extends React.Component<LoginProps, LoginState> {
    constructor(props:LoginProps) {
        super(props);

        this.state = {
            username: '',
            password: '',
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e:React.FormEvent<HTMLInputElement>) {
        const { name, value } = e.currentTarget;
        this.setState({...this.state
            , [name]: value });
    }

    handleSubmit(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { username, password } = this.state;
        const { dispatch } = this.props;
        if (username && password) {
            dispatch(authActions.login(username, password));
        }
    }

    render() {
        const { loggingIn,loggedIn } = this.props;
        const { username, password, submitted } = this.state;
        return (
            (loggedIn?(<Redirect
                to={{
                pathname: '/',
                state: {
                    from: this.props.location
                }
            }}/>):<div className="page login without-nav one-row">
            <div className="header">Login</div>
            <form name="form" className="content-container" onSubmit={this.handleSubmit}>
                <div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
                    <label htmlFor="username">Username</label>
                    <input type="text" className="form-control" name="username" value={username} onChange={this.handleChange} />
                    {submitted && !username &&
                        <div className="help-block">Username is required</div>
                    }
                </div>
                <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" name="password" value={password} onChange={this.handleChange} />
                    {submitted && !password &&
                        <div className="help-block">Password is required</div>
                    }
                </div>
                <div className="form-group">
                    <button className="btn btn-primary">Login</button>
                    {loggingIn &&
                        <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                    }
                    <a href="/oauth/gitlab" className="btn">Login with GitLab</a>
                    <Link to="/lost/pass" className="btn">Forget password?</Link>
                </div>
                
            </form>
        </div>)
            
        );
    }
}

function mapStateToProps(state:RootState) {
    const { loggingIn,loggedIn } = state.auth;
    return {
        loggingIn,loggedIn
    };
}

const connectedLoginPage = connect(mapStateToProps)(LoginPage);
export { connectedLoginPage as LoginPage }; 