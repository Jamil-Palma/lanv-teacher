import React, { useState } from 'react';
import { AppBar, Typography } from "@mui/material";
import MessageBar from "./components/MessageBar";
import TaskSelector from "./components/TaskSelector";
import "./App.css";

function App() {
  const [selectedTaskFilename, setSelectedTaskFilename] = useState(null);

  return (
    <div className="App">
      <AppBar position="static">
        <Typography variant="h6" component="div">
          Chatting with a Chatbot!
        </Typography>
      </AppBar>
      {selectedTaskFilename ? (
        <MessageBar selectedTaskFilename={selectedTaskFilename} setSelectedTaskFilename={setSelectedTaskFilename} />
      ) : (
        <TaskSelector setSelectedTaskFilename={setSelectedTaskFilename} />
      )}
    </div>
  );
}

export default App;
