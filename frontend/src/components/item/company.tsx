import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import { AuthInfo } from '../../actions'
import { RootState } from '../../reducers'
import { User } from '../../models'
import i18n from 'i18next'
import { Col } from 'antd'
interface CompanyProps {
  dispatch: Dispatch<RootState>
  company: User
  authInfo: AuthInfo
}
class Company extends React.Component<CompanyProps> {
  constructor(props: CompanyProps) {
    super(props)
  }

  render() {
    const { company, authInfo } = this.props
    return (
      <Col className="block" xs={12} sm={11} md={10} lg={9}>
        <div className="boxmain">
          <div className="title text-overflow">{company.companyName}</div>
          <div className="desc text-overflow">
            <span>
              {company.companyAddress && 'Address:' + company.companyAddress}
            </span>
          </div>
          <Link to={'/company/confirm/' + company.id}>
            <div className="image-wr">
              {company.businessLicenses && company.businessLicenses[0] ? (
                <img src={company.businessLicenses[0].path} />
              ) : (
                <img src="/asset/no-image.jpg" />
              )}
            </div>
          </Link>
          <div className="menu content">
            <Link className="" to={'/company/confirm/' + company.id}>
              {i18n.t('Read More')}
            </Link>
          </div>
        </div>
      </Col>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { auth } = state
  return { authInfo: auth.authInfo }
}

const connectedCompany = connect(mapStateToProps)(Company)
export { connectedCompany as Company }
