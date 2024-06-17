import React, { useState } from "react";
import { Paper, Typography, Tabs, Tab, Box } from "@mui/material";
import UrlInput from "./task/UrlInput";
import InstructionInput from "./task/InstructionInput";
import TaskList from "./task/TaskList";

function TaskSelector({ setSelectedTaskFilename }) {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Paper 
      elevation={0} 
      style={{ 
        padding: '20px', 
        maxWidth: '800px', 
        margin: '20px auto', 
        backgroundColor: 'transparent' 
      }}
    >
      <Typography variant="h4" component="h2" gutterBottom>
        Select a Task to Start
      </Typography>
      <Tabs value={selectedTab} onChange={handleTabChange} aria-label="task selection tabs">
        <Tab label="Predefined Tasks" />
        <Tab label="URL Task" />
        <Tab label="Instructions Task" />
      </Tabs>
      <Box mt={2}>
        {selectedTab === 0 && <TaskList setSelectedTaskFilename={setSelectedTaskFilename} />}
        {selectedTab === 1 && <UrlInput setSelectedTaskFilename={setSelectedTaskFilename} />}
        {selectedTab === 2 && <InstructionInput setSelectedTaskFilename={setSelectedTaskFilename} />}
      </Box>
    </Paper>
  );
}

export default TaskSelector;
