import { addEmployee, updateReports, getEmployees } from '../../actions/employees';
import React from 'react';
import { connect } from 'react-redux';
import Create from '../../components/Create'

class CreateCon extends React.Component {
    componentDidMount() {
        this.props.getEmployees();
    }
    render(){
        return (
            <div>
                <Create employees={this.props.employees} history={this.props.history}  
                addEmployee = {this.props.addEmployee} updateReports = {this.props.addEmployee} 
                getEmployees = {this.props.addEmployee} />
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        employees: state.employees
    }
}
const mapDispatchToProps = dispatch =>{
    return {
        addEmployee : employee =>{
            dispatch(addEmployee(employee));
        },
        updateReports : manager=>{
            dispatch(updateReports(manager));
        },
        getEmployees :()=>{
            dispatch(getEmployees());
        }
    };
}

export default connect(mapStateToProps, { addEmployee, updateReports, getEmployees })(CreateCon);