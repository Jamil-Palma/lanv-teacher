import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Typography, Grid, Card, CardContent, CardActions, Collapse, IconButton, InputAdornment, TextField } from "@mui/material";
import { ExpandMore, Search } from "@mui/icons-material";

function TaskList({ setSelectedTaskFilename }) {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/tasks');
        setTasks(response.data.tasks);
        setFilteredTasks(response.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleExpandClick = (index) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [index]: !prevExpanded[index]
    }));
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredTasks(
      tasks.filter((task) =>
        task.task.toLowerCase().includes(query) ||
        task.summary_task.toLowerCase().includes(query)
      )
    );
  };

  return (
    <div>
      <TextField
        variant="outlined"
        placeholder="Search tasks"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        style={{ marginBottom: '20px' }}
      />
      <Grid container spacing={2}>
        {filteredTasks.map((task, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card variant="outlined" style={{ marginBottom: '10px' }}>
              <CardContent>
                <Typography variant="h6" component="h3">
                  {task.task}
                </Typography>
                <Collapse in={expanded[index]} timeout="auto" unmountOnExit>
                  <Typography variant="body2" component="p">
                    {task.summary_task}
                  </Typography>
                </Collapse>
              </CardContent>
              <CardActions disableSpacing>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setSelectedTaskFilename(task.file_name)}
                >
                  Select Task
                </Button>
                <IconButton
                  onClick={() => handleExpandClick(index)}
                  aria-expanded={expanded[index]}
                  aria-label="show more"
                  style={{ marginLeft: 'auto', transform: expanded[index] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}
                >
                  <ExpandMore />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default TaskList;
