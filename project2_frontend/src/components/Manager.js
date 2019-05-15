import React from 'react';
import axios from 'axios';

import HomePage from './HomePage';

class Manager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {employees: []}
    }

    getManager = (id) => {
        return axios.get(`http://localhost:8080/getById/${id}`)
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        this.getManager(id).then(res => {
            this.setState({employees: [res.data]})
        })
    }

    render() {
        return <HomePage employees={this.state.employees} history = {this.props.history}/>
    }
}



export default Manager;