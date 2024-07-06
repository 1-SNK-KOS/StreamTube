import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true,
    optionsSuccessStatus : 200
}));

// limit of how much u accept data by form or file
app.use(express.json({
    limit : "16kb"
}));


// limit on data by url
app.use(express.urlencoded({
    extended : true,
    limit : "16kb"
}));

// to store public assests
app.use(express.static("public"));

// for doing crud on cookies the configuration is
app.use(cookieParser());



// import routes
import userRouter from './routes/user.routes.js'

// route declaration
app.use("/api/v1/users",userRouter);

//  https://localhost:8080/api/v1/users/register

export { app };