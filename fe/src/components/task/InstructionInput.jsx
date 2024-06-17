import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, Typography, Box } from "@mui/material";

function InstructionInput({ setSelectedTaskFilename }) {
  const [instructions, setInstructions] = useState('');

  const startInstructionTask = async () => {
    if (instructions.trim() === '') return;

    try {
      const response = await axios.post('http://localhost:8000/instructions', { input_text: instructions });
      const { filename } = response.data;
      setSelectedTaskFilename(filename);
    } catch (error) {
      console.error("Error processing instructions:", error);
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h5" component="h3" gutterBottom>
        Enter Instructions to Process
      </Typography>
      <Box display="flex" alignItems="center">
        <TextField
          type="text"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Enter Instructions"
          fullWidth
          variant="outlined"
          style={{ marginRight: '10px' }}
        />
        <Button variant="contained" color="primary" onClick={startInstructionTask}>
          Start Instructions Task
        </Button>
      </Box>
    </Box>
  );
}

export default InstructionInput;
