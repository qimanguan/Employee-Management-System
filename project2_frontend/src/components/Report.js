import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import HomePage from './HomePage';
import {getEmployees,getEmployeeById} from '../actions/employees'

class Reports extends React.Component {

    constructor(props) {
        super(props);
        this.state = { employees: [] }
    }

    componentDidMount() {
    const baseURL = 'http://localhost:8080';
       axios
       .get(`${baseURL}/getById/${this.props.match.params.id}`)
       .then(res => {
           console.log("response res")
           console.log(res.data)
            const manager = res.data;
            Promise.all(manager.directReports.map(id => {
                return (
                    axios
                    .get(`${baseURL}/getById/${id}`)
                    .then(res=> {return res.data})
                )
            }))
            .then(list => {this.setState({employees: list})})
            .catch(err=>console.log(err));

        });
    }

    render() {
        console.log("report render")
        console.log(this.state.employees);
        return <HomePage employees={this.state.employees} history = {this.props.history}/>
        
       
    }
}

const mapStateToProps = state => {
    return {
        employees: state.employees
    }
}

export default connect(mapStateToProps, { getEmployees })(Reports);