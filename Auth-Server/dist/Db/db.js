"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ConnectDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const connectionString = process.env.DB_URL || "your_default_connection_string";
    // console.log('connectString',connectionString)
    // console.log('process.env.DB_URL',process.env.DB_URL)
    try {
        yield mongoose_1.default.connect(connectionString).then(() => {
            console.log('Db connection Successfull');
        }).catch((err) => {
            console.log('Db Connection Error--', err);
        });
    }
    catch (error) {
        console.log("Connection error = ", error);
        throw Error(error);
    }
});
exports.default = { ConnectDb };
