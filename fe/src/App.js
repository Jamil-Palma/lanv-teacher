import React, { useState } from "react";
import { AppBar, Typography } from "@mui/material";
import MessageBar from "./components/MessageBar";
import TaskSelector from "./components/TaskSelector";
import "./App.css";

function App() {
  const [selectedTaskFilename, setSelectedTaskFilename] = useState(null);

  return (
    <div className="App">
      {selectedTaskFilename ? (
        <MessageBar
          selectedTaskFilename={selectedTaskFilename}
          setSelectedTaskFilename={setSelectedTaskFilename}
        />
      ) : (
        <div>
          <AppBar position="static">
            <Typography variant="h3" component="div">
              Chatting with NVIDIA AI!
            </Typography>
          </AppBar>
          <TaskSelector setSelectedTaskFilename={setSelectedTaskFilename} />
        </div>
      )}
    </div>
  );
}

export default App;
