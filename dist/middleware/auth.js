"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function auth(req, res, next) {
    const token = req.header("x-auth-token");
    if (!token)
        return res
            .status(401)
            .send({ message: "Acesso Negado! Usuário não autorizado." });
    try {
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecretKey);
        req.user = decoded;
        next();
    }
    catch (exception) {
        res.status(400).send("token inválido...");
    }
}
exports.auth = auth;
