import express from "express";
import Joi from 'joi';
import { auth } from "../middleware/auth.js";
import { User } from "../models/user.js";

const router = express.Router();

router.get("/", auth, async (req, res, next) => {
  try {
    const users = await User.find();
    res.send({data: users, auth});
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

router.get("/:id", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).send("Usuário não encontrado.");

    return res.send({data: user});
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

router.put("/:id", auth, async (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().min(3).max(200).required().email(),
        password: Joi.string().min(6).max(200).required(),
        role: Joi.string().required(),
      });
    
    const { error } = schema.validate(req.body);

    if (error) return res.status(400).send(result.error.details[0].message);

    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).send("Usuário não encontrado.");

    const userUpdated = await User.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });

    return res.send({
        data: userUpdated, 
        message: "Informações actualizadas com sucesso!"
    });
  
});

router.patch("/:id/active", auth, async (req, res, next) => {
   
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).send("Usuário não encontrado.");

    const userUpdated = await User.findByIdAndUpdate(req.params.id, { status: 1 }, { new: true });

    return res.send({
        data: userUpdated, 
        message: "Usuário tornado active!"
    });
  
});

router.patch("/:id/desactive", auth, async (req, res, next) => {
   
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).send("Usuário não encontrado.");

    const userUpdated = await User.findByIdAndUpdate(req.params.id, { status: 0 }, { new: true });

    return res.send({
        data: userUpdated, 
        message: "Usuário tornado inactive!"
    });
  
});

router.delete("/:id", auth, async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).send("Usuário não encontrado.");

    const userDeleted = await User.findByIdAndDelete(req.params.id);

    res.send({
        data: userDeleted, 
        message: "Usuário excluído com sucesso." 
    });
});

export { router as usersRouter };

