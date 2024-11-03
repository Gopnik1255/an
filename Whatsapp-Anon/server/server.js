const express = require('express');

const mongoose = require('mongoose');

const dotenv = require('dotenv');

const http = require('http');

const socketIo = require('socket.io');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const cors = require('cors');


dotenv.config();

const app = express();

const server = http.createServer(app);

const io = socketIo(server);

const User = require('./models/User');

const Group = require('./models/Group');


app.use(cors());

app.use(express.json());

app.use(express.static('../client'));


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

    .then(() => console.log('MongoDB connected'))

    .catch(err => console.log(err));


// User Registration

app.post('/register', async (req, res) => {

    const { name, password, profilePic } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, password: hashedPassword, profilePic });

    await user.save();

    res.status(201).send('User  registered');

});


// User Login

app.post('/login', async (req, res) => {

    const { name, password } = req.body;

    const user = await User.findOne({ name });

    if (user && await bcrypt.compare(password, user.password)) {

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ token });

    } else {

        res.status(401).send('Invalid credentials');

    }

});


// Create Group

app.post('/groups', async (req, res) => {

    const { name, userId } = req.body;

    const group = new Group({ name, members: [userId] });

    await group.save();

    res.status(201).send('Group created');

});


// Socket.io for real-time messaging

io.on('connection', (socket) => {

    console.log('New client connected');


    socket.on('joinGroup', (groupId) => {

        socket.join(groupId);

    });


        socket.on('sendMessage', async ({ groupId, message }) => {

const group = await Group.findById(groupId); group.messages.push({ sender: socket.id, text: message, timestamp: new Date() }); await group.save(); io.to(groupId).emit('newMessage', message); });

   socket.on('disconnect', () => {

       console.log('Client disconnected');

   });

});

server.listen(process.env.PORT, () => console.log(Server started on port ${process.env.PORT}));