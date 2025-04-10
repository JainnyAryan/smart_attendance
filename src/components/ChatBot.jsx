import React, { useState, useEffect, useRef } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import AttendanceSummary from "./chatbot/AttendanceSummary"; // Import the new component
import styles from "./styles/Chatbot.module.css";
import AllProjects from "./chatbot/AllProjects";
import EmployeeDetailsCard from "./chatbot/EmployeeDetailsCard";
import ProjectAllocationsChat from "./chatbot/ProjectAllocationsChat";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import ProjectAllocationSuggestionsChat from "./chatbot/ProjectAllocationSuggestionsChat";
import ProjectDetailsChat from "./chatbot/ProjectDetailsChat";
import { ArrowForwardIos, Send, SendOutlined, SendSharp } from "@mui/icons-material";
import MyAttendanceLogsChat from "./chatbot/MyAttendanceLogsChat";
import MyProjectAllocations from "./chatbot/MyProjectAllocations";

const ChatBot = () => {
    const { authToken } = useAuth();
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
            const res = await api.post(`${import.meta.env.VITE_BASE_URL}/chat`, {
                message: userMessage,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                }
            });

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

    const getChatComponent = (msg) => {
        switch (msg.intent) {
            //ADMIN INTENTS
            case "employee_attendance_summary":
                return <AttendanceSummary data={msg.content.data} />;
            case "all_projects":
                return <AllProjects data={msg.content.data} />;
            case "employee_details":
                return <EmployeeDetailsCard data={msg.content.data} />;
            case "current_allocations_of_project":
                return <ProjectAllocationsChat data={msg.content.data} />;
            case "project_allocation_suggestions":
                return <ProjectAllocationSuggestionsChat data={msg.content.data} />;
            case "project_details":
                return <ProjectDetailsChat data={msg.content.data} />;

            //EMPLOYEE INTENTS
            case "my_attendance_check":
                return <MyAttendanceLogsChat data={msg.content.data} />;
            case "my_project_allocations":
                return <MyProjectAllocations data={msg.content.data} />;
            default:
                return <></>;
        }
    }

    return (
        <Box
            sx={{
                height: "100dvh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage: `
                linear-gradient(135deg, #e3f2fd,rgb(251, 219, 230)),
                url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')
            `,
                backgroundAttachment: "fixed",
                backgroundSize: "cover",
            }}
        >
            <Typography variant="h4" className={styles.chatHeading}>
                Smart Assistant
            </Typography>
            <Box className={styles.chatContainer}>
                <Box className={styles.chatBox} sx={{ flex: 1, overflowY: "auto", padding: 2 }}>
                    {messages.length > 0 ? messages.map((msg, index) => (
                        <Box key={index} sx={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start", mb: 1 }}>
                            <Box
                                sx={{
                                    padding: "12px 18px",
                                    borderRadius: msg.sender === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                                    background: msg.sender === "user"
                                        ? "linear-gradient(135deg, #1976d2, #1565c0)"
                                        : "rgba(255, 255, 255, 0.6)",
                                    color: msg.sender === "user" ? "#fff" : "#000",
                                    boxShadow: msg.sender === "user"
                                        ? "0 4px 12px rgba(25, 118, 210, 0.3)"
                                        : "0 4px 12px rgba(0, 0, 0, 0.1)",
                                    backdropFilter: msg.sender !== "user" ? "blur(10px)" : "none",
                                    border: msg.sender !== "user" ? "1px solid rgba(255,255,255,0.3)" : "none",
                                    maxWidth: "80%",
                                    wordBreak: "break-word",
                                    position: "relative",
                                }}
                                className={msg.sender === "user" ? styles.userMessageAnimation : styles.botMessageAnimation}
                            >
                                <Typography variant="body2" >{msg.content.response}</Typography>
                                {getChatComponent(msg)}
                            </Box>
                        </Box>
                    )) : (
                        <Box height={'100%'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                            <Typography variant="h4">Say hi...</Typography>
                        </Box>
                    )}
                    <div ref={messagesEndRef}></div>
                </Box>

                <Box className={styles.chatInput} sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px",
                    background: "rgba(255, 255, 255, 0.6)",
                    backdropFilter: "blur(10px)",
                    borderTop: "1px solid rgba(0,0,0,0.1)",
                }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "rgba(0, 0, 0, 0.1)",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#1976d2",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#1565c0",
                                },
                            },
                        }}
                    />
                    <Button
                        onClick={handleSendMessage}
                        variant="contained"
                        sx={{
                            ml: 1,
                            px: 3,
                            py: 1.5,
                            borderRadius: "8px",
                            background: "linear-gradient(135deg, #1976d2, #1565c0)",
                            textTransform: "none",
                            fontWeight: 500,
                            boxShadow: "0 4px 12px rgba(21, 101, 192, 0.3)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transition: "all 0.3s ease",
                                transform: "translateY(-2px)",
                                background: "linear-gradient(135deg, #1565c0, #0d47a1)",
                                boxShadow: "0 6px 16px rgba(21, 101, 192, 0.4)",
                            }
                        }}
                    >
                        <ArrowForwardIos sx={{
                            "&:hover": {
                                transition: "all 0.3s ease",
                                transform: "translateX(2px)",
                            }
                        }} />
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ChatBot;