// 创建一个 reducers 对象，key 为 state 的名，value 为这个 state 的 reducer
const reducers = {
    todos: (state, action) => {
        const { type, payload } = action;

        switch (type) {
            case 'set':
                return payload;
            case 'add':
                return [...state, payload];
            case 'delete':
                return state.filter(item => item.id !== payload)
            case 'toggle':
                const newTodo = [...state];
                const index = newTodo.findIndex(item => item.id === payload); // 把原来 id 换成 payload
                newTodo[index].complete = !newTodo[index].complete;
                return newTodo;
            default:
                return state;
        }
    },
    incrementCount: (state, action) => {
        const { type } = action;

        switch (type) {
            case 'add':
                return state + 1;
            default:
                return state;
        }
    }
};

// 创建一个 combineReducers 函数，让它能返回 reducer 函数
const combineReducers = (reducers) => {
    // 为了更形象的表示，没有使用箭头函数
    return function reducer(states, action) {
        // 经过这个 action 操作，包含了所有改变了的 state 值的 states 对象
        const changedStates = {};

        // reducers 的 key 都为 state 名
        for (let key in reducers) {
            changedStates[key] = reducers[key](states[key], action);
        }

        // 别忘了 reducer 的返回值是一个经过 action 处理后的 states 值
        return {
            ...states,
            ...changedStates
        }
    }
};

export default combineReducers(reducers);
