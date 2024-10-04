const router = require("express").Router()
const { rateLimit } = require("express-rate-limit")
const public = require('./../controller/public.controller')

router
    .get("/get-carousel", public.getCarousel)
    .get("/get-project", public.getProject)
    .get("/get-project-details/:id", public.getProjectDetails)
    //                                    // 15 m 2 email send hoil fkt ashi limit lavta yety 
    .post("/add-enquiry", rateLimit({ windowMs: 15 * 60 * 1000, limit: 1 }), public.addEnquiry)
    .get("/enquiry", public.getEnquiry)
    .put("/update-enquiry/:id", public.updateEnquiry)
    .delete("/delete-enquiry/:id", public.deleteEnquiry)

module.exports = router 