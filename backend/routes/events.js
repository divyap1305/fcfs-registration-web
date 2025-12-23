const express = require("express");
const router = express.Router();
const controller = require("../controllers/eventsController");

router.post("/events", controller.createEvent);
router.put("/events/:id", controller.editEvent);
router.delete("/events/:id", controller.deleteEvent);

router.get("/events", controller.getAllEvents);
router.post("/events/:id/register", controller.registerToEvent);

router.get("/events/:id/registrations", controller.getRegistrations);
router.get("/events/:id/export", controller.exportCSV);

module.exports = router;
