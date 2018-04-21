import * as React from 'react';
import {Link} from 'react-router-dom';
import {connect, Dispatch} from 'react-redux';

import {userActionCreators,AuthInfo,currencyActionCreators} from '../../actions';
import {RootState,UserState} from '../../reducers';
import {User,Currency} from '../../models'
import {userConsts} from '../../constants'
import {FormattedMessage} from 'react-intl';
interface ProfileProps{
    dispatch: Dispatch<RootState>;
    userState:UserState;
    authInfo:AuthInfo;
    currencys:Currency[]
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
        const {userState} = nextProps;
        const {userData} = userState;
        const {submitted,user} = this.state;
        if (userData && !submitted) {
            this.setState({
                user: {
                    ...user,
                    ...userData
                }
            });
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
        const {email,firstName,lastName,preferedCurrencyCode} = this.state.user;
        if (email && firstName && lastName && preferedCurrencyCode) {
            this.props.dispatch(userActionCreators.update(this.state.user));
        }
    }
    //for render select input
    renderCurrencySelect(optionItems :  Currency[]) {
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
    render() {
        const {userState,currencys} = this.props;
        const {processing} = userState;
        const {user, submitted} = this.state;
        return (
            <div className="page col-md-8 offset-md-2">
                <div className="header">User Profile</div>
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
    const {user,auth,currency} = state
    return {
        userState:user,
        authInfo:auth.authInfo,
        currencys:currency.items
    };
}

const connectedProfilePage = connect(mapStateToProps)(ProfilePage);
export {connectedProfilePage as ProfilePage};