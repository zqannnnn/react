import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {connect, Dispatch} from 'react-redux';
import {orderActionCreators,categoryActionCreators,alertActionCreators} from '../../actions'
import {Order} from '../../models'
import {Category, CategoryDetails} from '../../models'
import {RootState} from '../../reducers'
import {orderConsts} from '../../constants'
import {FormattedMessage} from 'react-intl';
interface OrderProps extends RouteComponentProps < { id: string } > {
    dispatch: Dispatch < RootState >;
    loading: boolean;
    editing: boolean;
    orderData: Order;
    categorys: Category[];
}
interface OrderState {
    order : Order;
    orderId?: string;
    submitted : boolean;
}
class EditPage extends React.Component < OrderProps, OrderState > {
    constructor(props : OrderProps) {
        super(props);
        this.state = {
            submitted: false,
            order: {
                type: "Beef"
            }
        };
    }
    componentDidMount() {
        let orderId = this.props.match.params.id
        orderId && this.setState({
            ...this.state,
            orderId
        })
        if(!this.props.categorys)
            this.props.dispatch(categoryActionCreators.getAll());
        orderId && this.props.dispatch(orderActionCreators.getById(orderId))
    }
    componentWillReceiveProps(nextProps : OrderProps) {
        const {orderData,categorys} = nextProps;
        const {submitted, orderId,order} = this.state;
        if (orderId && orderData && !submitted) {
            this.setState({
                order: {
                    ...order,
                    ...orderData
                }
            });
        }
        if(!orderId&&categorys){
            this.setState({
                order: {
                    ...order,
                }
            })
        }
    }
    handleSelectChange = (e : React.FormEvent < HTMLSelectElement >) => {
        const {name, value} = e.currentTarget;
        const {order} = this.state;
        this.setState({
            order: {
                ...order,
                [name]: value
            }
        });
    }
    handleInputChange = (e : React.FormEvent < HTMLInputElement >) => {
        const {name, value} = e.currentTarget;
        const {order} = this.state;
        this.setState({
            order: {
                ...order,
                [name]: value
            }
        });
        
    }
    handleSubmit = (event : React.FormEvent < HTMLFormElement >) => {
        event.preventDefault();
        const {order, orderId} = this.state;
        const {dispatch} = this.props;
        if (order.type) {
            if (orderId) 
                dispatch(orderActionCreators.edit(order, orderId));
            else 
                dispatch(orderActionCreators.new(order));
        }else{
            //dispatch(alertActionCreators.error(""));
        }
    }
    //for render select input
    renderSelect(optionItems : Array < string >, field : keyof Order) {
        return (
            <select
                className="form-control"
                name={field}
                value={String(this.state.order[field])}
                onChange={this.handleSelectChange}>
                <option></option>
                {optionItems.map((item, index) => 
                    <option key={index} value={item}>{item}</option>)}
            </select>
        );
        }
    render() {
        const {id, type,price,bone,primalCut,quantity,deliveryTerm} = this.state.order;
        const {editing, categorys} = this.props
        let options = null
        let currentCategory : Category = categorys&&categorys.filter(
            (category:Category)=>{
                return category.type===type})[0]
        
        return (
            <div className="col-md-10 offset-md-1">
                <h2 className="header">{id? 
                    <FormattedMessage id="orderEdit.editOrderPage" defaultMessage="Edit Order Page"/>:
                    <FormattedMessage id="orderEdit.createOrderPage" defaultMessage="Create Order Page"/>}
                </h2>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="form-group col-md-4">
                            <label className="form-lable">
                                <FormattedMessage id="orderEdit.orderType" defaultMessage="Order Type"/></label>
                                <select
                                    className="form-control"
                                    name="type"
                                    value={type}
                                    onChange={this.handleSelectChange}>
                                    {orderConsts
                                        .ORDER_TYPE
                                        .map((item, index) => <option key={index}>{item}</option>)}
                                </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-md-4">
                            <label className="form-lable">
                                <FormattedMessage id="orderEdit.bone" defaultMessage="Bone"/>
                            </label>
                            {currentCategory&&this.renderSelect(currentCategory.details["Bone"],"bone")}
                        </div>
                        <div className="form-group col-md-4">
                            <label className="form-lable">
                                <FormattedMessage id="orderEdit.storage" defaultMessage="Storage"/>
                            </label>
                            {currentCategory&&this.renderSelect(currentCategory.details["Storage"],"storage")}
                        </div>
                        <div className="form-group col-md-4">
                            <label className="form-lable">
                                <FormattedMessage id="orderEdit.grade" defaultMessage="Grade"/>
                            </label>
                            {currentCategory&&this.renderSelect(currentCategory.details["Grade"],"grade")}
                        </div>
                        <div className="form-group col-md-4">
                            <label className="form-lable">
                                <FormattedMessage id="orderEdit.slaughterSpec" defaultMessage="Slaughter Specification"/>
                            </label>
                            {currentCategory&&this.renderSelect(currentCategory.details["Slaughter Specification"],"slaughterSpec")}
                        </div>
                        {currentCategory&&currentCategory.type!="Sheep"&&<div className="form-group col-md-4">
                            <label className="form-lable">
                                <FormattedMessage id="orderEdit.breed" defaultMessage="Breed"/>
                            </label>
                            {this.renderSelect(currentCategory.details["Breed"],"breed")}
                        </div>}
                        <div className="form-group col-md-4">
                            <label className="form-lable">
                                <FormattedMessage id="orderEdit.marbleScore" defaultMessage="Marble Score"/>
                            </label>
                            {currentCategory&&this.renderSelect(currentCategory.details["Marble Score"],"marbleScore")}
                        </div>
                        <div className="form-group col-md-4">
                            <label className="form-lable">
                                <FormattedMessage id="orderEdit.primalCut" defaultMessage="Primal Cut"/>
                            </label>
                            <input
                                    className="form-control"
                                    type="text"
                                    name="primalCut"
                                    value={primalCut}
                                    onChange={this.handleInputChange}/>
                        </div>
                        <div className="form-group col-md-4">
                            <label className="form-lable">
                                <FormattedMessage id="orderEdit.deliveryTerm" defaultMessage="Delivery Term"/>
                            </label>
                            <input
                                    className="form-control"
                                    type="text"
                                    name="deliveryTerm"
                                    value={deliveryTerm}
                                    onChange={this.handleInputChange}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-md-4">
                                <label className="form-lable">
                                    <FormattedMessage id="orderEdit.quantity" defaultMessage="Quantity"/>
                                </label>
                                <div className="row col">
                                <input
                                    className="form-control col-md-10"
                                    type="number"
                                    name="quantity"
                                    value={quantity}
                                    onChange={this.handleInputChange}/>
                                    <span className="col-md-2">
                                        <FormattedMessage id="orderEdit.ton" defaultMessage="Ton"/>
                                    </span>
                                </div>
                        </div>
                        <div className="form-group col-md-4">
                                <label className="form-lable">
                                    <FormattedMessage id="orderEdit.price" defaultMessage="Price"/>
                                </label>
                                <div className="row col">
                                <input
                                    className="form-control col-md-10"
                                    type="number"
                                    name="price"
                                    value={price}
                                    onChange={this.handleInputChange}/>
                                    <span className="col-md-2">USD/kg</span>
                                </div>
                        </div>
                    </div>
                    <div className="form-group col-md-12">
                        <button className="btn btn-primary">
                            <FormattedMessage id="orderEdit.submit" defaultMessage="Submit"/>
                        </button>
                        {editing && <i className="fa fa-plus-circle" aria-hidden="true"></i>
}
                        <Link to="/orders" className="btn btn-link">
                            <FormattedMessage id="orderEdit.cancel" defaultMessage="Cancel"/>
                        </Link>
                    </div>
                </form>
            </div>
            ); } } 
function mapStateToProps(state:RootState) {
    const {order, category} = state;
    const {editing, loading, orderData} = order;
    const {items} = category
    return {editing, categorys: items, orderData};
}
const connectedEditPage = connect(mapStateToProps)(EditPage); 
export {connectedEditPage as EditPage}