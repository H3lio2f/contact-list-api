"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const mongoose_1 = __importDefault(require("mongoose"));
const signin_1 = require("./routes/signin");
const signup_1 = require("./routes/signup");
const users_1 = require("./routes/users");
const contacts_1 = require("./routes/contacts");
const swagger_json_1 = __importDefault(require("./swagger.json"));
process.on("unhandledRejection", (error) => {
    throw error;
});
const port = process.env.PORT || 8002;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use("/documentation", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
app.use("/api/signin", signin_1.signinRouter);
app.use("/api/signup", signup_1.signupRouter);
app.use("/api/users", users_1.usersRouter);
app.use("/api/contacts", contacts_1.contactsRouter);
app.get("/", (req, res) => {
    res.send("Bem-vindo a API de Contactos...");
});
app.listen(port, () => {
    console.log(`Server running on port: ${port}...`);
});
mongoose_1.default
    .connect(process.env.MONGO_DB_URL)
    .then(() => console.log("MongoDB connection established..."))
    .catch((error) => console.error("MongoDB connection failed:", error.message));
