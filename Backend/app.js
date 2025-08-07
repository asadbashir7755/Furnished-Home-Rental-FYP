const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const reservationRoutes = require('./routes/reservationRoutes');
const checkoutRoutes = require('./routes/reservations');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/yourdbname', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((error) => console.error('MongoDB connection error:', error));

// Log every reservation endpoint hit
app.use('/api/reservations', (req, res, next) => {
    console.log(`[Reservation API] ${req.method} ${req.originalUrl}`);
    next();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});