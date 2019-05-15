import axios from 'axios';
const baseURL = 'http://localhost:8080';

const  requestStart=()=>{
    return {
      type: 'REQUEST_EMPLOYEES_START'
    };
  };
 const requestSuccess=(employees) =>{
    return {
      type: 'REQUEST_EMPLOYEES_SUCCESS',
      payload:employees
    };
  };
const requestFail=(err) =>{
    return {
      type: 'REQUEST_EMPLOYEES_FAIL',
      error:err
    };
  };
const newEmployeeHelper = (employee) =>{
  
      return {
          type:'ADD_EMPLOYEE',
          payload:employee
      };
  };
const updateReportsHelper=(manager) =>{
      return {
          type:'EDIT_REPORTS',
          payload:manager
      };
  };
const editEmployeeHelper = (employee)=>{
      return {
          type:'EDIT_EMPLOYEE',
          payload:employee
      };
  };
const deleteEmployeeHelper = (id) =>{
      return {
          type:'DELETE_EMPLOYEE',
          payload:id
      };
  }; 
export const getEmployees = (count, start,orderBy='colName',order='asc') =>{
      return (dispatch,getState)=>{
          dispatch(requestStart());
          axios
          .get(`${baseURL}?count=${count}&start=${start}&orderBy=${orderBy}&order=${order}`)
          .then(res=>{
              dispatch(requestSuccess(res.data));
          })
          .catch(err=>{
              dispatch(requestFail(err));
          })
      }
      
  }
export const addEmployee=(employee)=>{
      return (dispatch,getState)=>{
        dispatch(requestStart());
          axios({
              method:'post',
              url:`${baseURL}/create`,
              data:employee,
              headers:{'Content-Type':'multipart/form-data'}
          })
          .then(res=>{
              dispatch(newEmployeeHelper(res.data));
              if (res.data.managerId) {
                axios
                .get(`${baseURL}/getById/${res.data.managerId}`)
                .then(result => {
                  const manager = result.data;
                  manager.directReports.push(res.data._id);
                  dispatch(updateReports(manager));
                    })
                .then(()=>getEmployees());
                  }
          })
          .catch(err=>{
              dispatch(requestFail(err));
          })
      }
  }
export const updateReports = manager =>{
      return (dispatch,getStage)=>{
        dispatch(requestStart());
          axios
          .put(`${baseURL}/editReports/${manager._id}`,manager)
          .then(res=>{
              dispatch(updateReportsHelper(manager));
          })
          .catch(err=>{
            dispatch(requestFail(err));
          })
      
    }
  }
export const deleteEmployee = id=>{
      return (dispatch,getState)=>{
        dispatch(requestStart());
          axios
          .delete(`${baseURL}/delete/${id}`)
          .then(res=>{
            dispatch(deleteEmployeeHelper(id));
            //delete who manager this employee
             if (res.data.managerId){
             const deletedEmployee = res.data;
             axios
             .get(`${baseURL}/getById/${res.data.managerId}`)
             .then(res => {
               console.log("get manager")
               console.log(res);
             const manager = res.data;
            const newList = manager.directReports.filter(r => r !== id);
             manager.directReports = newList;
            dispatch(updateReports(manager));
            console.log("update complete")
            })
            }
            //delete all the employee managered
            const subordinates = res.data.directReports;
            let set = new Set(subordinates);
             axios
            .get(baseURL)
            .then(res => {
                let newList = res.data.filter(e => {
                    if (set.has(e._id)) {
                         e.managerName = '';
                        e.managerId = '';
                        return true;
                    }
                    return false;
                });
                return Promise.all(newList.map(e => dispatch(updateReports(e))))
           })
        
        })
          .catch(err=>{
              dispatch(requestFail(err));
          })
      }
  }
export const editEmployee = employee=>{
      return(dispatch,getState)=>{
        dispatch(requestStart());
        axios({
          method: 'put',
          url: `${baseURL}/edit/${employee.get('_id')}`,
          data: employee,
          headers: {'Content-Type': 'multipart/form-data'}
         })
          .then(res=>{
              dispatch(editEmployeeHelper(res.data));
          })
          .catch(err=>{
              dispatch(requestFail(err));
          })
      }
  }