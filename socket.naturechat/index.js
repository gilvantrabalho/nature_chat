const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {

    socket.on("join_chat", (chatId) => {
        socket.join(`chat_${chatId}`);
        // console.log(`Socket ${socket.id} entrou no chat ${chatId}`);
    });

    socket.on("leave_chat", (chatId) => {
        socket.leave(`chat_${chatId}`);
    });

    socket.on("send_message", ({ chatId, message }) => {
        io.emit('update_lastmessage', message)
        io.to(`chat_${chatId}`).emit("receive_message", message);
    });

    socket.on("typing", ({ chatId, user, typing }) => {
        socket.to(`chat_${chatId}`).emit("receive_typing", {
            user,
            typing,
        });
    });

    socket.on("disconnect", () => {
        console.log("Usuário desconectado", socket.id);
    });
});


server.listen(3001, () => {
    console.log("SERVIDOR RODANDO NA PORTA 3001");
});