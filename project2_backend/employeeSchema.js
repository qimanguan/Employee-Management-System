const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema ({
    avatar:{
        type:String,
    },
    name :{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    sex:{
        type:String,
        required:true,
    },
    startDate:{
        type:String,
        required:true,
    },
    officePhone:{
        type:String,
        required:true,
    },
    cellPhone:{
        type:String,
        required:true,
    },
    SMS:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    managerName:{
        type:String,
    },
    managerId:{
        type:String,
    },
    directReports:{
        type:[String],
        required: true,
    }
})
module.exports =mongoose.model('employee',EmployeeSchema)