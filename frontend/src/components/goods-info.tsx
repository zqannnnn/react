import * as React from 'react'
import { Row, Col } from 'antd'
import i18n from 'i18next'
import { Image, Goods } from '../models'
import './goods-info.scss'

interface GoodsinfoProps {
  goods: Goods
  openLightbox: (image: string) => void
}

class GoodsInfo extends React.Component<GoodsinfoProps> {
  constructor(props: GoodsinfoProps) {
    super(props)
  }
  render() {
    const { goods } = this.props
    let imagePaths: string[]
    if (goods && goods.images) {
      imagePaths = goods.images.map((image: Image) => image.path)
    } else {
      imagePaths = []
    }
    return (
      <div className="goods-info">
        <Row>
          <Col span={20} offset={2} className="field">
            <label>{i18n.t('Title')}:</label>
            <div>{goods.title}</div>
          </Col>
        </Row>
        <Row>
          <Col span={20} offset={2} className="field">
            <label>{i18n.t('Description')}:</label>
            <div>{goods.desc ? goods.desc : 'N/A'}</div>
          </Col>
        </Row>
        <Row>
          <Col span={20} offset={2} className="field">
            <label>{i18n.t('Images')}:</label>
            <div className="message">
              {imagePaths && (
                <div className="images-container">
                  {imagePaths.map((image, index) => (
                    <div key={index} className="image-wrapper">
                      <img
                        className="image cursor-pointer"
                        onClick={() => this.props.openLightbox(image)}
                        src={image}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}
export { GoodsInfo }
