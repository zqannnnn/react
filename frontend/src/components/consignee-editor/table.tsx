import * as React from 'react'
import { Button, Table, Popconfirm, Radio } from 'antd'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import { EditableCell, EditableFormRow, EditableContext, Record } from '.'
import './table.scss'
import i18n from 'i18next'
import { RadioChangeEvent } from 'antd/lib/radio'

const RadioGroup = Radio.Group

interface TableProps {
  data: Array<Record>
  handleSubmit: (values: Record) => void
  handleDelete: (id: string) => void
  handleDefault: (id: string) => void
  onSelect: (data: Record) => void
  defaultConsigneeId?: string
  selectable?: boolean
}
interface TableState {
  editingKey: string
  data: Array<Record>
  count: number
  selectConsigneeId?: string
}
class EditableTable extends React.Component<TableProps, TableState> {
  constructor(props: TableProps) {
    super(props)
    this.state = {
      editingKey: '',
      count: props.data ? props.data.length : 0,
      data: props.data,
      selectConsigneeId: this.props.defaultConsigneeId
    }
  }
  columns = [
    {
      title: 'name',
      dataIndex: 'name',
      className: 'name-col',
      editable: true
    },
    {
      title: 'email',
      dataIndex: 'email',
      className: 'email-col',
      editable: true
    },
    {
      title: 'phoneNum',
      dataIndex: 'phoneNum',
      className: 'phone-num-col',
      editable: true
    },
    {
      title: 'address',
      dataIndex: 'address',
      className: 'address-col',
      editable: true
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      className: 'operation-col',
      render: (text: string, record: Record) => {
        const editable = this.isEditing(record)
        return (
          <div>
            {editable ? (
              <span>
                <EditableContext.Consumer>
                  {(form: WrappedFormUtils) => (
                    <a
                      href="javascript:;"
                      onClick={() => this.save(form, record.key)}
                      style={{ marginRight: 8 }}
                    >
                      Save
                    </a>
                  )}
                </EditableContext.Consumer>
                <Popconfirm
                  title="Sure to cancel?"
                  onConfirm={() => this.cancel(record.key)}
                >
                  <a>Cancel</a>
                </Popconfirm>
              </span>
            ) : (
              <a onClick={() => this.edit(record.key)}>Edit</a>
            )}
          </div>
        )
      }
    },
    {
      title: 'delete',
      dataIndex: 'delete',
      className: 'delete-col',
      render: (text: string, record: Record) => {
        return record.id ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => record.id && this.handleDelete(record.id)}
          >
            <a href="javascript:;">Delete</a>
          </Popconfirm>
        ) : null
      }
    },
    {
      title: 'set default',
      className: 'default-col',
      render: (text: string, record: Record) => {
        if (record.id) {
          if (record.id === this.props.defaultConsigneeId) {
            return <div>Is default</div>
          } else {
            return (
              <Popconfirm
                title="Sure to set default?"
                onConfirm={() => record.id && this.handleDefault(record.id)}
              >
                <a href="javascript:;">{i18n.t('Set default')}</a>
              </Popconfirm>
            )
          }
        } else {
          return null
        }
      }
    }
  ]

  newCol = [
    {
      title: 'select',
      dataIndex: 'select',
      className: 'select-col',
      editable: false,
      render: (text: string, record: Record) => {
        return record.id ? <Radio value={record.id} /> : null
      }
    },
    ...this.columns
  ]

  componentWillReceiveProps(nextProps: TableProps) {
    this.setState({
      data: nextProps.data,
      count: nextProps.data ? nextProps.data.length : 0
    })
  }

  onChange = (e: RadioChangeEvent) => {
    const { value } = e.target
    this.setState({
      selectConsigneeId: value
    })
    let consignee = this.state.data.filter(data => data.id === value)
    this.props.onSelect(consignee[0])
  }

  isEditing = (record: Record) => {
    return record.key === this.state.editingKey
  }

  handleDelete = (id: string) => {
    this.props.handleDelete(id)
  }
  handleDefault = (id: string) => {
    this.props.handleDefault(id)
  }

  edit = (key: string) => {
    this.setState({ editingKey: key })
  }

  save = (form: WrappedFormUtils, key: string) => {
    form.validateFields((error, row) => {
      if (error) {
        return
      }
      const newData = this.state.data
      const index = newData.findIndex(item => key === item.key)
      if (index > -1) {
        const item = newData[index]
        const newItem = {
          ...item,
          ...row
        }
        newData.splice(index, 1, newItem)
        this.props.handleSubmit(newItem)
        this.setState({ editingKey: '', data: newData })
      } else {
        newData.push(row)
        this.setState({ editingKey: '', data: newData })
      }
    })
  }

  cancel = (key: string) => {
    const newData = this.state.data
    const item = newData.filter(item => item.key === key)[0]
    this.setState({ editingKey: '' })
    if (!item.id) {
      this.setState({ data: newData.filter(item => item.key !== key) })
    }
  }
  handleAdd = () => {
    const { count, data } = this.state
    if (this.state.editingKey === '') {
      const newData: Record = {
        key: count.toString(),
        name: '',
        email: '',
        phoneNum: '',
        address: ''
      }
      this.setState({
        editingKey: count.toString(),
        data: [...data, newData],
        count: count + 1
      })
    }
  }
  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    }
    let selectable
    if (this.props.selectable && this.columns && this.newCol) {
      selectable = this.newCol
    } else {
      selectable = this.columns
    }
    const newColumns = selectable.map(col => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: (record: Record) => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record)
        })
      }
    })
    const { editingKey } = this.state

    return (
      <>
        {editingKey !== '' ? (
          <Popconfirm title="Please save first" onConfirm={this.handleAdd}>
            <Button
              className="addAddress"
              type="primary"
              style={{ marginBottom: 12 }}
            >
              add Address
            </Button>
          </Popconfirm>
        ) : (
          <Button
            className="addAddress"
            onClick={this.handleAdd}
            type="primary"
            style={{ marginBottom: 12 }}
          >
            add Address
          </Button>
        )}
        <RadioGroup
          name="radiogroup"
          className="radio"
          onChange={this.onChange}
          value={this.state.selectConsigneeId}
        >
          <Table
            className="consignee-table"
            components={components}
            bordered
            dataSource={this.state.data}
            columns={newColumns}
            pagination={false}
          />
        </RadioGroup>
      </>
    )
  }
}

export { EditableTable }
