import * as React from 'react'
import { Form, Input, Button, InputNumber, Table, Popconfirm } from 'antd'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import i18n from 'i18next'
import { EditableCell, EditableFormRow, EditableContext, Record } from '.'
import './table.scss'


interface TableProps {
    data: Array<Record>
    handleSubmit: (values: Record) => void
    handleDelete: (key: string) => void
}
interface TableState {
    editingKey: string
    data: Array<Record>
    count: number
}

class EditableTable extends React.Component<TableProps, TableState> {
    constructor(props: TableProps) {
        super(props)
        this.state = {
            editingKey: '',
            count: props.data ? props.data.length : 0,
            data: props.data
        }
    }
    columns = [
        {
            title: 'name',
            dataIndex: 'name',
            width: '15%',
            editable: true
        },
        {
            title: 'email',
            dataIndex: 'email',
            width: '21%',
            editable: true
        },
        {
            title: 'phoneNum',
            dataIndex: 'phoneNum',
            width: '16%',
            editable: true
        },
        {
            title: 'address',
            dataIndex: 'address',
            width: '25%',
            editable: true
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            width: '14%',
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
                                    title={i18n.t('Sure to cancel?')}
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
            width: '9%',
            render: (text: string, record: Record) => {
                return record.id ? (
                    <Popconfirm                    
                        title={i18n.t('Sure to delete?')}
                        onConfirm={() => record.id && this.handleDelete(record.id)}
                    >
                        <a href="javascript:;">Delete</a>
                    </Popconfirm>
                ) : null
            }
        }
    ]

    componentWillReceiveProps(nextProps: TableProps) {
        this.setState({
            data: nextProps.data,
            count: nextProps.data ? nextProps.data.length : 0
        })
    }

    isEditing = (record: Record) => {
        return record.key === this.state.editingKey
    }

    handleDelete = (key: string) => {
        this.props.handleDelete(key)
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
        const newColumns = this.columns.map(col => {
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
                {editingKey !== '' ?
                    <Popconfirm
                        title={i18n.t('Please save first')}
                        onConfirm={this.handleAdd}                        
                    >
                        <Button
                            className=" addAddress"
                            type="primary"
                            style={{ marginBottom: 12 }}
                        >
                            {i18n.t('Add Address')}
                        </Button>
                    </Popconfirm> :
                    <Button
                        className=" addAddress"
                        onClick={this.handleAdd}
                        type="primary"
                        style={{ marginBottom: 12 }}
                    >
                        {i18n.t('Add Address')}
                    </Button>}
                <Table
                    className="consignee-table"
                    components={components}
                    bordered
                    dataSource={this.state.data}
                    columns={newColumns}
                    pagination={false}
                />
            </>
        )
    }
}

export { EditableTable }
