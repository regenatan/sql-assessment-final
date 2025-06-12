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

app.get('/customers', async function (req, res) {
let [customers] = await connection.execute('SELECT * FROM Customers INNER JOIN Companies ON Customers.company_id = Companies.company_id');
res.render('customers/index',{
    customers: customers
});
})

app.get('/customers/create', async function (req,res){
    const [companies] = await connection.execute(`SELECT company_id, name from Companies`);
    res.render('customers/create', {
        companies: companies
    })
})

app.post('/customers/create', async function (req, res){
    const {first_name, last_name, rating, company_id} = req.body;
    const sql = `INSERT into Customers (first_name, last_name, rating, company_id) values (?,?,?,?);`
    const bindings = [first_name, last_name, rating, company_id];
    await connection.execute(sql, bindings);
    res.redirect('/customers');

    console.log(req.body);

})

app.get('/', (req,res) => {
    res.send('Hello, World!');
});

app.get('/about-us', (req,res) => {
    res.render('about-us');
});

app.get('/contact-us', (req,res) => {
    res.render('contact-us');
});





    }

main();

app.listen(3000, ()=>{
    console.log('Server is running')
});
