import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {connect,Dispatch} from 'react-redux';
import {orderActionCreators,categoryActionCreators} from '../../actions'
import {Order} from '../../models'
import {Category,CategoryDetails} from '../../models'
import {RootState} from '../../reducers'
import {orderConsts} from '../../constants'
interface OrderProps extends RouteComponentProps < {id: string} >  {
    dispatch: Dispatch<RootState>;
    loading:boolean;
    editing: boolean;
    orderData:Order;
    categorys: Array < Category >
}
interface OrderState  {
    order: Order;
    orderId?:string;
    submitted:boolean;
}
class EditPage extends React.Component <OrderProps, OrderState>{
    constructor(props:OrderProps) {
        super(props);
        this.state = {
            submitted:false,
            order: {type:"Beef"}
        };
    }
    initOrder(orderType:string):Order{
        let {categorys} = this.props;
        let currentCategory:CategoryDetails;
        let newCategorys = categorys.filter(
            (category:Category)=>{
                return category.type===orderType })
        if(newCategorys.length>0){
            currentCategory = newCategorys[0].details
            return {
                storage:currentCategory.Storage?currentCategory.Storage[0]:undefined,
                breed:currentCategory.Breed?currentCategory.Breed[0]:undefined,
                grade:currentCategory.Grade?currentCategory.Grade[0]:undefined,
                slaughterSpec:currentCategory["Slaughter Specification"]?currentCategory["Slaughter Specification"][0]:undefined,
                primalCut:currentCategory["Primal Cut"]?currentCategory["Primal Cut"][0]:undefined,
                bone:currentCategory.Bone?currentCategory.Bone[0]:undefined,
            }
        }else{
            return {}
        }
        
    }
    componentDidMount(){
        let orderId = this.props.match.params.id
        orderId&&this.setState(
            {...this.state,
            orderId})
        if(!this.props.categorys)
            this.props.dispatch(categoryActionCreators.getAll());
        orderId && this
            .props
            .dispatch(orderActionCreators.getById(orderId))
    }
    componentWillReceiveProps(nextProps:OrderProps) {
        const {orderData} = nextProps;
        const {submitted,orderId} = this.state;
        if (orderId && orderData && !submitted) {
            const {order} = this.state;
            this.setState({
                order: {
                    ...orderData
                }
            });
        }
    }
    handleChange=(e:React.FormEvent<HTMLSelectElement>)=> {
        const {name,value} = e.currentTarget;
        const {order} = this.state;
        this.setState({
            order: {
                ...order,
                [name]: value
            }
        });
        if (name=="type"){
            let newOrder = this.initOrder(value)
            this.setState({order:{
                ...order,
                ...newOrder,
                [name]: value,
            }})
        }
    }
    handleSubmit=(event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const {order,orderId} = this.state;
        const {dispatch} = this.props;
        if(order.type){
            if(orderId)
                dispatch(orderActionCreators.edit(order,orderId));   
            else
                dispatch(orderActionCreators.new(order));
        }
            
    }
    renderSelect(items:Array<string>,field: string){
        let orderField:(keyof Order|undefined)  
        let select = null
        switch (field) {
            case "Storage" :
                orderField = "storage"
                break ;
            case "Breed" :
                orderField = "breed"
                break ;
            case "Grade" :
                orderField = "grade"
                break ;
            case "Slaughter Specification" :
                orderField = "slaughterSpec"
                break ;
            case "Primal Cut" :
                orderField = "primalCut"
                break ;
            case "Bone" :
                orderField = "bone"
                break ;
        }
        
        if(orderField!=undefined)
         return select = (
            <div key={field} className="form-group col-md-4">
                <label className="from-lable">{field}</label>
                <select  className="form-control" name={orderField} value={String(this.state.order[orderField])} onChange={this.handleChange}>
                    <option></option>
                    {items.map((item,index)=>
                        <option key={index} value={item}>{item}</option>)}
                </select>
            </div>
        );
    }
    render() {
        const {id,type} = this.state.order;
        const {editing,categorys} = this.props
        let options = null
        let currentCategory:Category
        let newCategorys:Category[] = []
        if(type&&categorys&&categorys.length>0){
            newCategorys = categorys.filter(
                (category:Category)=>{
                    return category.type===type })
            if(newCategorys.length>0){
                currentCategory = newCategorys[0]
                options=
                    Object.keys(newCategorys[0].details).map(
                        (key:keyof CategoryDetails)=>{
                            return this.renderSelect(currentCategory.details[key],key)})
            }
        }
        return (
                <div className="col-md-10 offset-md-1">
                    <h2 className="header">{id?'Edit':'Create'} Order page</h2>
                    <form name="form" className="row" onSubmit={this.handleSubmit}>
                        <div className="form-group"> 
                            <label className="from-lable">Order type</label>
                            <select className="form-control" name="type" value={type} onChange={this.handleChange}>
                                {orderConsts.ORDER_TYPE.map((item,index)=>
                                    <option key={index}>{item}</option>)}
                            </select>
                        </div>
                        {/* } */}
                        <div className="row" >
                            {options}
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary">Submit</button>
                            {editing && <img
                                src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>
                            }
                            <Link to="/orders" className="btn btn-link">Cancel</Link>
                        </div>
                    </form>
                </div>
        );
    }
}

function mapStateToProps(state:RootState) {
    const {order,category} = state;
    const {editing,loading,orderData} = order;
    const {items} = category
    return {editing,categorys:items,orderData};
}
const connectedEditPage = connect(mapStateToProps)(EditPage);
export {connectedEditPage as EditPage};