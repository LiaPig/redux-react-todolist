import React, { useState, useEffect } from 'react';
import './App.css';
import List from './components/List/index.jsx'
import Control from './components/Control'

const LS_KEY = 'LS_TD'

function App() {
  const [todos, setTodos] = useState([]);

  const toggleTodo = (id) => {
    const newTodo = [...todos]
    const index = newTodo.findIndex(item => item.id === id)
    newTodo[index].complete = !newTodo[index].complete
    setTodos(newTodo)
  }
  const deleteTodo = (id) => {
    const newTodo = todos.filter(item => item.id !== id)
    // console.log(newTodo)
    setTodos(newTodo)
  }
  const addTodo = (todo) => {
    setTodos([...todos, todo])
  }

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(LS_KEY));
    setTodos(data);
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(todos));
  }, [todos])


  return (
    <div className="App">
      <header className="App-header">
        <Control addTodo={addTodo}/>
        <List 
          todos={todos} 
          toggleTodo={toggleTodo} 
          deleteTodo={deleteTodo} 
        />
      </header>
    </div>
  );
}

export default App;
