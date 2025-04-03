import React, { useState, useEffect, useRef } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";
import AttendanceSummary from "./chatbot/AttendanceSummary"; // Import the new component
import styles from "./styles/Chatbot.module.css";
import AllProjects from "./chatbot/AllProjects";

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    // Function to add messages (Bot/User)
    const addMessage = (content, sender, intent = null) => {
        setMessages((prev) => [...prev, { content, sender, intent }]);
    };

    // Handle sending user message
    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput("");
        addMessage({ response: userMessage }, "user");

        // Fake typing effect
        setTimeout(() => addMessage({ response: "..." }, "bot"), 500);

        // Send message to backend
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/chat`, {
                message: userMessage,
            }, {
                headers: { "Content-Type": "application/json" }
            });

            console.log(res);
            setTimeout(() => {
                setMessages((prev) => prev.filter((msg) => msg.content.response !== "..."));
                addMessage(res.data, "bot", res.data.intent);
            }, 1000);
        } catch (error) {
            console.error("Error:", error);
            addMessage("Sorry, something went wrong!", "bot");
        }
    };

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Box className={styles.chatContainer}>
            <Box className={styles.chatBox} sx={{ flex: 1, overflowY: "auto", padding: 2 }}>
                {messages.length > 0 ? messages.map((msg, index) => (
                    <Box key={index} sx={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start", mb: 1 }}>
                        <Box sx={{
                            padding: "10px 15px",
                            borderRadius: "10px",
                            backgroundColor: msg.sender === "user" ? "#1976d2" : "#f0f0f0",
                            color: msg.sender === "user" ? "#fff" : "#000",
                            maxWidth: "80%",
                        }}>
                            <Typography variant="body2" >{msg.content.response}</Typography>
                            {msg.intent === "employee_attendance_summary" ? (
                                <AttendanceSummary data={msg.content.data} />
                            ) :
                                msg.intent === "all_projects" ? (
                                    <AllProjects data={msg.content.data} />
                                )
                                    : (
                                        <></>
                                    )}
                        </Box>
                    </Box>
                )) : (
                    <Box height={'100%'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <Typography variant="h4">Start chatting...</Typography>
                    </Box>
                )}
                <div ref={messagesEndRef}></div>
            </Box>

            <Box className={styles.chatInput}>
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} variant="contained" sx={{ ml: 1 }}>Send</Button>
            </Box>
        </Box>
    );
};

export default ChatBot;