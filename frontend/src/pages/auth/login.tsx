import * as React from 'react';
import { Link, Redirect,RouteComponentProps } from 'react-router-dom';
import {connect,Dispatch} from 'react-redux';

import {authActionCreators} from '../../actions';
import {RootState} from '../../reducers';
import {FormattedMessage} from 'react-intl';
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
    }
    handleChange = (e:React.FormEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        this.setState({...this.state
            , [name]: value });
    }

    handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
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
            <div className="header">
                <FormattedMessage id="pages.login" defaultMessage="Login"/>
            </div>
            <form name="form" className="content-container" onSubmit={this.handleSubmit}>
                <div className={'form-group' + (submitted && !email ? ' has-error' : '')}>
                    <label htmlFor="email">
                        <FormattedMessage id="authFields.email" defaultMessage="Email"/>
                    </label>
                    <input type="text" className="form-control" name="email" value={email} onChange={this.handleChange} />
                    {submitted && !email &&
                        <div className="help-block">
                            <FormattedMessage id="authErrors.emailMissed" defaultMessage="Email is required"/>
                        </div>
                    }
                </div>
                <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                    <label htmlFor="password">
                        <FormattedMessage id="authFields.pass" defaultMessage="Password"/>
                    </label>
                    <input type="password" className="form-control" name="password" value={password} onChange={this.handleChange} />
                    {submitted && !password &&
                        <div className="help-block">
                            <FormattedMessage id="authErrors.passMissed" defaultMessage="Password is required"/>
                        </div>
                    }
                </div>
                <div className="form-group">
                    <button className="btn btn-primary">
                        <FormattedMessage id="authButtons.login" defaultMessage="Login"/>
                    </button>
                    {processing &&
                        <i className="fa fa-spinner" aria-hidden="true"></i>
                    }
                    <Link to="/lost/pass" className="btn">
                        <FormattedMessage id="authButtons.forgetPass" defaultMessage="Forget password?"/>
                    </Link>
                    <Link to="/register" className="btn">
                        <FormattedMessage id="authButtons.register" defaultMessage="Register"/>
                    </Link>
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