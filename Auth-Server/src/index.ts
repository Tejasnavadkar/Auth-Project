import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import { Request, Response } from 'express';
import routes from './Routes/index'
import db from './Db/db';
import cookieParser from 'cookie-parser';
import { handleError } from './Middlewares/Error.Middleware';


const app = express()
const port = 3000



// interface CustomRequest extends Request {}
// interface CustomResponse extends Response {}
// app.get('/', (req: Request, res: Response) => {
//     res.json({ msg: 'hii there' });
// });


db.ConnectDb()
app.use(express.json()) // for body parser
app.use(cookieParser())
app.use('/api/auth',routes.authRoutes)


app.use(handleError)  // always place it at end
app.listen(port,()=>console.log(`server started at ${port}`))