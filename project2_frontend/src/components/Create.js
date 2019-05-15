import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Typography from "@material-ui/core/Typography";

class Create extends React.Component {
    constructor(props) {
        super(props);
        this.state={avatar:null, name:'', title:'', sex:'', startDate:'',
        officePhone:'', cellPhone:'', SMS:'', email:'', manager: '', previewURL:''}
    }

    componentDidMount() {
        this.props.getEmployees();
    }

    handleSubmit = () => {
        const formData = new FormData();
        for (var i in this.state) {
            formData.append(i, this.state[i]);
        }
        formData.delete('manager');
        const { manager } = this.state;
        const mName = manager.split('-')[0];
        const mId = manager.split('-')[1] || '';
        formData.append('managerName', mName);
        formData.append('managerId',mId);
        new Promise((resolve, reject) => {resolve(this.props.addEmployee(formData))}).then(this.props.history.push('/'))
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

    handleManagerChange = (e) => {
        this.setState({manager:e.target.value})
    }

    render() {
        const {previewURL} = this.state;
        const employees = this.props.employees.data;
        return <div>
                <div >
                <Typography variant="h4">
                New Empolyee:</Typography>
                    
                    <div className='buttongroup'>
                        <Button color="primary" className="ui button" onClick={this.handleBack}>Back</Button>
                        <Button color="primary" className="ui green button" onClick={this.handleSubmit}>Submit</Button>
                    </div>
                </div>
                <div >
                    <div>
                        {
                            previewURL ? <img width="30" height="30" src={previewURL} alt='loading'/> : <img width="30" height="30" src='https://static.standard.co.uk/s3fs-public/thumbnails/image/2017/08/15/12/smileyfaceemoji1508a.jpg?w968' alt='loading...'/>
                        }    
                        <span>  <Typography>Please select a photo as avatar:</Typography><div><input type='file' onChange={this.handleImageChange}/></div></span>
                    </div>

                    <Table >
                        <TableRow >
                         
                            <TextField   label='Name:' type="text" onChange={e=>this.setState({name:e.target.value})} value={this.state.name}/>
                        </TableRow>
                        <TableRow >
                            <TextField  label='Title:' type="text" onChange={e=>this.setState({title:e.target.value})} value={this.state.title}/>
                        </TableRow>
                        <TableRow >
                        <RadioGroup aria-label="Gender" >
                        <FormControlLabel value="female" control={<Radio />} label="Female" name='gender' value='M' onChange={e=>this.setState({sex:e.target.value})}/>
                        <FormControlLabel value="male" control={<Radio />} label="Male" name='gender' value='F' onChange={e=>this.setState({sex:e.target.value})}/>
                     </RadioGroup>
                        
                        </TableRow>
                        <TableRow >
                            
                        <TextField  label='Start Date:' type='date' onChange={e=>this.setState({startDate:e.target.value})}/>
                        </TableRow>
                        <TableRow >
                            
                            <TextField  label='Office Phone:' type='text' onChange={e=>this.setState({officePhone: e.target.value})}/>
                        </TableRow>
                        <TableRow >
                           
                            <TextField label='Cell Phone:' type='text' onChange={e=>this.setState({cellPhone: e.target.value})}/>
                        </TableRow>
                        <TableRow >
                            
                            <TextField  label='SMS:' type='text' onChange={e=>this.setState({SMS:e.target.value})}/>
                        </TableRow>
                        <TableRow >
                            
                            <TextField  label='Email:' type='text' onChange={e=>this.setState({email:e.target.value})}/>
                        </TableRow>
                        <TableRow >
                           
                            <label>Manager:</label>
                            <Select onChange={this.handleManagerChange} value={this.state.manager}>
                                <option value="" name=""></option>
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

export default Create;

