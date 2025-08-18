import React, { useEffect, useState } from 'react'
import './App.css';
import axios from 'axios'
import {v4 as uuid} from 'uuid';

function App() {
  const [tasks,setTasks] = useState([]);
  const [input,setInput] = useState('');
  const [editingTask,setEditingTask] = useState(null);

  useEffect(()=>{
    fetchtodos();
  },[])

  const fetchtodos = async ()=>{
    const res = await axios.get('https://todo-list-p7m0.onrender.com/items');
    setTasks(res.data)
  }

  

  async function addTask(){
    const task = input.trim();
    if(task === ''){
      alert("Please enter a task");
      return;
    }
    const newTask = {
      id: uuid(),
      text: task,
      completed: false,
    }
    const res = await axios.post('https://todo-list-p7m0.onrender.com/items',newTask)
    setTasks([...tasks,res.data]);
    setInput('');
  }

  async function togglechange(id){
    const updatedtasks = tasks.map((task)=>{
      return task.id === id?{...task, completed: !task.completed}:task
    })
    setTasks(updatedtasks);
    const updatedtask = updatedtasks.find(task => task.id === id)
    await updateOnServer(updatedtask);
  }

  async function updateOnServer(updatedtask){
    await axios.put(`https://todo-list-p7m0.onrender.com/items/${updatedtask.id}`,updatedtask)
  }

  function editTask(id){
    const task = tasks.find(task => task.id === id)
    setEditingTask({id, text :task.text})
  }

  function handleEditChange(e){
    setEditingTask(prev => ({...prev , text: e.target.value}))
  }

  async function saveEdit(){
    if(editingTask.text.trim() === ''){
      alert("Please enter a task");
      return;
    }
    const updatetask = tasks.map((task)=>{
      return task.id === editingTask.id?{...task,text:editingTask.text.trim()}:task
    });
    setTasks(updatetask);
    await updateOnServer(editingTask)
    setEditingTask(null);
  }

  function cancelEdit(){
    setEditingTask(null);
  }

  async function deleteTask(id){
    await axios.delete(`https://todo-list-p7m0.onrender.com/items/${id}`)
    setTasks(tasks.filter(task => task.id !== id ));   
  }



  return (
    <div id = "container">
        <h2>To-Do List 📋</h2>
        <input type='text' id = "todo" placeholder='Enter the task' 
        onChange={e => setInput(e.target.value)}
        value={input}/>
        <button onClick={addTask}>Add</button>
        <br></br>
         <br></br>
        <ul id = "Tasks">
          {tasks.map((task)=>(
            <li 
            key={task.id}
            className={task.completed? "completed": ""}
            onClick={()=>{if(editingTask?.id !== task.id)togglechange(task.id)}}>
            {editingTask?.id === task.id ? (
            <>
            <input id = 'editinput' type = 'text' value={editingTask.text} onChange={handleEditChange} onClick={(e)=>{e.stopPropagation()}} />
            <button onClick={saveEdit}>Save</button>
            <button onClick={cancelEdit}>Cancel</button>
            </>
            ) : (
              <>
            {task.text}
            <button id = 'edit' onClick={(e) => {e.stopPropagation(); editTask(task.id)}} > ✏️ </button>
            <button id = 'dustbin'onClick={(e) => {e.stopPropagation();deleteTask(task.id);}}  > 🗑 </button>
            </>
            )}<br></br>
            </li>
          
          ))}
        </ul>
    </div>
  )
}

export default App