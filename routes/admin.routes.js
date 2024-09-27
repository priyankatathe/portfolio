const router = require("express").Router()
const admin = require('./../controller/admin.controller')

router
    .post("/add-tech", admin.addTechnology)
    .get("/tech", admin.getTechnology)
    .put("/update-tech/:id", admin.updateTechnology)
    .delete("/delete-tech/:id", admin.deleteTechnology)

    .post("/add-social", admin.addSocial)
    .get("/social", admin.getSocial)
    .put("/update-social/:id", admin.updateSocial)
    .delete("/delete-social/:id", admin.deleteSocial)

    .post("/add-Carousel", admin.addCarousel)
    .get("/Carousel", admin.getAllCarousel)
    .put("/update-Carousel/:id", admin.updateCarousel)
    .delete("/delete-Carousel/:id", admin.deleteCarousel)

    .post("/add-project", admin.addProject)
    .get("/get-project", admin.getProject)
    .delete("/delete-project/:id", admin.deleteProject)

module.exports = router