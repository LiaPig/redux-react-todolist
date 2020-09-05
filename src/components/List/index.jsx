import React, {memo} from 'react';
import './index.css'
import TodoItem from './TodoItem'

const List = memo(function List(props) {
    // const { todos, dispatch } = props;
    const { todos, deleteTodo, toggleTodo } = props;

    return (
        <ul className="list-container">
            {
                todos.length > 0 ? todos.map(todo => {
                    return (
                        <TodoItem
                            key={todo.id}
                            id={todo.id}
                            text={todo.text}
                            complete={todo.complete}
                            deleteTodo={deleteTodo}
                            toggleTodo={toggleTodo}
                        />
                    )
                }) : ''
            }
        </ul>
    )
})

export default List;
