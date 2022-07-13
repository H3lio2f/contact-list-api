import bcrypt from "bcrypt";
import "dotenv/config";
import express from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

const router = express.Router();

router.post("/", async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().min(3).max(200).required().email(),
    password: Joi.string().min(6).max(200).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Senha ou Email incorrecto...");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Senha ou Email incorrecto...");

  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  const token = jwt.sign(
    { _id: user._id, name: user.name, email: user.email, role: user.role },
    jwtSecretKey
  );

  res.send({
    access_token: token,
  });
});

export { router as signinRouter };
