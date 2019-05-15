import React from 'react';
import { Link as RouterLink } from 'react-router-dom'
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Link from '@material-ui/core/Link';
const baseURL = 'http://localhost:8080';
class HomePage extends React.Component {
    constructor(props) {
        console.log("did mount in homepage")
        super(props);
        this.state = { searchText: '', order: 'asc', orderBy: 'name', 
                       scrolling: false, ending: false, count: 12}
    }
    componentDidMount() {
        this.scrollListener = window.addEventListener('scroll', e => {
            this.handleScroll(e);
        })
    }
    handleScroll = () => {
        const {ending, scrolling} = this.state;
        if (ending) return;
        if (scrolling) return;
        const lastTr = document.querySelector('tbody > tr:last-child')
        if (!lastTr) {
            return;
        }
        const lastTrOffset = lastTr.offsetTop + lastTr.clientHeight;
        const pageOffset = window.pageYOffset + window.innerHeight;
        let bottomOffset = 20;
        if (pageOffset > lastTrOffset - bottomOffset) {
            this.setState({scrolling: true}, () => {
                new Promise((resolve, reject) => {resolve( this.props.getNewData(this.state.orderBy, this.state.order))}).then(() => {
                     if(this.props.employees.length <this.state.count) {
                        this.setState({ending:true});
                    }   
                    this.setState({scrolling:false});
                })
                
            })
        }
    }

    handleEdit = (id) => {
        this.props.history.push(`/edit/${id}`);
    }
    handleDelete = (id) => {
        new Promise((resolve, reject) => {resolve(this.props.deleteEmployee(id))})
        .then(
            this.props.history.push('/'),
        )
    }
    handleReset = () => {
        this.setState({ searchText: '' })
    }
    handleCreate = () => {
        this.props.history.push('/create')
    }

    filterArray = (arr) => {
        if (!this.state.searchText) {
            return arr;
        }
        const text = this.state.searchText.toLowerCase();
        return arr.filter(e => {
            for (let p in e) {
                if (typeof e[p] === 'string' && e[p].toLowerCase().includes(text)) {
                    return true;
                }
            }
            return false;
        })
    }

    handleOrderBy = (property) => {
        const newOrder = this.state.order === 'asc' ? 'desc' : 'asc';
        new Promise((resolve, reject) => {resolve(this.props.changeOrder(property, newOrder))})
        .then(() => {
            this.setState({orderBy: property, order: newOrder, ending: false})
        })
        
    }
   

    render() {
        const employees = this.filterArray(this.props.employees);
        console.log(employees);
        const domain = 'http://localhost:8080/';
        return (
            <div>
                <div>
                    <TextField  label = 'Search:' placeholder='Search Employee' value={this.state.searchText} onChange={e => this.setState({ searchText: e.target.value })} />
                    <div >
                        <Button  color="primary" onClick={this.handleReset}>Reset Filter</Button>
                        <Button  color="primary" onClick={this.handleCreate}>Add new Employee</Button>
                    </div>
                </div>
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell  ></TableCell>
                            <TableCell onClick={() => this.handleOrderBy('name')}>Name</TableCell>
                            <TableCell onClick={() => this.handleOrderBy('title')}>Title</TableCell>
                            <TableCell onClick={() => this.handleOrderBy('sex')}>Sex</TableCell>
                            <TableCell onClick={() => this.handleOrderBy('startDate')}>Start Date</TableCell>
                            <TableCell>Office Phone</TableCell>
                            <TableCell>Cell Phone</TableCell>
                            <TableCell>SMS</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Manager</TableCell>
                            <TableCell onClick={() => this.handleOrderBy('directReports')}># of DR</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            employees.map((employee) => {
                                return <TableRow key={employee._id}>
                                    <TableCell >
                                        {employee.avatar ? <img width="30" height="30" src={domain + employee.avatar}  alt='loading...' /> :
                                            <img width="30" height="30" src='https://static.standard.co.uk/s3fs-public/thumbnails/image/2017/08/15/12/smileyfaceemoji1508a.jpg?w968' alt='loading' />}
                                        </TableCell>
                                        <TableCell><div >{employee.name}</div></TableCell>
                                    <TableCell>{employee.title}</TableCell>
                                    <TableCell>{employee.sex}</TableCell>
                                    <TableCell>{employee.startDate}</TableCell>
                                    <TableCell><a href={`tel:${employee.officePhone}`}>{employee.officePhone}</a></TableCell>
                                    <TableCell><a href={`tel:${employee.cellPhone}`}>{employee.cellPhone}</a></TableCell>
                                    <TableCell>{employee.SMS}</TableCell>
                                    <TableCell><a href={`mailto:${employee.email}`}>{employee.email}</a></TableCell>
                                    <TableCell><Link component={RouterLink}to={`/getById/${employee.managerId}`}>{employee.managerName}</Link></TableCell>
                                    <TableCell><Link  component={RouterLink} to={`/reports/${employee._id}`}>{employee.directReports.length}</Link></TableCell>
                                    <TableCell onClick={() => this.handleEdit(employee._id)}><Button color="primary" >Edit</Button></TableCell>
                                    <TableCell onClick={() => this.handleDelete(employee._id)}><IconButton><DeleteIcon></DeleteIcon></IconButton></TableCell>
                                </TableRow>
                            })
                        }
                    </TableBody>
                    
                </Table>
            </div>
        )
     }
}

export default HomePage;