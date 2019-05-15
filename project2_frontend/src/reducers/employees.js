const employees = (state={isLoading: false, error: '', data: []},action)=>{
    switch(action.type){
        case 'REQUEST_EMPLOPYEES_START':
        return {
            ...state,
            isLoading:true
        }
        case 'REQUEST_EMPLOYEES_FAIL':
        return {
            ...state,
            isLoading:false,
            error: action.error
        }
        case 'REQUEST_EMPLOYEES_SUCCESS':
        return {
            ...state,
            data:action.payload,
            isloading:false
        }
        case 'ADD_EMPLOYEE':
        return{
            ...state,
            data:[...state.data, action.payload]
        }
        case 'DELETE_EMPLOYEE':
        return{
            ...state,
            data:state.data.filter(employee=>employee._id !== action.payload)
        }
        case 'EDIT_EMPLOYEE':
        return {
            ...state,
            data: [
                ...state.data.filter(employee=>employee._id!==action.payload._id),
                action.payload
            ]
        }
        case 'EDIT_REPORTS':
        return {
            ...state,
            data:[
                ...state.data.filter(employee=>employee._id!==action.payload._id),
                action.payload
            ]
        }
        default:
        return state;
    }
}
export default employees;