const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 9000;

var connectedUsers = [];

require('dotenv/config');

io.on('connection', (socket) => {
    connectedUsers.push({
        socketId: socket.id,
        onlineId: socket.handshake.query.onlineId,
    });
    if (connectedUsers.length % 2 === 0) {
        var randomizedState = [
            [0, 1],
            [1, 1],
            [0, 2],
            [0, 0],
            [2, 1],
            [1, 2],
            [1, 0],
            [2, 2],
            [2, 0],
        ]; // Is randomized in single player version but I wanted to focus more on back/frontend and not the puzzle here
        io.to(connectedUsers[connectedUsers.length - 2].socketId).emit(
            'your turn'
        );

        io.to(connectedUsers[connectedUsers.length - 2].socketId).emit(
            'teammateId',
            connectedUsers[connectedUsers.length - 1].onlineId
        );
        io.to(connectedUsers[connectedUsers.length - 1].socketId).emit(
            'teammateId',
            connectedUsers[connectedUsers.length - 2].onlineId
        );

        io.to(connectedUsers[connectedUsers.length - 2].socketId).emit(
            'start state',
            randomizedState
        );
        io.to(connectedUsers[connectedUsers.length - 1].socketId).emit(
            'start state',
            randomizedState
        );
    } else {
        console.log('Waiting for opponent');
    }

    socket.on('make move', (newState) => {
        var idx = connectedUsers.findIndex((x) => x.socketId === socket.id);

        if (idx % 2 === 1) {
            // Last element in a room because of Idx starting at 0
            io.to(connectedUsers[idx - 1].socketId).emit('your turn');
            io.to(connectedUsers[idx - 1].socketId).emit(
                'puzzle updated',
                newState
            );
        } else {
            io.to(connectedUsers[idx + 1].socketId).emit('your turn');
            io.to(connectedUsers[idx + 1].socketId).emit(
                'puzzle updated',
                newState
            );
        }
    });

    socket.on('message', ({ name, message }) => {
        console.log(name);
        var idx = connectedUsers.findIndex((x) => x.onlineId === name);
        console.log(idx);
        if (idx % 2 === 1) {
            io.to(connectedUsers[idx].socketId).emit('message', {
                name,
                message,
            });
            io.to(connectedUsers[idx - 1].socketId).emit('message', {
                name,
                message,
            });
        } else {
            io.to(connectedUsers[idx].socketId).emit('message', {
                name,
                message,
            });
            io.to(connectedUsers[idx + 1].socketId).emit('message', {
                name,
                message,
            });
        }
    });

    socket.on('disconnect', (data) => {
        var idx = connectedUsers.findIndex((x) => x.socketId === socket.id);
        if (idx > -1) {
            if (idx % 2 === 1) {
                // Last element in a room because of Idx starting at 0
                io.to(connectedUsers[idx - 1].socketId).emit(
                    'teammate disconnected'
                );
                connectedUsers.splice(idx, 1);
                connectedUsers.splice(idx - 1, 1);
                console.log(connectedUsers);
            } else {
                if (connectedUsers[idx + 1]) {
                    io.to(connectedUsers[idx + 1].socketId).emit(
                        'teammate disconnected'
                    );
                }
                connectedUsers.splice(idx, 1);
                connectedUsers.splice(idx, 1);
                console.log(connectedUsers);
            }
        }
    });
});

mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log('connected');
    }
);

const postSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    gameHistory: {
        type: Array,
        required: true,
    },
});

const Post = mongoose.model('Post', postSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post('/api/post', (req, res) => {
    var post = new Post({
        userId: req.body.userId,
        gameHistory: [
            {
                number_of_moves: req.body.number_of_moves,
                difficulty: req.body.difficulty,
                lowest_possible: req.body.lowest_possible,
            },
        ],
    });

    Post.collection.findOne({ userId: req.body.userId }, (err, user) => {
        if (user) {
            if (!req.body.teammate) {
                Post.collection
                    .updateOne(
                        { userId: req.body.userId },
                        {
                            $push: {
                                gameHistory: {
                                    number_of_moves: req.body.number_of_moves,
                                    difficulty: req.body.difficulty,
                                    lowest_possible: req.body.lowest_possible,
                                },
                            },
                        }
                    )
                    .then((err, res) => {
                        console.log(err);
                    });
            } else {
                Post.collection
                    .updateOne(
                        { userId: req.body.userId },
                        {
                            $push: {
                                gameHistory: {
                                    game_mode: 'multiplayer',
                                    teammate: req.body.teammate,
                                    number_of_moves: req.body.number_of_moves,
                                    difficulty: req.body.difficulty,
                                    lowest_possible: req.body.lowest_possible,
                                },
                            },
                        }
                    )
                    .then((err, res) => {
                        console.log(err);
                    });
            }
        } else {
            if (!req.body.teammate) {
                post.save()
                    .then((data) => {
                        res.json(data);
                    })
                    .catch((err) => {
                        res.json({ message: err });
                    });
            } else {
                post = new Post({
                    userId: req.body.userId,
                    gameHistory: [
                        {
                            game_mode: 'multiplayer',
                            teammate: req.body.teammate,
                            number_of_moves: req.body.number_of_moves,
                            difficulty: req.body.difficulty,
                            lowest_possible: req.body.lowest_possible,
                        },
                    ],
                });
                post.save()
                    .then((data) => {
                        res.json(data);
                    })
                    .catch((err) => {
                        res.json({ message: err });
                    });
            }
        }
    });
});

app.post('/api/profile', (req, res) => {
    Post.collection.findOne(
        { userId: req.body.userId },
        'userId',
        (err, user) => {
            if (err) console.log(err);
            if (user) {
                res.send(user.gameHistory);
            }
        }
    );
});

var server = http.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
});
