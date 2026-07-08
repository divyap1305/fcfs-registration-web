const router = require("express").Router();
const ctrl = require("../controllers/eventsController");

// EVENTS
router.get("/", ctrl.getAllEvents);
router.get("/:id", ctrl.getSingleEvent);
router.post("/", ctrl.createEvent);
router.put("/:id", ctrl.editEvent);
router.delete("/:id", ctrl.deleteEvent);

// REGISTRATIONS
router.post("/:id/register", ctrl.registerToEvent);
router.get("/:id/registrations", ctrl.getRegistrations);

// CSV EXPORT
router.get("/:id/export", ctrl.exportCSV);

module.exports = router;
