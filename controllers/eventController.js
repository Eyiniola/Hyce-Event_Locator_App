const { Event, Category, User } = require('../models');
const { sequelize } = require('../sequelize');
const { Op } = require('sequelize');  // Import Op for comparison operators




// Creating a new event
exports.createEvent = async (req, res) => {
    try {
        const { title, description, eventDateTime, location, categoryId } = req.body;  // Corrected properties

        // Check if the event already exists
        const existingEvent = await Event.findOne({ where: { title } });  // Changed 'name' to 'title'
        if (existingEvent) {
            return res.status(400).json({ message: 'Event already exists' });
        }

        // Create the event
        const event = await Event.create({ title, description, eventDateTime, location, categoryId });

        // Respond with the created event
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create event', error });
    }
};


// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.findAll({ include: [{ model: Category, as: 'categories' }]});
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch events', error });
    }
};

// Get event by ID
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id, { include: Category });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch event', error });
    }
};

// Get events by category
exports.getEventsByCategory = async (req, res) => {
    try {
        // Get the categoryId from query parameters
        const { categoryId } = req.query;

        // If categoryId is provided, filter by category
        if (categoryId) {
            const events = await Event.findAll({
                where: { categoryId }
            });
            return res.status(200).json(events);
        }

        // If no categoryId, fetch all events
        const events = await Event.findAll();
        res.status(200).json(events);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to retrieve events', error });
    }
};

//Get events by location
exports.searchEventsByLocation = async (req, res) => {
    try {
        const { latitude, longitude, radius } = req.query;

        // Check if all query parameters are provided
        if (!latitude || !longitude || !radius) {
            return res.status(400).send({ success: false, message: 'Missing required parameters (latitude, longitude, radius)' });
        }

        // Ensure that latitude, longitude, and radius are valid numbers
        if (isNaN(latitude) || isNaN(longitude) || isNaN(radius)) {
            return res.status(400).send({ success: false, message: 'Latitude, longitude, and radius must be valid numbers.' });
        }

        // Convert radius from km to meters
        const radiusInMeters = radius * 1000;

        // Find events within the radius
        const events = await Event.findAll({
            attributes: [
                'eventId', 'title',
                [
                    sequelize.fn(
                        'ST_Distance_Sphere',
                        sequelize.col('location'),
                        sequelize.fn('ST_GeomFromText', `POINT(${longitude} ${latitude})`, 0)
                    ),
                    'distance_km'
                ]
            ],
            where: sequelize.where(
                sequelize.fn(
                    'ST_Distance_Sphere',
                    sequelize.col('location'),
                    sequelize.fn('ST_GeomFromText', `POINT(${longitude} ${latitude})`, 0)
                ),
                { [Op.lte]: radiusInMeters }  // Filter events by distance (in meters)
            )
        });

        // Return events found within the radius
        res.status(200).send({ success: true, data: events });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error searching events by location', error: error.message });
    }
};


// Update an event
exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        await event.update(req.body);
        res.json({ message: 'Event updated successfully', event });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update event', error });
    }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        await event.destroy();
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete event', error });
    }
};