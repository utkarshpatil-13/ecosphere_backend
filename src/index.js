import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './db/index.js'
import { userRouter } from './routes/user.routes.js'
import { initiativesRouter } from './routes/initiative.routes.js'
import { challengesRouter } from './routes/challenge.routes.js'
import { actionsRouter } from './routes/action.routes.js'
import { interestRouter } from './routes/interest.routes.js'

const app = express()

// configuring env path
dotenv.config({
    path: './.env'
})

// middlewares
app.use(cors({
    origin: process.env.CROSS_ORIGIN
}));
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended: true, limit: "10mb"}));
app.use(express.static('public'));


// routes
app.use('/api', userRouter);
app.use('/api', initiativesRouter);
app.use('/api', challengesRouter);
app.use('/api', actionsRouter);
app.use('/api', interestRouter);

// connect DB
connectDB()
.then((response) => {
    app.listen(process.env.PORT, () => {
        console.log("Server is listening at port", process.env.PORT);
    })

    app.on('error', () => {
        console.log("Error while connecting to the server ", error);
    })
})
.catch((error) => {
    console.log('MongoDB connection failed!', error);
})
