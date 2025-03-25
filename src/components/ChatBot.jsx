import React, { useState, useEffect, useRef } from "react";
import { TextField, Button, Card, Typography, Box } from "@mui/material";
import axios from "axios";
import styles from "./styles/Chatbot.module.css"; // Import styles if needed for additional effects

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    // Function to add messages (Bot/User)
    const addMessage = (content, sender, isAttendance = false) => {
        setMessages((prev) => [...prev, { content, sender, isAttendance }]);
    };

    // Handle sending user message
    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput("");
        addMessage(userMessage, "user");

        // Fake typing effect
        setTimeout(() => addMessage("...", "bot"), 500);

        // Send message to backend
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/chat`, {
                message: userMessage,
            }, {
                headers: { "Content-Type": "application/json" }
            });

            // Remove "typing..." and add response
            setTimeout(() => {
                setMessages((prev) => prev.filter((msg) => msg.content !== "..."));

                if (res.data.intent === "employee_attendance_summary") {
                    addMessage(res.data, "bot", true);
                } else {
                    addMessage(res.data.response, "bot");
                }
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
        <Box className={styles.chatContainer} >
            <Box className={styles.chatBox} sx={{ flex: 1, overflowY: "auto", padding: 2 }}>
                {messages.map((msg, index) => (
                    <Box key={index} sx={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start", mb: 1 }}>
                        {msg.isAttendance ? (
                            <Card sx={{ padding: 1, width: "80%", backgroundColor: "#f0f0f0" }}>
                                {msg.content.data && msg.content.data.calendar.length > 0 ? (
                                    <>
                                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Attendance Summary</Typography>
                                        <Box sx={{ maxHeight: 150, overflowY: "auto", mt: 0 }}>
                                            {msg.content.data.calendar.map((entry, i) => (
                                                <Typography key={i} variant="body2" sx={{ display: "flex", justifyContent: "space-between" }}>
                                                    <span>{entry.date}</span>
                                                    <span style={{ fontWeight: "bold", color: entry.status === "Absent" ? "red" : entry.status === "Half Day" ? "orange" : "green" }}>{entry.status}</span>
                                                </Typography>
                                            ))}
                                        </Box>
                                    </>
                                ) : (
                                    <Typography variant="body2">{msg.content.data ? "No attendance records found." : msg.content.response}</Typography>
                                )}
                            </Card>
                        ) : (
                            <Box sx={{
                                padding: "10px 15px",
                                borderRadius: "10px",
                                backgroundColor: msg.sender === "user" ? "#1976d2" : "#f0f0f0",
                                color: msg.sender === "user" ? "#fff" : "#000",
                                maxWidth: "80%",
                            }}>
                                <Typography variant="body2">{msg.content}</Typography>
                            </Box>
                        )}
                    </Box>
                ))}
                <div ref={messagesEndRef}></div>
            </Box>

            <Box className={styles.chatInput} >
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