import React, { useEffect, useState } from "react";
import { Button, Input, List, Select } from "antd";
import axios from "axios";
import { SendOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface MessageDto {
  sender: string;
  recipientRole: string;
  content: string;
  timestamp: Date;
}

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [message, setMessage] = useState<string>("");
  const [role, setRole] = useState<string>("Admin");

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7238/api/ChatHub/message"
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (message.trim() === "") return;

    const newMessage: MessageDto = {
      sender: role,
      recipientRole: role === "Admin" ? "Importer" : "Admin",
      content: message,
      timestamp: new Date(),
    };

    try {
      await axios.post("https://localhost:7238/api/ChatHub/send", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    // Fetch chat messages when the component mounts
    fetchMessages();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {/* Role Selection */}
      <Select
        value={role}
        onChange={setRole}
        style={{ width: "150px", marginBottom: "20px" }}
      >
        <Select.Option value="Admin">Admin</Select.Option>
        <Select.Option value="Importer">Importer</Select.Option>
      </Select>

      {/* Message List */}
      <List
        bordered
        dataSource={messages}
        renderItem={(msg) => (
          <List.Item
            style={{ textAlign: msg.sender === role ? "right" : "left" }}
          >
            <div>
              <strong>{msg.sender}</strong>: {msg.content} <br />
              <span style={{ fontSize: "12px", color: "#999" }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </List.Item>
        )}
        style={{ height: "400px", overflowY: "scroll", marginBottom: "20px" }}
      />

      <div style={{ display: "flex" }}>
        <TextArea
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={sendMessage}
          style={{ marginLeft: "10px" }}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatComponent;
