const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const Employee = require('./employeeSchema');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

const mongoURI = 'mongodb://localhost:27017/project2';

mongoose.connect(mongoURI)
    .then(() => console.log('Mongodb connected'))
    .catch(err => console.log(err));


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
const upload = multer({
    storage: storage
})

//Get all the employees
app.get('/', (req, res) => {
  const {count, start, orderBy} = req.query;
  const order = req.query.order === 'asc' ? 1: -1;
  Employee.find().skip(parseInt(start)).limit(parseInt(count)).sort({[orderBy]: order})
    .then(employees => res.json(employees))
})

//Get one employee
app.get('/getById/:id', (req, res) => {
    Employee.findOne({_id: req.params.id}).then(e => res.json(e));
})

//Create an employee
app.post('/create', upload.single('avatar'), (req, res) => {
    const newEmployee = new Employee({
        avatar: req.file ? req.file.path : null,
        name: req.body.name,
        title: req.body.title,
        sex: req.body.sex,
        startDate: req.body.startDate,
        officePhone: req.body.officePhone,
        cellPhone: req.body.cellPhone,
        SMS: req.body.SMS,
        email: req.body.email,
        managerName: req.body.managerName,
        managerId: req.body.managerId, 
        directReports: [],
    });
    newEmployee.save().then(e => res.json(e));
});

//Edit reports
app.put('/editReports/:id', (req, res) => {
    Employee.findOneAndUpdate({_id: req.params.id}, req.body, (err, doc) => {
        if (err) {
            res.json({success: err})
        }
        res.json(req.body);
    })
})

//Delete an Employee
app.delete('/delete/:id', (req, res) => {
    Employee.findById(req.params.id)
      .then(employee => employee.remove().then(() => res.json(employee)))
      .catch(() => res.status(404).json({success: false}))
});

//Edit a user
app.put('/edit/:id', upload.single('avatar'), (req, res) => {
    const newEmployee = new Employee({
        _id: req.params.id,
        avatar: req.file ? req.file.path : null,
        name: req.body.name,
        title: req.body.title,
        sex: req.body.sex,
        startDate: req.body.startDate,
        officePhone: req.body.officePhone,
        cellPhone: req.body.cellPhone,
        SMS: req.body.SMS,
        email: req.body.email,
        managerName: req.body.managerName, 
        managerId: req.body.managerId,
        directReports: req.body.directReports,
    });
    Employee.findByIdAndUpdate(req.params.id, newEmployee, {new: true}, (err, results) => {
        if (err) res.json({success: err})
        else{
            res.send(results)
        }
    })
})


const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server started on port ${port}`))
