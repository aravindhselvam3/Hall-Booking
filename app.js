const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// In-memory storage for rooms and bookings
const rooms = [];
const count=0;
const bookings = [];

// 1. Create a Room
app.post('/rooms', (req, res) => {
  const { roomName, seatsAvailable, amenities, pricePerHour } = req.body;
  count+=1
  const room = {
    roomName,
    seatsAvailable,
    amenities,
    pricePerHour,
    roomId: count , // Assign a unique ID (in practice, use a database-generated ID)
  };
  rooms.push(room);
  res.status(201).json(room);
});

// 2. Booking a Room
app.post('/bookings', (req, res) => {
  const { customerName, date, startTime, endTime, roomId } = req.body;
  const booking = {
    customerName,
    date,
    startTime,
    endTime,
    roomId,
    bookingId: bookings.length + 1, // Assign a unique ID (in practice, use a database-generated ID)
  };
  bookings.push(booking);
  res.status(201).json(booking);
});

// 3. List all Rooms with Booked Data
app.get('/rooms/bookings', (req, res) => {
  const roomsWithBookings = rooms.map((room) => {
    const roomBookings = bookings.filter((booking) => booking.roomId === room.roomId);
    return {
      ...room,
      bookings: roomBookings,
    };
  });
  res.status(200).json(roomsWithBookings);
});

// 4. List all Customers with Booked Data
app.get('/customers/bookings', (req, res) => {
  const customersWithBookings = [];
  rooms.forEach((room) => {
    const roomBookings = bookings.filter((booking) => booking.roomId === room.roomId);
    roomBookings.forEach((booking) => {
      customersWithBookings.push({
        customerName: booking.customerName,
        roomName: room.roomName,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
      });
    });
  });
  res.status(200).json(customersWithBookings);
});

// 5. List how many times a customer has booked a room
app.get('/customers/bookings/count', (req, res) => {
  const customerCounts = {};
  bookings.forEach((booking) => {
    const { customerName } = booking;
    if (customerCounts[customerName]) {
      customerCounts[customerName]++;
    } else {
      customerCounts[customerName] = 1;
    }
  });
  res.status(200).json(customerCounts);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

