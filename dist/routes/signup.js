"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupRouter = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const router = express_1.default.Router();
exports.signupRouter = router;
router.post("/", async (req, res) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(3).max(30).required(),
        email: joi_1.default.string().min(3).max(200).required().email(),
        password: joi_1.default.string().min(6).max(200).required(),
        role: joi_1.default.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    let user = await user_1.User.findOne({ email: req.body.email });
    if (user)
        return res.status(400).send("User already exists...");
    const { name, email, password, role } = req.body;
    user = new user_1.User({ name, email, password, role });
    const salt = await bcrypt_1.default.genSalt(10);
    user.password = await bcrypt_1.default.hash(user.password, salt);
    await user.save();
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = jsonwebtoken_1.default.sign({ _id: user._id, name: user.name, email: user.email, role: user.role }, jwtSecretKey);
    res.send({
        access_token: token,
    });
});
