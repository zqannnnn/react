import * as React from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../reducers'

interface AdminRouteProps extends RouteProps {
  dispatch: Dispatch<RootState>
  isAdmin: boolean
  loggedIn: boolean
}
class AdminRoute extends React.Component<AdminRouteProps> {
  render() {
    const { loggedIn, isAdmin, component: Component, ...props } = this.props

    return (
      <Route
        {...props}
        render={props =>
          loggedIn && isAdmin ? (
            <Route component={Component} {...props} />
          ) : (
            <Redirect
              to={{
                pathname: '/',
                state: {
                  from: props.location
                }
              }}
            />
          )
        }
      />
    )
  }
}
function mapStateToProps(state: RootState) {
  const { authInfo, loggedIn } = state.auth
  const isAdmin = authInfo && authInfo.isAdmin
  return { loggedIn, isAdmin }
}

const connectedAdminRoute = connect(mapStateToProps)(AdminRoute)
export { connectedAdminRoute as AdminRoute }
