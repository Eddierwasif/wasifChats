const express = require("express");
const http = require("http");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const { addUser, getUser, getUsersInRoom, removeUser } = require("./user");
const router = require("./router");
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "..", "build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

io.on("connection", (socket) => {
  console.log("Connected to the server");

  socket.on("join", ({ name, room }) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) {
      return socket.emit("error", { message: error }); // Emit an error event if there's an error during user addition
    }

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to ${user.room}`,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined` });
    socket.join(user.room);

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });

  socket.on("sendMessage", (message) => {
    const user = getUser(socket.id);
    if (user) {
      const messageId = uuidv4();
      io.to(user.room).emit("message", {
        id: messageId,
        user: user.name,
        text: message,
      });
    }
  });

  socket.on("sendLocation", ({ latitude, longitude }, callback) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit("locationMessage", {
        user: user.name,
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
      });
      callback();
    }
  });

  socket.on("sendImage", (image, callback) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit("imageMessage", { user: user.name, image });
      if (typeof callback === "function") {
        callback();
      }
    }
  });

  socket.on("unsendMessage", (messageId) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit("unsendMessage", messageId);
    }
  });

  socket.on("unsendImage", (messageId) => {
	const user = getUser(socket.id);
	io.to(user.room).emit("unsendImage", messageId);
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left!`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

app.use(router);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
