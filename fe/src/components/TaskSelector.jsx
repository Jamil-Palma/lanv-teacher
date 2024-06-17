import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";

function TaskSelector({ setSelectedTaskFilename }) {
  const [tasks, setTasks] = useState([]);
  const [url, setUrl] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/tasks');
        setTasks(response.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

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
    <div>
      <h2>Select a Task to Start</h2>
      <ul>
        {tasks.map((task, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            <Button onClick={() => setSelectedTaskFilename(task.file_name)}>{task.task}</Button>
          </li>
        ))}
      </ul>
      <div>
        <h2>Or Enter a URL to Process</h2>
        <TextField
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          style={{ width: '80%', padding: '10px' }}
        />
        <Button onClick={startUrlTask} style={{ padding: '10px' }}>Start URL Task</Button>
      </div>
    </div>
  );
}

export default TaskSelector;
