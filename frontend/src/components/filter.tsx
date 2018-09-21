import * as React from 'react'
import { transactionConsts } from '../constants'
import { Row, Checkbox } from 'antd'
import { ListOptions } from '../models'
import i18n from 'i18next'
import './filter.scss'
const CheckboxGroup = Checkbox.Group
const plainOptions = ['Beef', 'Veal', 'Sheep'];

interface ItemProps {
  onOptionsChange: (option: ListOptions) => void
  initOptions: ListOptions
}
interface ItemState {
  options: ListOptions
  checkedList: string[]
}
class Filter extends React.Component<ItemProps, ItemState> {
  constructor(props: ItemProps) {
    super(props)
    this.state = { options: {}, checkedList: [] }
  }
  componentDidMount() {
    this.setState({ options: this.props.initOptions })
  }
  handleChangeType = (values: string[]) => {
    let newOptions = this.state.options
    if (values.length === 2) {
      newOptions.buy = true
      newOptions.sell = true
    } else if (values.length === 1) {
      if (values[0] === transactionConsts.TYPE_SELL) {
        newOptions.buy = true
        newOptions.sell = false
      } else if ((values[0] === transactionConsts.TYPE_BUY)) {
        newOptions.buy = false
        newOptions.sell = true
      }
    } else if (values.length === 0) {
      newOptions.buy = false
      newOptions.sell = false
    }
    this.setState({ options: newOptions })
    this.props.onOptionsChange(newOptions)
  }
  processingCategory = (checkedList: string[]) => {
    let options = this.state.options
    options.category = checkedList
    this.setState({ options, checkedList })
    this.props.onOptionsChange(options)
  }
  render() {
    return (
      <>
        <div className="filter">
          <Row className="filter-item">
            <div className="filter-title">{i18n.t('Filter Products')}</div>
            <div className="checkbox-wr">
              <Checkbox.Group
                onChange={this.handleChangeType}
                className="item"
              >
                <div>
                  <CheckboxGroup 
                    options={plainOptions} 
                    value={this.state.checkedList} 
                    onChange={this.processingCategory} 
                  />
                </div>
              </Checkbox.Group>
            </div>
          </Row>
        </div>
        <div className="filter">
        <Row className="filter-item">
          <div className="filter-title">{i18n.t('Filter Types')}</div>
          <div className="checkbox-wr">
            <Checkbox.Group
              onChange={this.handleChangeType}
              className="item"
            >
              <div>
                <Checkbox
                  value={transactionConsts.TYPE_BUY}
                  className="margin-right"
                >
                  {i18n.t('Wanted')}
                </Checkbox>
              </div>
              <div>
                <Checkbox 
                  value={transactionConsts.TYPE_SELL} 
                  className="margin-right"
                >
                  {i18n.t('For Sale')}
                </Checkbox>
              </div>
            </Checkbox.Group>
          </div>
        </Row>
      </div>
    </>
    )
  }
}

export { Filter }
