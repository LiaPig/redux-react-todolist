import React, {useRef} from 'react';
import './index.css'

function Control(props) {
    const { addTodo } = props

    const inputRef = useRef()

    const onSubmit = (e) => {
        e.preventDefault();

        const newText = inputRef.current.value.trim();

        if (!newText) {
            return;
        }

        addTodo({
            id: Date.now(),
            text: newText,
            complete: false
        });

        inputRef.current.value = '';
        
    }

    return (
        <div>
            <h1>Write down what you want to do</h1>
            <form onSubmit={onSubmit}>
                <input 
                    ref={inputRef}
                    type="text" 
                    placeholder="what needs to be done?" 
                    className="input"
                />
            </form>
        </div>
    )
}

export default Control;