const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const chalk = require('chalk')
require('dotenv').config();
const isAuth = require('./middleware/is-Auth');

//Routes imports
const authRoutes = require('./routes/authRoutes');
//App
const app = express();


//Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(isAuth);

//Routes listeners
app.use('/auth', authRoutes);



//Errors handler
app.use((error, req, res, next) => {
    console.log(chalk.red(error));
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  });


//Mongoose DB connection and server 
mongoose.connect(process.env.DB, {useNewUrlParser:true, useUnifiedTopology:true}, (err,res) =>{
    if(err) {
        return console.log(chalk.red(`Error - ${err}`))
    }
    console.log(chalk.green('Database connection success'))

    app.listen(process.env.PORT || process.env.ALT_PORT, () => {
        console.log(chalk.blue(`Running on port: ${config.port}`))
    });
});

