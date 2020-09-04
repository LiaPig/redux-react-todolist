import React, { useState, useEffect } from 'react';
import './App.css';
import List from './components/List/index.jsx'
import Control from './components/Control'
import { createSet, createAdd, createDelete, createToggle } from './actions'

const LS_KEY = 'LS_TD'

function App() {
  const [todos, setTodos] = useState([]);

  const dispatch = (action) => {
    const { type, payload } = action;
    switch (type) {
      case 'set':
        setTodos(payload);   // 把原来 todos 换成 payload
        break;
      case 'add':
        setTodos([...todos, payload]);   // 把原来 todo 换成 payload
        break;
      case 'delete':
        const newTodos = todos.filter(item => item.id !== payload); // 把原来 id 换成 payload
        setTodos(newTodos);
        break;
      case 'toggle':
        const newTodo = [...todos];
        const index = newTodo.findIndex(item => item.id === payload); // 把原来 id 换成 payload
        newTodo[index].complete = !newTodo[index].complete
        setTodos(newTodo)
        break;
      default: ;
    }

  }

  // const toggleTodo = (id) => {
  //   const newTodo = [...todos]
  //   const index = newTodo.findIndex(item => item.id === id)
  //   newTodo[index].complete = !newTodo[index].complete
  //   setTodos(newTodo)
  // }
  // const deleteTodo = (id) => {
  //   const newTodo = todos.filter(item => item.id !== id)
  //   // console.log(newTodo)
  //   setTodos(newTodo)
  // }
  // const addTodo = (todo) => {
  //   setTodos([...todos, todo])
  // }

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(LS_KEY));
    // setTodos(data);
    dispatch(createSet(data));
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(todos));
  }, [todos])


  return (
    <div className="App">
      <header className="App-header">
        {/* <Control addTodo={addTodo} /> */}
        <Control dispatch={dispatch} />
        {/* <List
          todos={todos}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
        /> */}
        <List
          todos={todos}
          dispatch={dispatch}
        />
      </header>
    </div>
  );
}

export default App;
