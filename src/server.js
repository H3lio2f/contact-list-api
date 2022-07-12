import cors from "cors";
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { signinRouter } from "./routes/signin.js";
import { signupRouter } from "./routes/signup.js";
import { usersRouter } from "./routes/users.js";
import { contactsRouter } from "./routes/contacts.js";

process.on("unhandledRejection", (error) => {
  throw error;
});

const port = process.env.PORT || 8002;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/signin", signinRouter);
app.use("/api/signup", signupRouter);
app.use("/api/users", usersRouter);
app.use("/api/contacts", contactsRouter);

app.get("/", (req, res) => {
  res.send("Bem-vindo a API de Contactos...");
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}...`);
});

mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established..."))
  .catch((error) => console.error("MongoDB connection failed:", error.message));
