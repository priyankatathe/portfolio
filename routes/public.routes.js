const router = require("express").Router()
const public = require('./../controller/public.controller')

router
    .get("/get-carousel", public.getCarousel)
    .get("/get-project", public.getProject)
    .get("/get-project-details/:id", public.getProjectDetails)

    .post("/add-enquiry", public.addEnquiry)
    .get("/enquiry", public.getEnquiry)
    .put("/update-enquiry/:id", public.updateEnquiry)
    .delete("/delete-enquiry/:id", public.deleteEnquiry)

module.exports = router