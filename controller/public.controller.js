//getCarousel
//getProject

const asyncHandler = require("express-async-handler")
const Carousel = require("../model/Carousel")
const Projects = require("../model/Projects")

exports.getCarousel = asyncHandler(async (req, res) => {
    const result = await Carousel.find()
    res.status(200).json({ message: "carousel fetch success", result })
})

exports.getProject = asyncHandler(async (req, res) => {
    const result = await Projects.find()
    res.json({ message: "Project fetch Success", result })
})
exports.getProjectDetails = asyncHandler(async (req, res) => {
    const result = await Projects.findById(req.params.id)
    res.json({ message: "Project fetch Detail Success", result })
})