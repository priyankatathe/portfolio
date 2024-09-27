const mongoose = require("mongoose")

const carouselSchema = new mongoose.Schema({
    hero: { type: [String], required: true },
    caption: { type: String, required: true },
}, { timestamps: true })

module.exports = mongoose.model("carousel", carouselSchema)