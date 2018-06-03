import * as React from 'react'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import { lightboxActionCreators } from '../actions'
import { RootState, LightboxState } from '../reducers'
import { lightbox } from '../reducers/lightbox'

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

  prev = (event: React.MouseEvent<HTMLElement>) => {
    this.props.dispatch(lightboxActionCreators.prev())
  }

  next = (event: React.MouseEvent<HTMLElement>) => {
    this.props.dispatch(lightboxActionCreators.next())
  }

  render() {
    const { state } = this.props
    const { images, currentIdx } = state

    return (
      <div className="modal">
        <div className="close" onClick={this.close}>
          x
        </div>
        <div className="prev" onClick={this.prev}>
          &#10094;
        </div>
        <div className="next" onClick={this.next}>
          &#10095;
        </div>
        <div className="modal-content">
          <div className="mySlides">
            <div className="numbertext">
              {currentIdx + 1 + ' / ' + images.length}
            </div>
            <img src={images[currentIdx]} />
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state: RootState) {
  return { state: state.lightbox }
}

const connectedLightbox = connect(mapStateToProps)(Lightbox)
export { connectedLightbox as Lightbox }
