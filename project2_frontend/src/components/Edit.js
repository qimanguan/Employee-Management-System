import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { editEmployee, updateReports, getEmployees } from '../actions/employees';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Typography from "@material-ui/core/Typography";

const baseURL = 'http://localhost:8080';

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state={avatar:null, name:'', title:'', sex:'', startDate:'', employees: [], managerId: '',
        officePhone:'', cellPhone:'', SMS:'', email:'', manager:'', previewURL:'', directReports: [], managerName: ''}
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        axios.get(baseURL)
        .then(res => {
            this.setState({employees: this.filterArray(res.data, id)}, () => {
                this.getOneEmployee(id).then(res => {
                    this.setState(res.data)
                })
            })
        })
    }
//filter the employee who is edited and his direct report 
    filterArray = (arr, id) => {
        let hash = {};
        arr.forEach(e => hash[e._id] = e._id);
        const getRoot = (hash, cur) => {
            while (cur !== hash[cur]) {
                cur = hash[cur];
            }
            return cur;
        }
        arr.forEach(e => {
            const root1 = getRoot(hash, e._id);
            e.directReports.forEach(report => {
                const root2 = getRoot(hash, report);
                if (root1 !== root2) {
                    hash[root2] = root1;
                }
            })
        })
        const root = getRoot(hash, id);
        
        return arr.filter(e => {
            return getRoot(hash, e._id) !== root;
        })
    }

    getOneEmployee = (id) => {
        return axios.get(`http://localhost:8080/getById/${id}`);
    }

    handlePrevChange = () => {
        const id = this.props.match.params.id;
        return this.getOneEmployee(this.state.managerId).then(res => {
            const prev = res.data;
            const newList = prev.directReports.filter(e => e !== id);
            prev.directReports = newList;
            //this.props.updateReports(prev)
            new Promise((resolve, reject) => {resolve(this.props.updateReports(prev))})
            .then(() => this.props.history.push('/'));
        })
    }

    handleSubmit = () => {
        //Current employee formData
        const formData = new FormData();
        for (var i in this.state) {
            formData.append(i, this.state[i])
        }
        formData.delete('directReports');
        formData.delete('managerName');
        formData.delete('managerId');
        for (let i in this.state.directReports) {
            formData.append('directReports', i);
        }
        const { manager } = this.state;
        const curManagerName = manager.split('-')[0];
        const curManagerId = manager.split('-')[1] || '';
        formData.append('managerName', curManagerName);
        formData.append('managerId', curManagerId);

        //Edit current employee
        new Promise((resolve, reject) => {resolve(this.props.editEmployee(formData))})
        // this.props.editEmployee(formData)
        .then(res => {
            if (curManagerId === this.state.managerId) {
                this.props.history.push('/');
                return res;
            }
            if (manager) {
                this.getOneEmployee(curManagerId).then(m => {
                    const ma = m.data;
                    ma.directReports.push(this.props.match.params.id);
                   
                    new Promise((resolve, reject) => {resolve(  this.props.updateReports(ma))})
                    .then(() => {
                        if (this.state.managerId) {
                            this.handlePrevChange();
                        } else {
                            this.props.history.push('/');
                        }
                    })
                })
            } else {
                if (this.state.managerId) {
                    this.handlePrevChange();
                } else {
                    this.props.history.push('/');
                }
            }
        });
    }

    handleImageChange = (e) => {
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({avatar: file, previewURL: reader.result})
        }
        reader.readAsDataURL(file)
    }

    handleBack = () => {
        this.props.history.push('/');
    }

    render() {
        const { previewURL, employees } = this.state;
        return <div>
                <div>
                <Typography variant="h4">
                Edit Empolyee:</Typography>
                    <div >
                        <Button  color="primary" className="ui button" onClick={this.handleBack}>Back</Button>
                        <Button  color="primary" className="ui green button" onClick={this.handleSubmit}>Modify</Button>
                    </div>
                </div>
                <div >
                    <div>
                        {
                            previewURL ? <img width="30" height="30" src={previewURL} alt='loading'/> : <img width="30" height="30" src='https://static.standard.co.uk/s3fs-public/thumbnails/image/2017/08/15/12/smileyfaceemoji1508a.jpg?w968' alt='loading...'/>
                        }    
                        <span><Typography>Please select a photo as avatar:</Typography><div><input type='file' onChange={this.handleImageChange}/></div></span>
                    </div>
                    <Table >
                        <TableRow>
                            <TextField  label='Name:' type="text" onChange={e=>this.setState({name:e.target.value})} value={this.state.name}/>
                        </TableRow>
                        <TableRow >
                            <TextField  label='Title' type="text" onChange={e=>this.setState({title:e.target.value})} value={this.state.title}/>
                        </TableRow>
                        <TableRow >
                        <RadioGroup aria-label="Gender" >
                        <FormControlLabel value="female" control={<Radio />} label="Female" name='gender' value='M' onChange={e=>this.setState({sex:e.target.value})}/>
                        <FormControlLabel value="male" control={<Radio />} label="Male" name='gender' value='F' onChange={e=>this.setState({sex:e.target.value})}/>
                     </RadioGroup>
                        </TableRow>
                        <TableRow >
                            <TextField  label='Start Date:' type='date' onChange={e=>this.setState({startDate:e.target.value})} value={this.state.startDate}/>
                        </TableRow>
                        <TableRow >
                        
                            <TextField  label='Office Phone:'type='text' onChange={e=>this.setState({officePhone: e.target.value})} value={this.state.officePhone}/>
                        </TableRow>
                        <TableRow >
                            <TextField label = 'Cell Phone:' type='text' onChange={e=>this.setState({cellPhone: e.target.value})} value={this.state.cellPhone}/>
                        </TableRow>
                        <TableRow >
                            
                            <TextField label = 'SMS:'type='text' onChange={e=>this.setState({SMS:e.target.value})} value={this.state.SMS}/>
                        </TableRow>
                        <TableRow >
                         
                            <TextField  label='Email:' type='text' onChange={e=>this.setState({email:e.target.value})} value={this.state.email}/>
                        </TableRow>
                        <TableRow >
                        <label>Manager:</label>
                            <Select   onChange={e => this.setState({manager: e.target.value})}>
                                <option value=""></option>
                                {
                                    employees.map(e => {
                                        return <option key={e._id} value={`${e.name}-${e._id}`}>{e.name}</option>
                                    })
                                }
                            </Select>
                        </TableRow>
                    </Table>
                </div>
        </div>
    }
}

const mapStateToProps = state => {
    return {
        employees: state.employees  
    }
}

export default connect(mapStateToProps, { editEmployee, updateReports, getEmployees })(Edit);