"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const auth_1 = require("../middleware/auth");
const user_1 = require("../models/user");
const router = express_1.default.Router();
exports.usersRouter = router;
router.get("/", auth_1.auth, async (req, res, next) => {
    try {
        const users = await user_1.User.find();
        res.send({ data: users, auth: auth_1.auth });
    }
    catch (error) {
        res.status(500).send("Error: " + error.message);
    }
});
router.get("/:id", auth_1.auth, async (req, res, next) => {
    try {
        const user = await user_1.User.findById(req.params.id);
        if (!user)
            return res.status(404).send("Usuário não encontrado.");
        return res.send({ data: user });
    }
    catch (error) {
        res.status(500).send("Error: " + error.message);
    }
});
router.put("/:id", auth_1.auth, async (req, res, next) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(3).max(30).required(),
        email: joi_1.default.string().min(3).max(200).required().email(),
        password: joi_1.default.string().min(6).max(200).required(),
        role: joi_1.default.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const user = await user_1.User.findById(req.params.id);
    if (!user)
        return res.status(404).send("Usuário não encontrado.");
    const salt = await bcrypt_1.default.genSalt(10);
    const passwordHashed = await bcrypt_1.default.hash(req.body.password, salt);
    const userUpdated = await user_1.User.findByIdAndUpdate(req.params.id, Object.assign(Object.assign({}, req.body), { password: passwordHashed }), { new: true });
    return res.send({
        data: userUpdated,
        message: "Informações actualizadas com sucesso!"
    });
});
router.patch("/:id/active", auth_1.auth, async (req, res, next) => {
    const user = await user_1.User.findById(req.params.id);
    if (!user)
        return res.status(404).send("Usuário não encontrado.");
    const userUpdated = await user_1.User.findByIdAndUpdate(req.params.id, { status: 1 }, { new: true });
    return res.send({
        data: userUpdated,
        message: "Usuário tornado activo!"
    });
});
router.patch("/:id/desactive", auth_1.auth, async (req, res, next) => {
    const user = await user_1.User.findById(req.params.id);
    if (!user)
        return res.status(404).send("Usuário não encontrado.");
    const userUpdated = await user_1.User.findByIdAndUpdate(req.params.id, { status: 0 }, { new: true });
    return res.send({
        data: userUpdated,
        message: "Usuário tornado inactivo!"
    });
});
router.delete("/:id", auth_1.auth, async (req, res, next) => {
    const user = await user_1.User.findById(req.params.id);
    if (!user)
        return res.status(404).send("Usuário não encontrado.");
    const userDeleted = await user_1.User.findByIdAndDelete(req.params.id);
    res.send({
        data: userDeleted,
        message: "Usuário excluído com sucesso."
    });
});
