import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import routes from './Routes/index'
import db from './Db/db';
import cookieParser from 'cookie-parser';
import { handleError } from './Middlewares/Error.Middleware';
import loginLimiter from './Middlewares/LoginRateLimiter';
import helmet from 'helmet';


const app = express()
const port = 3000

// interface CustomRequest extends Request {}
// interface CustomResponse extends Response {}
// app.get('/', (req: Request, res: Response) => {
//     res.json({ msg: 'hii there' });
// });

app.use(loginLimiter) // rate limiting middleware
db.ConnectDb()
app.use(helmet()) //to secure it against common web vulnerabilities such as Cross-Site Scripting (XSS), Clickjacking, and Cross-Site Request Forgery (CSRF).
app.use(express.json()) // for body parser
app.use(cookieParser())
app.use('/api/auth',routes.authRoutes)
app.use(handleError)  // always place error handler middleware at end
app.listen(port,()=>console.log(`server started at ${port}`))