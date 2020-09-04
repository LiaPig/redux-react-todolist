import React, {memo} from 'react';
import './index.css'
import TodoItem from './TodoItem'

const List = memo(function List(props) {
    const { todos, dispatch } = props;
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
                            dispatch={dispatch}
                        />
                    )
                })
            }
        </ul>
    )
})

export default List;