"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactsRouter = void 0;
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const auth_1 = require("../middleware/auth");
const contact_1 = require("../models/contact");
const router = express_1.default.Router();
exports.contactsRouter = router;
router.post('/', auth_1.auth, async (req, res, next) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(3).max(200),
        email: joi_1.default.string().min(3),
        phone: joi_1.default.string().min(9).max(21).required()
    });
    const { error } = schema.validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    let contact = new contact_1.Contact(Object.assign({}, req.body));
    contact = await contact.save();
    res.status(200).send({
        data: contact,
        message: "Contacto adicionado com sucesso!"
    });
});
router.get("/", auth_1.auth, async (req, res, next) => {
    try {
        const contacts = await contact_1.Contact.find();
        res.send({ data: contacts, auth: auth_1.auth });
    }
    catch (error) {
        res.status(500).send("Error: " + error.message);
    }
});
router.get("/:id", auth_1.auth, async (req, res, next) => {
    const contact = await contact_1.Contact.findById(req.params.id);
    if (!contact)
        return res.status(404).send("Contacto não encontrado.");
    return res.send({ data: contact });
});
router.put("/:id", auth_1.auth, async (req, res, next) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(3).max(30).required(),
        email: joi_1.default.string().min(3).max(200).required().email(),
        phone: joi_1.default.string().min(9).max(21).required()
    });
    const { error } = schema.validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const contact = await contact_1.Contact.findById(req.params.id);
    if (!contact)
        return res.status(404).send("Contacto não encontrado.");
    const contactUpdated = await contact_1.Contact.findByIdAndUpdate(req.params.id, Object.assign({}, req.body), { new: true });
    return res.send({
        data: contactUpdated,
        message: "Contacto actualizado com sucesso!"
    });
});
router.patch("/:id/enable", auth_1.auth, async (req, res, next) => {
    const contact = await contact_1.Contact.findById(req.params.id);
    if (!contact)
        return res.status(404).send("Contacto não encontrado.");
    const contactUpdated = await contact_1.Contact.findByIdAndUpdate(req.params.id, { status: 1 }, { new: true });
    return res.send({
        data: contactUpdated,
        message: "Contacto desbloqueado com successo!"
    });
});
router.patch("/:id/desable", auth_1.auth, async (req, res, next) => {
    const contact = await contact_1.Contact.findById(req.params.id);
    if (!contact)
        return res.status(404).send("Contacto não encontrado.");
    const contactUpdated = await contact_1.Contact.findByIdAndUpdate(req.params.id, { status: 0 }, { new: true });
    return res.send({
        data: contactUpdated,
        message: "Contacto bloqueado com successo!"
    });
});
router.delete("/:id", auth_1.auth, async (req, res, next) => {
    const contact = await contact_1.Contact.findById(req.params.id);
    if (!contact)
        return res.status(404).send("Contacto não encontrado.");
    const contactDeleted = await contact_1.Contact.findByIdAndDelete(req.params.id);
    res.send({
        data: contactDeleted,
        message: "Contacto excluído com sucesso."
    });
});
