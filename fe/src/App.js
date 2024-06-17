import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [url, setUrl] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTaskFilename, setSelectedTaskFilename] = useState(null); // Cambiado a filename
  const [currentTask, setCurrentTask] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [allTasksCompleted, setAllTasksCompleted] = useState(false);

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

  const selectTask = async (filename) => {
    setSelectedTaskFilename(filename); // Cambiado a filename
    setMessages([]);
    setConversationId(null);
    setCurrentStepIndex(0);
    setAllTasksCompleted(false);

    try {
      const response = await axios.get(`http://localhost:8000/task_by_filename/${filename}`);
      console.log("file name: ", filename)
      const taskDetails = response.data;
      console.log('Selected task details:', taskDetails); // Debugging line
      setCurrentTask(taskDetails);

      // Iniciar la tarea seleccionada
      const startResponse = await axios.post('http://localhost:8000/initialize_task', {
        input_text: '',
        filename: filename // Cambiado a filename
      });

      const { response: botResponse, conversation_id, current_step_index } = startResponse.data;

      setConversationId(conversation_id);
      setMessages([{ role: 'assistant', content: botResponse }]);
      setCurrentStepIndex(current_step_index);
    } catch (error) {
      console.error("Error starting task:", error);
    }
  };

  const startUrlTask = async () => {
    if (url.trim() === '') return;

    try {
      const response = await axios.post('http://localhost:8000/scraping', {
        input_text: url
      });

      const { instructions, filename } = response.data;
      console.log("file name: ", filename)
      // Obtener detalles de la tarea por el nombre del archivo
      const taskResponse = await axios.get(`http://localhost:8000/task_by_filename/${filename}`);
      setSelectedTaskFilename(filename)
      const taskDetails = taskResponse.data;
    // Iniciar la tarea seleccionada
    const startResponse = await axios.post('http://localhost:8000/initialize_task', {
        input_text: '',
        filename: filename // Cambiado a filename
    });


        const { response: botResponse, conversation_id, current_step_index } = startResponse.data;

        setConversationId(conversation_id);
        setMessages([{ role: 'assistant', content: taskDetails.steps[0] }]);
      setCurrentTask(taskDetails);
      setCurrentStepIndex(0);
      setAllTasksCompleted(false);
      setUrl('');

      console.log(`Instructions saved as ${filename} in the tasks folder.`);
    } catch (error) {
      console.error("Error processing URL:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data); // Log de la respuesta del error
      } else {
        console.error("Error details:", error.message); // Log de los detalles del error si no hay respuesta
      }
    }
  };

  const sendMessage = async () => {
    if (inputText.trim() === '' || selectedTaskFilename === null) return;

    try {
      const response = await axios.post('http://localhost:8000/query', {
        input_text: inputText,
        conversation_id: conversationId,
        filename: selectedTaskFilename // Cambiado a filename
      });

      console.log('API response:', response); // Log completo de la respuesta

      const { response: botResponse, success, conversation_id, current_step_index, all_steps_completed } = response.data;

      setMessages([...messages, { role: 'user', content: inputText }, { role: 'assistant', content: botResponse }]);
      setCurrentStepIndex(current_step_index);

      if (all_steps_completed) {
        setAllTasksCompleted(true);
      }

      setInputText('');
    } catch (error) {
      console.error("Error sending message:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data); // Log de la respuesta del error
      } else {
        console.error("Error details:", error.message); // Log de los detalles del error si no hay respuesta
      }
    }
  };

  const currentStep = currentTask && currentTask.steps ? currentTask.steps[currentStepIndex] : null;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Task Assistant</h1>
      {selectedTaskFilename === null && !currentTask ? (
        <div>
          <h2>Select a Task to Start</h2>
          <ul>
            {tasks.map((task, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                <button onClick={() => selectTask(task.file_name)}>{task}</button> {/* Cambiado a filename */}
              </li>
            ))}
          </ul>
          <div>
            <h2>Or Enter a URL to Process</h2>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL"
              style={{ width: '80%', padding: '10px' }}
            />
            <button onClick={startUrlTask} style={{ padding: '10px' }}>Start URL Task</button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ border: '1px solid #ccc', padding: '10px', height: '400px', overflowY: 'scroll' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                <strong>{msg.role}: </strong>{msg.content}
              </div>
            ))}
          </div>
          {!allTasksCompleted && currentTask && (
            <div>
              <h2>Current Task: {currentTask.task}</h2>
              {currentStep && <h3>Current Step: {currentStep}</h3>}
              <p><strong>Summary:</strong> {currentTask.summary_task}</p>
            </div>
          )}
          {allTasksCompleted && (
            <div>
              <h2>You have completed all tasks.</h2>
            </div>
          )}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' ? sendMessage() : null}
            style={{ width: '80%', padding: '10px' }}
          />
          <button onClick={sendMessage} style={{ padding: '10px' }}>Send</button>
        </div>
      )}
    </div>
  );
};

export default App;
