export const createSet = (payload) => {
    return {
        type: 'set',
        payload
    }
}

export const createAdd = (payload) => {
    // return {
    //     type: 'add',
    //     payload
    // }
    return (dispatch, getStates) => {
        setTimeout(() => {
            const { todos } = getStates()
            if (todos.findIndex(item => item.text === payload.text) === -1) {
                dispatch({
                    type: 'add',
                    payload: {
                        id: Date.now(),
                        text: payload.text,
                        complete: false
                    }
                })
            }
        }, 5000)
        setTimeout(() => {
            console.log('已经五秒啦')
        }, 5000)
    }
}

export const createDelete = (payload) => {
    return {
        type: 'delete',
        payload
    }
}

export const createToggle = (payload) => {
    return {
        type: 'toggle',
        payload
    }
}
