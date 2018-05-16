import * as React from 'react';
import {Link, Redirect} from 'react-router-dom';
import {connect, Dispatch} from 'react-redux';

import {userActionCreators} from '../../actions';
import {RootState} from '../../reducers';

interface LostPassProps {
    dispatch : Dispatch < RootState >;
    processing : boolean;
}
interface LostPassState {
    email : string;
    submitted : boolean;
}
class LostPassPage extends React.Component < LostPassProps,LostPassState > {
    constructor(props : LostPassProps) {
        super(props);

        this.state = {
            email: '',
            submitted: false
        };

    }
    handleChange = (e : React.FormEvent < HTMLInputElement >) => {
        const {name, value} = e.currentTarget;
        this.setState({
            ...this.state,
            [name]: value
        });
    }

    handleSubmit = (e : React.FormEvent < HTMLFormElement >) => {
        e.preventDefault();

        this.setState({submitted: true});
        const {email} = this.state;
        const {dispatch} = this.props;
        if (email) {
            dispatch(userActionCreators.lostPass(email));
        }
    }

    render() {
        const {processing} = this.props;
        const {email, submitted} = this.state;
        return (
            <div className="page col-md-8 offset-md-2 without-nav">
                <div className="header">Lost Password</div>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div
                        className={'form-group' + (submitted && !email
                        ? ' has-error'
                        : '')}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            className="form-control"
                            name="email"
                            value={email}
                            onChange={this.handleChange}/> {submitted && !email && <div className="help-block">Email is required</div>
}
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">Reset Password</button>
                        {processing && <img
                            src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>
}
                        <Link to="/login" className="btn btn-link">Back to login</Link>
                    </div>

                </form>
            </div>
        );
    }
}

function mapStateToProps(state : RootState) {
    const {processing} = state.user;

    return {processing};
}

const connectedLostPassPage = connect(mapStateToProps)(LostPassPage);
export {connectedLostPassPage as LostPassPage};