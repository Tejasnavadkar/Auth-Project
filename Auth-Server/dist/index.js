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
const app = (0, express_1.default)();
const port = 3000;
// interface CustomRequest extends Request {}
// interface CustomResponse extends Response {}
// app.get('/', (req: Request, res: Response) => {
//     res.json({ msg: 'hii there' });
// });
db_1.default.ConnectDb();
app.use(express_1.default.json()); // for body parser
app.use((0, cookie_parser_1.default)());
app.use('/api/auth', index_1.default.authRoutes);
app.use(Error_Middleware_1.handleError); // always place it at end
app.listen(port, () => console.log(`server started at ${port}`));
