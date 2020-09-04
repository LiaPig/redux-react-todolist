import React, {memo} from 'react';
import './index.css'
import { createDelete, createToggle } from '../../../actions'

const TodoItem = memo((props) => {
    const { id, text, complete, dispatch } = props;

    const onChange = () => {
        dispatch(createToggle(id));
    }

    const onClick = () => {
        dispatch(createDelete(id));
    }

    return (
        <li className="todo-item">
            <input type="checkbox" checked={complete} onChange={() => onChange()}/>
            <span>{ text }</span>
            
            <span className="delete" onClick={() => onClick()}>x</span>
        </li>
    )
})

export default TodoItem;
