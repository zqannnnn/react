import * as React from 'react'
import { Form, Input, InputNumber } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import { EditableContext } from '.'
const FormItem = Form.Item
export interface Record {
  key: string
  id?: string
  name: string
  email: string
  phoneNum: string
  address: string
}

interface CellProps extends FormComponentProps {
  editing: string
  dataIndex: keyof Record
  title: string
  inputType: string
  index: string
  record: Record
}
class EditableCell extends React.Component<CellProps> {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />
    }
    return <Input />
  }

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props

    return (
      <EditableContext.Consumer>
        {(form: WrappedFormUtils) => {
          const { getFieldDecorator } = form
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: `Please Input ${title}!`
                      }
                    ],
                    initialValue: record[dataIndex]
                  })(this.getInput())}
                </FormItem>
              ) : (
                restProps.children
              )}
            </td>
          )
        }}
      </EditableContext.Consumer>
    )
  }
}

export { EditableCell }
