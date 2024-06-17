import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
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

  const selectTask = async (index) => {
    setSelectedTaskIndex(index);
    setMessages([]);
    setConversationId(null);
    setCurrentStepIndex(0);
    setAllTasksCompleted(false);

    try {
      const response = await axios.get(`http://localhost:8000/task/${index}`);
      const taskDetails = response.data;
      console.log('Selected task details:', taskDetails); // Debugging line
      setCurrentTask(taskDetails);

      // Iniciar la tarea seleccionada
      const startResponse = await axios.post('http://localhost:8000/initialize_task', {
        input_text: '',
        task_index: index
      });

      const { response: botResponse, conversation_id, current_step_index } = startResponse.data;

      setConversationId(conversation_id);
      setMessages([{ role: 'assistant', content: botResponse }]);
      setCurrentStepIndex(current_step_index);
    } catch (error) {
      console.error("Error starting task:", error);
    }
  };

  const sendMessage = async () => {
    if (inputText.trim() === '' || selectedTaskIndex === null) return;
  
    try {
      const response = await axios.post('http://localhost:8000/query', {
        input_text: inputText,
        conversation_id: conversationId,
        task_index: selectedTaskIndex
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
      {selectedTaskIndex === null ? (
        <div>
          <h2>Select a Task to Start</h2>
          <ul>
            {tasks.map((task, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                <button onClick={() => selectTask(index)}>{task}</button>
              </li>
            ))}
          </ul>
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
