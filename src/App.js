import React, {useState, useEffect, useCallback} from 'react';
import './App.css';
import List from './components/List/index.jsx'
import Control from './components/Control'
import {createAdd, createDelete, createSet, createToggle} from "./actions";
import reducer from "./reducers";

const LS_KEY = 'LS_TD'

function App() {
    const [todos, setTodos] = useState([]);
    const [incrementCount, setIncrementCount] = useState(0);


    const dispatch = useCallback((action) => {
        // 将所有的state，封装在一个大的 states 对象里，key、value都为state
        const states = {
            todos,
            incrementCount
        };
        // 将所有 state 的 setter，封装在一个大的 setters 对象里，key 名为 state 的名，value 为对应的 setter
        const setters = {
            todos: setTodos,
            incrementCount: setIncrementCount
        };

        // 根据传入的 action，去调用 reducer 函数，获取到返回的修改后的 states 值
        const newStates = reducer(states, action);
        // 循环 states 大对象，更新里面的state
        for (let key in newStates) {
            setters[key](newStates[key]);
        }
    }, [todos, incrementCount])

    const bindActionCreators = (actionCreators, dispatch) => {
        const result = {};

        for(let key in actionCreators) {
            result[key] = function(payload) {
                const actionCreator = actionCreators[key];
                const action = actionCreator(payload);
                dispatch(action);
            }
        }

        return result;
    }

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(LS_KEY));
        // dispatch(createSet(data));
        const {set} = bindActionCreators({ set: createSet }, dispatch);
        set(data);
    }, []);

    useEffect(() => {
        localStorage.setItem(LS_KEY, JSON.stringify(todos));
    }, [todos])


    return (
        <div className="App">
            <header className="App-header">
                {/*<Control dispatch={dispatch}/>*/}
                <Control
                    {...bindActionCreators({addTodo: createAdd}, dispatch)}
                />

                {/*<List*/}
                {/*    todos={todos}*/}
                {/*    dispatch={dispatch}*/}
                {/*/>*/}
                <List
                    todos={todos}
                    {
                        ...bindActionCreators({
                            deleteTodo: createDelete,
                            toggleTodo: createToggle
                        }, dispatch)
                    }
                />
            </header>
        </div>
    );
}

export default App;
