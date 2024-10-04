const asyncHandler = require("express-async-handler")
const { checkEmpty } = require("../utils/checkEmpty")
const Technology = require("../model/Technology")
const Social = require("../model/Social")
const path = require('path')
const Carousel = require("../model/Carousel")
const { upload, projectUpload } = require("../utils/upload")
const cloudinary = require("../utils/cloudinary.config")
const Projects = require("../model/Projects")
exports.addTechnology = asyncHandler(async (req, res) => {
    const { name, category } = req.body
    const { isError, error } = checkEmpty({ name, category })
    if (isError) {
        return res.status(400).json({ message: "All Feild Required", error })
    }
    await Technology.create({ name, category })
    res.json({ message: "Technology Create Success" })
})
exports.getTechnology = asyncHandler(async (req, res) => {
    const result = await Technology.find()
    res.json({ message: "Technology Fetch Success", result })
})
exports.updateTechnology = asyncHandler(async (req, res) => {
    const { id } = req.params
    await Technology.findByIdAndUpdate(id, req.body)
    res.json({ message: "Technology Update Success" })
})
exports.deleteTechnology = asyncHandler(async (req, res) => {
    const { id } = req.params
    await Technology.findByIdAndDelete(id)
    res.json({ message: "Technology Delete Success" })
})

//social

exports.addSocial = asyncHandler(async (req, res) => {
    const { name, link } = req.body
    const { isError, error } = checkEmpty({ name, link })
    if (isError) {
        return res.status(400).json({ message: "All Feild Required", error })
    }
    await Social.create({ name, link })
    res.json({ message: "Social Create Success" })
})
exports.getSocial = asyncHandler(async (req, res) => {
    const result = await Social.find()
    res.json({ message: "Social Fetch Success", result })
})
exports.updateSocial = asyncHandler(async (req, res) => {
    const { id } = req.params
    await Social.findByIdAndUpdate(id, req.body)
    res.json({ message: "Social Update Success" })
})
exports.deleteSocial = asyncHandler(async (req, res) => {
    const { id } = req.params
    await Social.findByIdAndDelete(id)
    res.json({ message: "Social Delete Success" })
})


//carousel

exports.getAllCarousel = asyncHandler(async (req, res) => {
    const result = await Carousel.find()
    res.status(200).json({ message: "carousel fetch success", result })
})

exports.addCarousel = asyncHandler(async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                console.log(err)
                return res.status(400).json({ message: "upload Error", error: err })
            }

            if (!req.file) {
                return res.status(400).json({ message: "Hero Image Required" })
            }
            const { secure_url } = await cloudinary.uploader.upload(req.file.path)
            const result = await Carousel.create({ ...req.body, hero: secure_url })
            res.json({ message: "Carousel Add Success", result })
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
})

exports.updateCarousel = asyncHandler(async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: "Multer error" });
            }

            const { id } = req.params;

            if (req.file) {
                // Check if the carousel item exists
                const result = await Carousel.findById(id);
                if (!result) {
                    return res.status(404).json({ message: "Carousel item not found" });
                }

                // Delete old image from Cloudinary
                console.log(result);
                try {

                    await cloudinary.uploader.destroy(path.basename(result.hero));
                } catch (cloudinaryErr) {
                    return res.status(500).json({ message: "Error deleting image from Cloudinary" });
                }

                // Upload new image to Cloudinary
                let secure_url;
                try {
                    const uploadResult = await cloudinary.uploader.upload(req.file.path);
                    secure_url = uploadResult.secure_url;
                } catch (uploadErr) {
                    return res.status(500).json({ message: "Error uploading image to Cloudinary" });
                }

                // Update carousel item with new image URL
                await Carousel.findByIdAndUpdate(id, { caption: req.body.caption, hero: secure_url });
            } else {
                // Update carousel item without changing the image
                await Carousel.findByIdAndUpdate(id, { caption: req.body.caption });
            }

            res.json({ message: "Carousel update success" });
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
exports.deleteCarousel = asyncHandler(async (req, res) => {
    const { id } = req.params
    const result = await Carousel.findById(id)

    await cloudinary.uploader.destroy(path.basename(result.hero[0]))
    await Carousel.findByIdAndDelete(id)
    res.json({ message: "Carousel Deleted Success" })
})


