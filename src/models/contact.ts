import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
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

const Contact = mongoose.model("Contact", contactSchema);

export { Contact };

