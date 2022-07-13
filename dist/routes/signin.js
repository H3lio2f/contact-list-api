"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signinRouter = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const router = express_1.default.Router();
exports.signinRouter = router;
router.post("/", async (req, res) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().min(3).max(200).required().email(),
        password: joi_1.default.string().min(6).max(200).required(),
    });
    const { error } = schema.validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    let user = await user_1.User.findOne({ email: req.body.email });
    if (!user)
        return res.status(400).send("Senha ou Email incorrecto...");
    const validPassword = await bcrypt_1.default.compare(req.body.password, user.password);
    if (!validPassword)
        return res.status(400).send("Senha ou Email incorrecto...");
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = jsonwebtoken_1.default.sign({ _id: user._id, name: user.name, email: user.email, role: user.role }, jwtSecretKey);
    res.send({
        access_token: token,
    });
});
