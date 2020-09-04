import React from 'react';
import './index.css'
import TodoItem from './TodoItem'

function List (props) {
    const { todos, toggleTodo, deleteTodo } = props;
    return (
        <ul className="list-container">
            {
                todos.map(todo => {
                    return (
                        <TodoItem
                            key={todo.id}
                            id={todo.id}
                            text={todo.text}
                            complete={todo.complete}
                            toggleTodo={toggleTodo}
                            deleteTodo={deleteTodo}
                        />
                    )
                })
            }
        </ul>
    )
}

export default List;