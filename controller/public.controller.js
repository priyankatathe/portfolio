//getCarousel
//getProject

const asyncHandler = require("express-async-handler")
const Validator = require("validator")
const Projects = require("../model/Projects")
const { checkEmpty } = require("../utils/checkEmpty")
const Enquiry = require("../model/Enquiry")
const Carousel = require("../model/Carousel")
const sendEmail = require("../utils/email")


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

// enquiry

exports.addEnquiry = asyncHandler(async (req, res) => {
    const { name, email, mobile, message, company } = req.body
    const { isError, error } = checkEmpty({ name, email, mobile, message, company })
    if (isError) {
        return res.status(400).json({ message: "All Fields Required", error })
    }
    if (!Validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email" })
    }
    if (!Validator.isMobilePhone(mobile, "en-IN")) {
        return res.status(400).json({ message: "Invalid Mobile" })
    }
    sendEmail({
        to: "priyankatathe4@gmail.com",
        message: `company ${company}, email ${email}, mobile ${mobile} message ${message}`,
        subject: `New Enquiry from ${company}`
    })
    sendEmail({
        to: email,
        message: `Thank you for enquiry. I will get in touch with you soon.`,
        subject: `Thank you for your intrest.`
    })
    await Enquiry.create({ name, email, mobile, message, company })
    res.json({ message: "Enquery Message Added Success...!", })
})
exports.getEnquiry = asyncHandler(async (req, res) => {
    const result = await Enquiry.find()
    res.json({ message: "Enquiry Fetch Success", result })
})
exports.updateEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params
    await Enquiry.findByIdAndUpdate(id, req.body)
    res.json({ message: "Enquiry Update Success" })
})
exports.deleteEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params
    await Enquiry.findByIdAndDelete(id)
    res.json({ message: "Enquiry Delete Success" })
})

