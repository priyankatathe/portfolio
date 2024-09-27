const router = require("express").Router()
const public = require('./../controller/public.controller')

router
    .get("/get-carousel", public.getCarousel)
    .get("/get-project", public.getProject)
    .get("/get-project-details/:id", public.getProjectDetails)

module.exports = router