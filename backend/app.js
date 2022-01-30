const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

require('dotenv/config');

const errorHandler = require("./helpers/error-handler");
const authJwt = require("./helpers/jwt");

app.use(cors());
app.options('*', cors())

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt);
app.use(errorHandler);

//Routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

//Database
app.post(`${api}/products`, (req, res) => {
    const product = req.body;
    res.send(product);
});

mongoose.connect(process.env.CONNECTION_STRING)
    .then(r => console.log("Mongoose is connected"))
    .catch(err => console.log("could not connect"));

app.listen(3000, () => {
    console.log('server is running http://localhost:3000');
});
