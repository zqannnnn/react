import * as React from 'react'
import { Row ,Col} from 'antd'
import i18n from 'i18next'
import {Image, Goods } from '../models'
  
interface GoodsinfoProps{
  goods: Goods
  openLightbox: (image:string) => void
}

class GoodsInfo extends React.Component<GoodsinfoProps>{
    constructor(props:GoodsinfoProps) {
      super(props)
    }
    render() {
      const { goods } = this.props
        let imagePaths: string[]
        if (goods && goods.images) {
          imagePaths = goods.images.map((image:Image) => image.path)
        } else {
          imagePaths = []
        }
      return (
          
          <div>
            <div className="edits-input">
              <Row>
                <Col span={20} offset={2} className="edits-input">
                  <label className="edits-input">{i18n.t('Title')}</label>
                  <div>{goods.title}</div>
                </Col>
              </Row>
              <Row>
                <Col span={20} offset={2} className="edits-input">
                  <label>{i18n.t('Description')}</label>
                  <div>{goods.desc}</div>
                </Col>
              </Row>
              <Row>
                <Col span={20} offset={2} className="view-top">
                  <label>{i18n.t('Images')}:</label>
                  <div className="message">
                    {imagePaths && (
                      <div className="images-container">
                        {imagePaths.map((image, index) => (
                          <div key={index} className="image-wrapper">
                            <img
                              className="image cursor-pointer"
                                onClick={() =>
                                  this.props.openLightbox(image)
                                }
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
          </div>
      )
    }
  }
  export { GoodsInfo }