import * as React from 'react';
import { Link, Redirect,RouteComponentProps } from 'react-router-dom';
import {connect,Dispatch} from 'react-redux';

import {authActionCreators} from '../../actions';
import {RootState} from '../../reducers'
interface LoginProps  extends RouteComponentProps <{}> {
    dispatch: Dispatch<RootState>;
    processing: boolean;
    loggedIn:boolean;
}
interface LoginState  {
    email: string;
    password: string;
    submitted: boolean;
}
class LoginPage extends React.Component<LoginProps, LoginState> {
    constructor(props:LoginProps) {
        super(props);

        this.state = {
            email: '',
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
        const { email, password } = this.state;
        const { dispatch } = this.props;
        if (email && password) {
            dispatch(authActionCreators.login(email, password));
        }
    }

    render() {
        const { processing,loggedIn } = this.props;
        const { email, password, submitted } = this.state;
        return (
            (loggedIn?(<Redirect
                to={{
                pathname: '/',
                state: {
                    from: this.props.location
                }
            }}/>):<div className="page login without-nav col-md-8 offset-md-2">
            <div className="header">Login</div>
            <form name="form" className="content-container" onSubmit={this.handleSubmit}>
                <div className={'form-group' + (submitted && !email ? ' has-error' : '')}>
                    <label htmlFor="email">Email</label>
                    <input type="text" className="form-control" name="email" value={email} onChange={this.handleChange} />
                    {submitted && !email &&
                        <div className="help-block">Email is required</div>
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
                    {processing &&
                        <i className="fa fa-spinner" aria-hidden="true"></i>
                    }
                    <Link to="/lost/pass" className="btn">Forget password?</Link>
                    <Link to="/register" className="btn">Register</Link>
                </div>
                
            </form>
        </div>)
            
        );
    }
}

function mapStateToProps(state:RootState) {
    const { processing,loggedIn } = state.auth;
    return {
        processing,loggedIn
    };
}

const connectedLoginPage = connect(mapStateToProps)(LoginPage);
export { connectedLoginPage as LoginPage }; 