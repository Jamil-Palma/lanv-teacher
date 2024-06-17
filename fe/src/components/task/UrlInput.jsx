import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, Typography, Box } from "@mui/material";

function UrlInput({ setSelectedTaskFilename }) {
  const [url, setUrl] = useState('');

  const startUrlTask = async () => {
    if (url.trim() === '') return;

    try {
      const response = await axios.post('http://localhost:8000/scraping', { input_text: url });
      const { filename } = response.data;
      setSelectedTaskFilename(filename);
    } catch (error) {
      console.error("Error processing URL:", error);
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h5" component="h3" gutterBottom>
        Enter a URL to Process
      </Typography>
      <Box display="flex" alignItems="center">
        <TextField
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          fullWidth
          variant="outlined"
          style={{ marginRight: '10px' }}
        />
        <Button variant="contained" color="primary" onClick={startUrlTask}>
          Start URL Task
        </Button>
      </Box>
    </Box>
  );
}

export default UrlInput;
