import React from 'react';
import { connect } from 'react-redux';
import HomePage from '../../components/HomePage';

import { getEmployees, deleteEmployee } from '../../actions/employees'; 
import axios from 'axios';
const baseURL = 'http://localhost:8080';
class Home extends React.Component {
    constructor(props) {
       
        super(props);
        this.state={count: 12, start: 0};
    }
    componentDidMount() {
        
        const { count, start } = this.state;
        this.props.getEmployees(count, start);
       
    }
 
    changeOrder = (orderBy, order) => {
        const count = this.state.count;
       return  new Promise((resolve, reject) => {resolve(this.props.getEmployees(count, 0, orderBy, order))})
        .then(this.setState({start :0}))
       

    }
    getNewData = (orderBy, order) => {
        const { count, start } = this.state;
        const newStart = count + start;
        console.log("newStart")
        console.log(newStart)
        return new Promise((resolve, reject) => {resolve(this.props.getEmployees(count, newStart, orderBy, order))})
        .then(this.setState({start :newStart}))
    }
    updateDelete = () => {
        const {count} = this.state;
        return new Promise((resolve, reject) => {resolve( this.props.getEmployees(count, 0))}) 
    }
    render() {
        return (
            <HomePage employees = {this.props.employees.data} getEmployees = {this.props.getEmployees} 
            changeOrder = {this.changeOrder} getNewData = {this.getNewData}
            updateDelete = {this.updateDelete} deleteEmployee = {this.props.deleteEmployee}
            history = {this.props.history}/>

        )
    }

}
const mapStateToProps = state => {
    return {
        employees: state.employees
    }
}
const mapDispatchToProps = dispatch=>{
    return{
        getEmployees: (count,start,orderBy,order)=>{
            dispatch(getEmployees(count,start,orderBy,order));
        },
        deleteEmployee :(id)=>{
            dispatch(deleteEmployee(id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