exports.addProject = asyncHandler(async (req, res) => {
    projectUpload(req, res, async err => {
        if (err) {
            console.log(err)
            return res.status(400).json({ message: "Multer Error" })
        }
        if (
            !req.files.hero ||
            !req.files["screenshots-web-main"] ||
            !req.files["screenshots-web-other"] ||
            !req.files["screenshots-mobile-main"] ||
            !req.files["screenshots-mobile-other"] ||
            !req.files["sections-web-hero"] ||
            !req.files["sections-mobile-hero"]
        ) {
            return res.status(400).json({ message: "All Images Required" })
        }

        const images = {}
        for (const key in req.files) {
            if (key === "screenshots-web-other" || key === "screenshots-mobile-other") {

                if (!images[key]) {
                    images[key] = []
                }

                const uploadAllImagesPromises = []
                for (const item of req.files[key]) {
                    uploadAllImagesPromises.push(cloudinary.uploader.upload(item.path))
                }
                const allData = await Promise.all(uploadAllImagesPromises)
                images[key] = allData.map(item => item.secure_url)

                // images[key] = []
                // req.files[key].forEach(async item => {
                //     const { secure_url } = await cloudinary.uploader.upload(item.path)
                //     images[key] = [...images[key], secure_url]
                // })
            } else {
                const { secure_url } = await cloudinary.uploader.upload(req.files[key][0].path)
                images[key] = secure_url
            }
        }

        console.log(req.body)
        console.log(images)
        await Projects.create({
            title: req.body.title,
            shortDesc: req.body.shortDesc,
            desc: req.body.desc,
            duration: req.body.duration,
            learning: req.body.learning,
            live: req.body.live,
            source: req.body.source,
            isMobileApp: req.body.isMobileApp,
            hero: images["hero"],
            technologies: {
                frontend: req.body.frontend,
                backend: req.body.backend,
                mobile: req.body.mobile,
                collaboration: req.body.collaboration,
                hosting: req.body.hosting,
            },
            sections: {
                web: [
                    {
                        title: req.body["sections-web-title"],
                        desc: req.body["sections-web-desc"],
                        hero: images["sections-web-images"],
                    }
                ],
                mobile: [
                    {
                        title: req.body["sections-mobile-title"],
                        desc: req.body["sections-mobile-desc"],
                        hero: images["sections-mobile-images"],
                    }
                ],
            },
            screenshots: {
                web: {
                    main: images["screenshots-web-main"],
                    other: images["screenshots-web-other"],
                },
                mobile: {
                    main: images["screenshots-mobile-main"],
                    other: images["screenshots-mobile-other"],
                }
            },

        })


        res.json({ message: "Project create Success" })
    })
})

exports.getProject = asyncHandler(async (req, res) => {
    const result = await Projects.find()
    res.json({ message: "Project fetch Success", result })
})
exports.deleteProject = asyncHandler(async (req, res) => {
    const { id } = req.params
    const result = await Projects.findById(id)
    const allImages = []
    allImages.push(cloudinary.uploader.destroy(path.basename(result.hero)))

    for (const item of result.sections.web) {
        if (item.hero) {
            allImages.push(cloudinary.uploader.destroy(path.basename(item.hero)))
        }
    }
    for (const item of result.sections.mobile) {
        if (item.hero) {
            allImages.push(cloudinary.uploader.destroy(path.basename(item.hero)))
        }
    }

    if (result.screenshots.web.hero) {

        allImages.push(cloudinary.uploader.destroy(path.basename(result.screenshots.web.hero)))
    }
    if (result.screenshots.mobile.hero) {

        allImages.push(cloudinary.uploader.destroy(path.basename(result.screenshots.mobile.hero)))
    }

    for (const item of result.screenshots.web.other) {
        allImages.push(cloudinary.uploader.destroy(path.basename(item)))
    }
    for (const item of result.screenshots.mobile.other) {
        allImages.push(cloudinary.uploader.destroy(path.basename(item)))
    }

    await Promise.all(allImages)
    await Projects.findByIdAndDelete(id)
    res.json({ message: "Projects Deleted Success" })
})

