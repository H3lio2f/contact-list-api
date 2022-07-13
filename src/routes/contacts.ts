import express from "express";
import Joi from 'joi';
import { auth } from "../middleware/auth";
import { Contact } from "../models/contact";

const router = express.Router();

router.post('/', auth, async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(200),
    email: Joi.string().min(3),
    phone: Joi.string().min(9).max(21).required()
  });

  const { error } = schema.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let contact = new Contact({ ...req.body });

  contact = await contact.save();
  res.status(200).send({
    data: contact,
    message: "Contacto adicionado com sucesso!"
  });

});

router.get("/", auth, async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.send({data: contacts, auth});
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

router.get("/:id", auth, async (req, res, next) => {

    const contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).send("Contacto não encontrado.");

    return res.send({data: contact});

});

router.put("/:id", auth, async (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().min(3).max(200).required().email(),
        phone: Joi.string().min(9).max(21).required()
      });
    
    const { error } = schema.validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).send("Contacto não encontrado.");

    const contactUpdated = await Contact.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });

    return res.send({
        data: contactUpdated, 
        message: "Contacto actualizado com sucesso!"
    });
  
});

router.patch("/:id/enable", auth, async (req, res, next) => {

    const contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).send("Contacto não encontrado.");

    const contactUpdated = await Contact.findByIdAndUpdate(req.params.id, { status: 1 }, { new: true });

    return res.send({
        data: contactUpdated, 
        message: "Contacto desbloqueado com successo!"
    });
  
});

router.patch("/:id/desable", auth, async (req, res, next) => {
   
    const contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).send("Contacto não encontrado.");

    const contactUpdated = await Contact.findByIdAndUpdate(req.params.id, { status: 0 }, { new: true });

    return res.send({
        data: contactUpdated, 
        message: "Contacto bloqueado com successo!"
    });
  
});

router.delete("/:id", auth, async (req, res, next) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).send("Contacto não encontrado.");

    const contactDeleted = await Contact.findByIdAndDelete(req.params.id);

    res.send({
        data: contactDeleted, 
        message: "Contacto excluído com sucesso." 
    });
});

export { router as contactsRouter };

