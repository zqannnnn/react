import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import { adminActionCreators, AuthInfo } from '../../actions'
import { RootState, OfferState } from '../../reducers'
import { User, ListItem } from '../../models'
import { adminConsts } from '../../constants'
interface ItemProps {
  dispatch: Dispatch<RootState>
  company: User
  authInfo: AuthInfo
}
class Item extends React.Component<ItemProps> {
  constructor(props: ItemProps) {
    super(props)
  }

  render() {
    const { company, authInfo } = this.props
    return (
      <div className="block col-sm-6 col-md-4 col-lg-3">
        <div className="boxmain">
          <div className="title">{company.companyName}</div>
          <div className="desc">
            <span>
              {company.companyAddress && 'Address:' + company.companyAddress}
            </span>
          </div>
          <div className="image-wr">
            {company.businessLicenses && company.businessLicenses[0] ? (
              <img src={company.businessLicenses[0].path} />
            ) : (
              <img src="/asset/no-image.jpg" />
            )}
          </div>

          <div className="footer">
            <Link className="" to={'/company/confirm/' + company.id}>
              Read More
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { auth } = state
  return { authInfo: auth.authInfo }
}

const connectedItem = connect(mapStateToProps)(Item)
export { connectedItem as Item }
