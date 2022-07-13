"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const contactSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 200,
    },
    phone: { type: String, required: true, minlength: 9, maxlength: 21 },
    status: { type: Number, required: true, default: 1 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
const Contact = mongoose_1.default.model("Contact", contactSchema);
exports.Contact = Contact;
