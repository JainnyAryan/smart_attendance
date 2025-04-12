import React, { useEffect, useState, useRef } from 'react'
import { AnimatedCounter } from 'react-animated-counter'
import { Box, Typography, Stack } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'

const getColor = (score) => {
    if (score >= 85) return 'green';
    if (score >= 70) return '#f5a623';
    if (score >= 50) return '#f39c12';
    return '#e74c3c';
};

const getFeedback = (score) => {
    if (score >= 85) return { text: 'Excellent', emoji: '👏' };
    if (score >= 70) return { text: 'Good', emoji: '👍' };
    if (score >= 50) return { text: 'Fair', emoji: '⚠️' };
    return { text: 'Needs Improvement', emoji: '❗' };
};

const EmployeeScoreChat = ({ data }) => {
    const score = data?.score;
    const [showScore, setShowScore] = useState(false);
    const scoreRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowScore(true);
        }, 800);
        return () => clearTimeout(timer);
    }, [score]);

    useEffect(() => {
        if (showScore && scoreRef.current) {
            scoreRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [showScore]);

    if (score === undefined || score === null) return null;
    const color = getColor(score);
    const { text, emoji } = getFeedback(score);

    return (
        <Box display="flex" justifyContent="center" alignItems="center" my={3} ref={scoreRef}>
            <Stack alignItems="center" spacing={1}>
                {showScore ? (
                    <>
                        <AnimatedCounter
                            value={score}
                            includeDecimals={false}
                            fontSize="64px"
                            fontWeight={700}
                            color={color}
                        />
                        <Typography variant="body2" color="text.secondary" fontSize="16px">
                            out of 100
                        </Typography>
                        <AnimatePresence>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.6 }}
                                style={{ display: 'flex', alignItems: 'center' }}
                            >
                                <Typography variant="subtitle2" sx={{ color }}>
                                    {text + ' '}
                                    <motion.span
                                        animate={{
                                            scale: [1.7],
                                            rotate: [0, -10, 10, -10, 0, 0],
                                        }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1.5,
                                            ease: "easeInOut"
                                        }}
                                        style={{ display: 'inline-block', marginLeft: 2 }}
                                    >
                                        {emoji}
                                    </motion.span>
                                </Typography>
                            </motion.div>
                        </AnimatePresence>
                    </>
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        Calculating score...
                    </Typography>
                )}
            </Stack>
        </Box>
    );
};

export default EmployeeScoreChat;