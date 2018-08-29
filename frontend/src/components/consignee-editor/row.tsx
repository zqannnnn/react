import * as React from 'react'
import { Link } from 'react-router-dom'
import { Form } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
const EditableContext = React.createContext({})
interface RowProps extends FormComponentProps {
  index: string
}
const EditableRow = ({ form, index, ...props }: RowProps) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
)
const EditableFormRow = Form.create()(EditableRow)

export { EditableFormRow, EditableContext }
