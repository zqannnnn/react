import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';
import {connect,Dispatch} from 'react-redux';

import {actionCreators as authActions,AuthInfo} from '../actions/auth';
import {RootState} from '../reducers/index'
interface HomeProps  {
    dispatch: Dispatch<RootState>;
    authInfo: AuthInfo;
}
class HomePage extends React.Component<HomeProps> {
    constructor(props:HomeProps) {
        super(props);
    }

    render() {
        const {authInfo} = this.props;
        return (
            <div className="col-md-10 offset-md-1">
                <div className="header">Home</div>
                <div className="">
                    
                </div>
            </div>
        );
    }
}

function mapStateToProps(state:RootState) {
    const {auth} = state;
    const {authInfo} = auth;
    return {authInfo};
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export {connectedHomePage as HomePage};