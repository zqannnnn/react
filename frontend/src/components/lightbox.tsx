import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { lightboxActionCreators } from '../actions'
import { RootState, LightboxState } from '../reducers'
import { Modal } from 'antd'
interface LightboxProps {
  dispatch: Dispatch<RootState>
  state: LightboxState
}
class Lightbox extends React.Component<LightboxProps> {
  constructor(props: LightboxProps) {
    super(props)
  }
  close = (event: React.MouseEvent<HTMLElement>) => {
    this.props.dispatch(lightboxActionCreators.close())
  }

  render() {
    const { state } = this.props
    const { image } = state

    return (
      <Modal visible={state.visible} footer={null} onCancel={this.close}>
        <img style={{ width: '100%' }} src={image} />
      </Modal>
    )
  }
}

function mapStateToProps(state: RootState) {
  return { state: state.lightbox }
}

const connectedLightbox = connect(mapStateToProps)(Lightbox)
export { connectedLightbox as Lightbox }
