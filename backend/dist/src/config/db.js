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
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const dbUrl = process.env.MONGOURL || "";
    const mongooseConnectOptionObj = {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    };
    try {
        yield mongoose_1.default.connect(dbUrl, mongooseConnectOptionObj);
        console.info('MongoDB database connected');
    }
    catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
        }
        else {
            console.error('Unknown Error');
            console.error(e);
        }
    }
});
exports.default = connectDB;
