import React from 'react';
import { Box, Typography, Paper, Stack, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

const FeatureSuggestionsChat = ({ data, addToInput }) => {
  const features = data?.features;
  const theme = useTheme();

  if (!features || features.length === 0) return null;

  return (
    <Box my={2}>
      <Paper elevation={3} sx={{ p: 2, borderRadius: 3, bgcolor: theme.palette.background.paper }}>
        <Stack spacing={1}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Chip
                label={feature}
                variant="outlined"
                color="primary"
                onClick={() => addToInput(feature)}
                sx={{ fontWeight: 500, fontSize: '14px', p: 1 }}
              />
            </motion.div>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
};

export default FeatureSuggestionsChat;