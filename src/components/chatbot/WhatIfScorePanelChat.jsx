import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Stack, Switch, Paper, Divider } from '@mui/material';
import CircularSlider from '@fseehawer/react-circular-slider';
import { AnimatedCounter } from 'react-animated-counter';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const WhatIfScorePanelChat = () => {
    const { authToken } = useAuth();
    const [active, setActive] = useState(35);
    const [hold, setHold] = useState(25);
    const [transitions, setTransitions] = useState(6);
    const [completed, setCompleted] = useState(false);
    const [predictedScore, setPredictedScore] = useState(null);
    const debounceRef = useRef(null);

    const triggerPrediction = () => {
        api.post(`${import.meta.env.VITE_BASE_URL}/employee/what-if-score`, {
            active_time_pct: active,
            hold_time_pct: hold,
            avg_transitions: transitions,
            completed_on_time: completed,
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        })
            .then(res => setPredictedScore(res.data.predicted_score))
            .catch(err => console.error("Prediction failed", err));
    };

    useEffect(() => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            triggerPrediction();
        }, 500);
        return () => clearTimeout(debounceRef.current);
    }, [active, hold, transitions, completed]);

    const scoreColor = predictedScore >= 70 ? "#2ecc71" : predictedScore >= 50 ? "#f39c12" : "#e74c3c";

    return (
        <Paper elevation={4} sx={{ p: 3, mt: 2, borderRadius: 3, mx: 'auto', backgroundColor: "#fdfdfd" }}>
            <Box display="flex" flexDirection={'column'} justifyContent="center" alignItems="center" mb={5}>
                <Box pl={1} py={1}>
                    <AnimatedCounter
                        value={predictedScore ?? 0}
                        includeDecimals={false}
                        fontSize="72px"
                        fontWeight={700}
                        color={scoreColor}

                    />
                </Box>
                <Typography variant="body2" color="text.secondary" fontSize="16px">
                    out of 100
                </Typography>
            </Box>

            <Stack direction="row" justifyContent="space-around" spacing={3} flexWrap="wrap">
                <SliderBlock
                    label="Active Time"
                    value={active}
                    setValue={setActive}
                    color="#2ecc71"
                />
                <SliderBlock
                    label="On-Hold Time"
                    value={hold}
                    setValue={setHold}
                    color="#f39c12"
                />
                <SliderBlock
                    label="Transitions"
                    value={transitions}
                    setValue={setTransitions}
                    color="#3498db"
                    max={10}
                />
            </Stack>

            <Box mt={4} display="flex" justifyContent="center" alignItems="center">
                <Typography variant="body1" mr={2}>Completed on Time</Typography>
                <Switch checked={completed} onChange={(e) => setCompleted(e.target.checked)} />
            </Box>
        </Paper>
    );
};

const SliderBlock = ({ label, value, setValue, color, max = 100 }) => (
    <Box textAlign="center" >
        <Typography variant="body2" mb={1} fontWeight={500}>
            {label}
        </Typography>
        <CircularSlider
            width={80}
            min={0}
            max={max}
            onChange={setValue}
            knobColor={color}
            knobSize={20}
            progressColorFrom={color}
            progressColorTo={color}
            trackColor="#ddd"
            hideLabelValue
        />
        <Typography mt={1} fontSize="14px">{value} {label != "Transitions" && '%'}</Typography>
    </Box>
);

export default WhatIfScorePanelChat;