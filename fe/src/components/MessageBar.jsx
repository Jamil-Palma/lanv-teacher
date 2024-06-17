import { useState, useEffect } from "react";
import MessageContainer from "./MessageContainer";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import "../styles/messagebar.css";

function MessageBar({ selectedTaskFilename, setSelectedTaskFilename }) {
  const [inputText, setInputText] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [allTasksCompleted, setAllTasksCompleted] = useState(false);

  useEffect(() => {
    const selectTask = async () => {
      setMessages([]);
      setConversationId(null);
      setCurrentStepIndex(0);
      setAllTasksCompleted(false);

      try {
        const response = await axios.get(`http://localhost:8000/task_by_filename/${selectedTaskFilename}`);
        const taskDetails = response.data;
        setCurrentTask(taskDetails);

        const startResponse = await axios.post('http://localhost:8000/initialize_task', {
          input_text: '',
          filename: selectedTaskFilename
        });

        const { response: botResponse, conversation_id, current_step_index } = startResponse.data;
        setConversationId(conversation_id);
        setMessages([{ role: 'assistant', content: botResponse }]);
        setCurrentStepIndex(current_step_index);
      } catch (error) {
        console.error("Error starting task:", error);
      }
    };

    selectTask();
  }, [selectedTaskFilename]);

  const sendMessage = async () => {
    if (inputText.trim() === '' || selectedTaskFilename === null) return;

    try {
      const response = await axios.post('http://localhost:8000/query', {
        input_text: inputText,
        conversation_id: conversationId,
        filename: selectedTaskFilename
      });

      const { response: botResponse, current_step_index, all_steps_completed } = response.data;
      setMessages([...messages, { role: 'user', content: inputText }, { role: 'assistant', content: botResponse }]);
      setCurrentStepIndex(current_step_index);

      if (all_steps_completed) {
        setAllTasksCompleted(true);
      }

      setInputText('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const currentStep = currentTask && currentTask.steps ? currentTask.steps[currentStepIndex] : null;

  return (
    <div>
      <Button onClick={() => setSelectedTaskFilename(null)}>Back to Task Selection</Button>
      <MessageContainer messageList={messages} />
      <div className="msg-bar-container">
        <TextField
          className="msg-box"
          placeholder="Enter a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' ? sendMessage() : null}
        />
        <Button onClick={sendMessage} style={{ padding: '10px' }} endIcon={<SendIcon />}>Send</Button>
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
    </div>
  );
}

export default MessageBar;
