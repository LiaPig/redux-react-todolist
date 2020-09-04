import React from 'react';
import './index.css'

function TodoItem(props) {
    const { id, text, complete, toggleTodo, deleteTodo } = props;
    return (
        <li className="todo-item">
            <input type="checkbox" checked={complete} onChange={() => toggleTodo(id)}/>
            <span>{ text }</span>
            
            <span className="delete" onClick={() => deleteTodo(id)}>x</span>
        </li>
    )
}

export default TodoItem;
