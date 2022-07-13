"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 200,
        unique: true,
    },
    password: { type: String, required: true, minlength: 3, maxlength: 1024 },
    role: { type: String, required: true },
    status: { type: Number, required: true, default: 1 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
const User = mongoose_1.default.model("User", userSchema);
exports.User = User;
