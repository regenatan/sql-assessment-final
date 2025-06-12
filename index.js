const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();

const mysql = require('mysql2/promise');

let app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// require in handlebars and their helpers
const helpers = require('handlebars-helpers');
// tell handlebars-helpers where to find handlebars
helpers({
    'handlebars': hbs.handlebars
})

async function main() {
let connection = await mysql.createConnection({
  'host': process.env.DB_HOST,
        'user': process.env.DB_USER,
        'database': process.env.DB_NAME,
        'password': process.env.DB_PASSWORD
})

//get all customers
app.get('/customers', async function (req, res) {
let [customers] = await connection.execute('SELECT * FROM Customers INNER JOIN Companies ON Customers.company_id = Companies.company_id');
res.render('customers/index',{
    customers: customers
});
})

// new customer form
app.get('/customers/create', async function (req,res){
    const [companies] = await connection.execute(`SELECT company_id, name from Companies`);
    res.render('customers/create', {
        companies: companies
    })
})

//post new customer
app.post('/customers/create', async function (req, res){
    try {
    const {first_name, last_name, rating, company_id} = req.body;
    const sql = `INSERT into Customers (first_name, last_name, rating, company_id) values (?,?,?,?);`
    const bindings = [first_name, last_name, rating, company_id];
    
    await connection.execute(sql, bindings);

    } catch (e)
    {
        console.log(e);
    } finally {
    res.redirect('/customers');

    console.log(req.body);}
})


// get all employees
app.get('/employees', async function (req, res) {
let [employees] = await connection.execute('SELECT * FROM Employees INNER JOIN Departments ON Employees.department_id = Departments.department_id;');
res.render('employees/index',{
    employees: employees
})
})

// new employee form
app.get('/employees/create', async function (req,res){
    const [departments] = await connection.execute(`SELECT department_id, name from Departments`);
    res.render('employees/create', {
        departments: departments
    })
})

//post new employee
app.post('/employees/create', async function (req, res){
    try {
    const {first_name, last_name, department_id} = req.body;
    const sql = `INSERT into Employees (first_name, last_name, department_id) values (?,?,?);`
    const bindings = [first_name, last_name, department_id];
    
    await connection.execute(sql, bindings);
    } catch (e) {
        console.log(e);
    } finally {
        res.redirect('/employees');
    }

    
})


//hello world
app.get('/', (req,res) => {
    res.render('index');
});

app.get('/about-us', (req,res) => {
    res.render('about-us');
});

app.get('contact-us', (req,res) => {
    res.render('contact-us');
});





    }

main();

app.listen(3000, ()=>{
    console.log('Server is running')
});
