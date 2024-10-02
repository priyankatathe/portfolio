const mongoose = require("mongoose")

const enquirySchema = new mongoose.Schema({
    name: { type: String },
    company: { type: String },
    email: { type: String },
    message: { type: String },
    mobile: { type: String },
}, { timestamps: true })

module.exports = mongoose.model("enquiry", enquirySchema)