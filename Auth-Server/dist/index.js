"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./Routes/index"));
const db_1 = __importDefault(require("./Db/db"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const Error_Middleware_1 = require("./Middlewares/Error.Middleware");
const LoginRateLimiter_1 = __importDefault(require("./Middlewares/LoginRateLimiter"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
// interface CustomRequest extends Request {}
// interface CustomResponse extends Response {}
// app.get('/', (req: Request, res: Response) => {
//     res.json({ msg: 'hii there' });
// });
app.use(LoginRateLimiter_1.default); // rate limiting middleware
db_1.default.ConnectDb();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)()); //to secure it against common web vulnerabilities such as Cross-Site Scripting (XSS), Clickjacking, and Cross-Site Request Forgery (CSRF).
app.use(express_1.default.json()); // for body parser
app.use((0, cookie_parser_1.default)());
app.use('/api/auth', index_1.default.authRoutes);
app.use(Error_Middleware_1.handleError); // always place error handler middleware at end
app.listen(port, () => console.log(`server started at ${port}`));
