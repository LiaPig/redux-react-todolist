import React, {useState, useEffect} from 'react';
import './App.css';
import List from './components/List/index.jsx'
import Control from './components/Control'
import {createAdd, createDelete, createSet, createToggle} from "./actions";
import reducer from "./reducers";

const LS_KEY = 'LS_TD'

const store = {
    todos: [],
    incrementCount: 0
}

function App() {
    const [todos, setTodos] = useState([]);
    const [incrementCount, setIncrementCount] = useState(0);

    const dispatch = (action) => {
        // 将所有 state 的 setter，封装在一个大的 setters 对象里，key 名为 state 的名，value 为对应的 setter
        const setters = {
            todos: setTodos,
            incrementCount: setIncrementCount
        };

        // 判断：如果是异步Action，就做以下操作，做完就return，退出函数，不参与后面的同步Action 的操作
        if (typeof action === 'function') {
            action(dispatch, () => store);
            return;
        }

        // 根据传入的 action，去调用 reducer 函数，获取到返回的修改后的 states 值
        const newStates = reducer(store, action);
        // 循环 states 大对象，更新里面的state
        for (let key in newStates) {
            setters[key](newStates[key]);
        }
    }

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

    useEffect(() => {
        Object.assign(store, {
            todos,
            incrementCount
        })
    }, [todos, incrementCount])


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
