import React from "react";
import RoomLayout  from "./components/RoomLayout";
import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket_endpoint = process.env.SOCKET_CONNECTION;
const socket = io(socket_endpoint);
const settings = get_settings();
function room_id() {
  const [isRoundActive, setRound] = useState(false);
  const [isConnected, setConnection] = useState(false);
  useEffect(() => {
    socket.on("connection", () => {
      setConnection(true);
    });

    socket.emit("create_room", {});
  }, []);

  return <RoomLayout />;
}

export default room_id;
