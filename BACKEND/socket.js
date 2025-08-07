const { Server } = require('socket.io');
const connectedDeliveryBoys = require('./utils/delBoyMap');
const connectedUsers = require('./utils/userMap')

let io; // declare io

function setupSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
     
    // For delivery boy
    socket.on("delBoy", (delBoyId) => {
      console.log("Delivery Boy connected:", socket.id);
      connectedDeliveryBoys.set(delBoyId, socket.id);
    });

    // For users
    socket.on("user", (userId) => {
      console.log("user connected:",socket.id);
      connectedUsers.set(userId, socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Connection disconnected:", socket.id);
      // Remove delivery boy from delivery boy map
      for (let [delBoyId, socketId] of connectedDeliveryBoys.entries()) {
        if (socketId === socket.id) {
          connectedDeliveryBoys.delete(delBoyId);
          break;
        }
      }
      //  Remove user from  user map
      for (let [userId, socketId] of  connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          break;
        }
      }
    });
  });
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}

module.exports = {
  setupSocket,
  getIO
};
