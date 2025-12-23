const express = require('express');
const router = express.Router();
const { createEvent, getEventStatus, registerToEvent } = require('../controllers/eventsController');

router.post('/events', createEvent);
router.get('/events/:id/status', getEventStatus);
router.post('/events/:id/register', registerToEvent);

module.exports = router;
