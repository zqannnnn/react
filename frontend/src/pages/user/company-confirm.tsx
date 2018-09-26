import * as React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import { adminActionCreators, lightboxActionCreators } from '../../actions'
import { User } from '../../models'
import { Category, CategoryDetails } from '../../models'
import { RootState, AdminState } from '../../reducers'
import { Icon, Row, Col } from 'antd'
import i18n from 'i18next'

interface ConfirmProps
  extends RouteComponentProps<{
      id: string
    }> {
  dispatch: Dispatch<RootState>
  comfirmingCompany: User
  loading: boolean
  processing: boolean
}
class ConfirmPage extends React.Component<ConfirmProps> {
  constructor(props: ConfirmProps) {
    super(props)
  }
  componentDidMount() {
    let companyId = this.props.match.params.id
    companyId &&
      this.props.dispatch(adminActionCreators.getConfirmingCompany(companyId))
  }
  handleConfirm = (id: string) => {
    this.props.dispatch(adminActionCreators.confirm(id))
  }
  handleDisconfirm = (id: string) => {
    this.props.dispatch(adminActionCreators.disconfirm(id))
  }
  openLightbox = (image: string) => {
    this.props.dispatch(lightboxActionCreators.open(image))
  }
  render() {
    const { comfirmingCompany, loading, processing } = this.props
    let licensePaths: string[] = []
    let id = this.props.match.params.id
    if (comfirmingCompany) {
      const { businessLicenses } = comfirmingCompany
      if (businessLicenses) {
        licensePaths = businessLicenses.map(license => license.path)
      }
    } else {
      licensePaths = []
    }
    return (
      <Row className="page">
        <Col
          xs={{ span: 22, offset: 1 }}
          sm={{ span: 18, offset: 3 }}
          md={{ span: 14, offset: 5 }}
          lg={{ span: 10, offset: 7 }}
        >
          <div className="header-center">{i18n.t('Company Confirm Page')}</div>
          {loading ? (
            <Icon type="loading" />
          ) : comfirmingCompany ? (
            <div>
              <div>
                <div className="confirm-title">{i18n.t('Name')}:</div>
                <div>{comfirmingCompany.companyName || 'null'}</div>
              </div>
              <div>
                <div className="confirm-title">{i18n.t('Address')}:</div>
                <div>{comfirmingCompany.companyAddress || 'null'}</div>
              </div>
              <div>
                <div className="confirm-title">
                  {i18n.t('Bussines License')}:
                </div>
                <div className="images-container">
                  {licensePaths.map((image, index) => (
                    <div key={index} className="image-wrapper">
                      <img
                        className="image cursor-pointer"
                        onClick={() => this.openLightbox(licensePaths[index])}
                        src={image}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ float: 'left' }}>
                  <Icon
                    type="close"
                    style={{
                      cursor: 'pointer',
                      fontSize: 18,
                      color: '#B0290C'
                    }}
                    onClick={() => this.handleDisconfirm(id)}
                  />
                </div>
                {processing && <Icon type="loading" />}
                <div className="float-right">
                  <Icon
                    type="check"
                    style={{
                      cursor: 'pointer',
                      fontSize: 18,
                      color: '#08c'
                    }}
                    onClick={() => this.handleConfirm(id)}
                  />
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
        </Col>
      </Row>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { admin } = state
  return {
    comfirmingCompany: admin.confirmingCompany,
    loading: admin.loading,
    processing: admin.processing
  }
}
const connectedGoodsConfirmPage = connect(mapStateToProps)(ConfirmPage)
export { connectedGoodsConfirmPage as CompanyConfirmPage }
