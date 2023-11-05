const express = require("express");
const app = express();
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http").createServer(app);
const dbConnect = require("./db/dbConnect");
const roomModel = require("./models/room.model");

const PORT = process.env.PORT || 8080;

dbConnect();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    '<h1 align="center">This is a test route in chat app backend API....</h1>'
  );
});

const io = new Server(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("get-messages", () => {
    async function getMessages() {
      await roomModel.find({}).then((data) => {
        io.emit("display", data);
      });
    }

    getMessages();
  });

  socket.on("create-room", (name) => {
    async function createRoom() {
      const newRoom = new roomModel({
        name: name,
      });

      await newRoom.save().then((data) => {
        console.log(data);
      });
    }

    createRoom();
  });

  socket.on("send-message", (room, data) => {
    async function addMessage() {
      await roomModel.findOneAndUpdate(
        { name: room },
        { $push: { messages: data } }
      );
      await roomModel.find({}).then((data) => {
        io.emit("display", data);
      });
    }

    addMessage();
  });
});

http.listen(PORT, () => {
  console.log("Server running on port 8080");
});
