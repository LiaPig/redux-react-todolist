import React, {memo} from 'react';
import './index.css'
import TodoItem from './TodoItem'

const List = memo(function List(props) {
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
})

export default List;