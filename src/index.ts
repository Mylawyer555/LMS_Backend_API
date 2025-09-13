// import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import userRouter from './routes/user.routes';
import authRouter from './routes/auth.route';
import courseRouter from './routes/courses.route';
import enrollmentRouter from './routes/enrollment.routes';

// configure dotenv
dotenv.config();

const express = require('express');

const portEnv = process.env.PORT;

// check if port exist 
if(!portEnv){
    console.log('Error: port does not exist in .env file');
    process.exit(1);
};

//convert port to number
const PORT = parseInt(portEnv, 10);

// check if port is a number
if(isNaN(PORT)){
    console.log('Error: Port is not a number');
    process.exit(1);
};

// configure cors
const corsOptions = {
    origin: '*',
    Credential: 'true',
    allowedHeaders: '*',
    methods: 'GET, PUT, PATCH, HEAD, PATCH, POST'
};

// Instantiate express
const app = express();

app.use(cors(corsOptions));

//to read anything convert to json
app.use(express.json());

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/courses', courseRouter )
app.use('/api/v1/enrollments', enrollmentRouter )

// listen to our port
app.listen(PORT, ()=> {
    console.log( `Congratulations Server is running on port ${PORT}`);
});

