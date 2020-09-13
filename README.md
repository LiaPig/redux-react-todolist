# 前言
`Redux` 会用但又好像不知所以然？通过敲个`todolist`的例子来自己实现一个 `redux` 来深刻理解它的原理吧！

# 一、没有 redux 的 todolist
重点在于 `redux` 逻辑，所以样式布局啥的freestyle。

> 这阶段为止的代码在 `pure` 分支。

# 二、引入 action 概念 和  actionCreator 概念
> 这阶段为止的代码在 `ac_dis` 分支。

## 1. 引入 action 概念
其实我们可以发现，对于 `todos` 这个数据状态来说，修改它的操作其实就只有四个：`set`、`add`、`delete`、`toggle`。
但是在具体用到这三个操作的地方很多，而且很分散。

那能不能使用`对象`的形式来描述这些会修改状态的操作呢？ `type` 字段来描述这是什么操作（`set`、`add`、`delete`、`toggle`）， `payload` 字段来描述这操作会用到的具体`参数`。

因此，一个 `action` 就形如：
```js
{ 
  type: '操作名称', 
  payload // 操作用到的参数
}
```

那么对应的操作就可以改写为：
```
// 页面加载获取 localstorage 时更新 todos
const setAction = {
  type: 'set',
  payload // 将会是一个todos数组
}

// 新增一个 todo
const addAction = {
  type: 'add',
  payload // 将会是一个todo对象
}

// 删除一个 todo
const deleteAction = {
  type: 'delete',
  payload // 将会是一个id
}

// 切换某个 todo 的完成状态
const toggleAction = {
  type: 'toggle',
  payload // 将会是一个id
}
```

## 2. 引入 actionCreator 概念
那既然 `action` 都是个对象，且 `key` 都固定为只有 `type` 和 `payload` 。那机智的我们是不是可以写一个`函数`，函数接收一个参数 `payload` ，然后返回一个 `action` 对象呢？—— 这就是 `actionCreator `。

那么我们就来改写成三个 `actionCreator` ：
```js
function createAdd(payload) {
  return {
    type: 'add',
    payload  // 将会是一个todo对象
  }
}

function createDelete(payload) {
  return {
    type: 'delete',
    payload  // 将会是一个id
  }
}

function createToggle(payload) {
  return {
    type: 'toggle',
    payload  // 将会是一个id
  }
}
```


# 三、引入dispatch概念
> 这阶段为止的代码在 `ac_dis` 分支。

那么，我们可以写一个函数 `dispatch`，让它作为事件的中心，只有通过它才能调用对应的操作，让修改数据状态的具体逻辑就只能在它里面写，方便修改维护。

```js
const dispatch = (action) => {
  const { type, payload } = action;

  switch (type) {
    case 'set':
      // 执行更新todos列表的操作
      break:
    case 'add' : 
      // 执行add一个todo的操作
      break;
    case 'delete' : 
      // 执行delete一个todo的操作
      break;
    case 'toggle' : 
      // 执行toggle一个todo的complete属性的操作
      break;
    default:;
  }
}
```

# 四、引入 bindActionCreators 概念

> 这阶段为止的代码在 `bindActionCreators` 分支。


综上所述，我们可以观察到，要调用修改 `todos` 数据状态修改的四个操作都是以下形式：
```js
// 修改todos
dispatch(createSet(todos));
// 新增一个todo
dispatch(createAdd(todo));
// 删除一个todo
dispatch(createAdd(id));
// 切换一个todo的complete属性
dispatch(createToggle(id));
```

## 1. 接收参数
那么，是不是也可以写一个函数 `bindActionCreators`，让它接收两个参数：
1. 一个是用来生成`createSet(todos)`这一块的（有时候可能不止需要一个呢，所以用 `对象` 来表示，`key`为自定义这个操作的名字，`value`为对应的 `actionCreator` ）
2. 另外一个是`dispatch`函数
```js
 function bindActionCreators({ ‘自定义的操作名如addTodo’, createTodo }, dispatch) {
  // 这里先省略，重点看接收的参数与格式
}
```

## 2.函数返回值
因为解构语法的便利性，我们可以将返回值也定义为一个 `对象` , 对象中的 `key` 就为函数接收第一个参数对象里的 `key` ，返回对象的 `value` 就为一个函数，之后通过调用这个函数就可以帮我们实现 `dispatch(createAdd(todo))` 。
```js
 function bindActionCreators({ ‘自定义的操作名如addTodo’, createAdd }, dispatch) {
  const result = {
     ‘自定义的操作名如addTodo’: function valueFunc(...args) {
        const action = createAdd(...args)
        dispatch(createAdd(action)
      }
  };
  return result;
}
```

## 3.如何调用这个函数
知道函数的输入、输出之后，我们可以推测到，调用的格式为（还是要添加一个待办的场景）：
```js
const { addTodo } = bindActionCreators({ addTodo: createAdd }, dispatch);

addTodo({ id: '~~~', text: '~~~', complete: false })
```

## 4.优化bindActionCreators函数
就像在 `List` 组件里，同时会用到 `toggle` 和 `delete` 操作，就可以优化让 `bindActionCreators` 能返回多个操作：
```js
const bindActionCreators = (actionCreators, dispatch) => {
  const result = {};
  for(let key in actionCreators) {
    result[key] = function (payload) {
      const actionCreator = actionCreators[key];
      const action = actionCreator(payload);

      dispatch(action);
    }
  }
  return result;
}
```

# 五、引入 reducer 概念 和 combineReucers 概念

> 这阶段为止的代码在 `reducer` 分支。

## 1. 引入 Reducer 概念
之前的例子一直就只有一个 `state` (`todos`) 。但项目中往往不可能这么简单，所以再新加一个 `incrementCount`，每新加一个`todo`就加一，只增不减。那么就在 `add` 操作中会调用到。

于是我们可以发现到，当 `state` 变多的时候，要根据 `action` 操作更新 `state` 的步骤似乎会变得混乱。( `dispatch` 中根据 `action` 即要修改 `todos` 的值，也要修改 `incrementCount` 的值)。

所以我们设想有一个函数 `reducer`，它接收两个参数：
- 一个是 state 的值
- 另一个是即将要发生的 action

函数 `reducer` 的返回值就为经过这个 `action` 操作后 `state` 要改变的新的值。

```js
// todosReducer为：
const todosReducer = (state, action) => {
  const { type, payload } = action;
 
  switch (type) {
    case 'set':
      return payload;
    case 'add':
      return [...state, payload];
    case 'delete':
      // 简洁代码起见，此处省略了具体返回
    case 'toggle':
      // 简洁代码起见，此处省略了具体返回
    default:
      return state;
  }
}

// incrementReducer为：
const incrementReducer = (state, action) => {
  const { type } = action;
 
  switch (type) {
    case 'add':
      return state + 1;
    default:
      return state;
  }
}
```

## 2. 引入 reducers 概念
我们可以发现，当前 `todolist` 的 `action` 始终只有那四个（`set`、`add`、`delete`、`toggle`）。每一个 `state` 都应该有一个 `reducer` 来 根据 `action` 做出相应的值改变。但是要为每一个 `state` 都写一个 reducer 太麻烦了，而且重复代码非常多。

所以我们可以用一个 `reducers` 对象，来专门描述不同 `state` 根据不同 `action`要做出的值改变。可以让 `key` 为 `state` 名，`value` 为一个函数，函数的返回值就为根据这个 `action` 改变后的 `state` 的值。

```js
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
```

## 3. 引入 combineReducer 概念
`dispatch` 函数的作用是根据 `action` 来改变 `state` 的值。那么有了 `reducer` 后，原本在 `dispatch` 函数里的 `state` 具体如何发生变化已经不再需要 `dispatch` 函数去关注了，我们可以调用 `reducer` 函数，获取到它返回的新 `state` 值。而`dispatch` 函数只需要触发更新就行了。

我们假设通过 `reducer` 能获取到根据这个 `action` 操作后所有修改后的 `state` 值的集合，一个大对象 `states`。（ `key` 为 `state` 的名字，`value` 为新的值）然后遍历这个 `states`，去为每一项 `state` 都去执行它的 `setter` 函数，从而去更新值（无论值有没改变，都去调用 `setter` 。`useState` 有做这个的性能优化，所以不用担心性能）

于是，我们先尝试修改 `dispatch` 函数的代码：
```js
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
```

这个时候，我们发现，之前我们写的 `reducers` 并不符合 `dispatch` 函数想要的格式呀。于是，我们需要一个转换函数 `combineReducers` （作用是将 `reducers` 转换为 `dispatch` 想要的 `reducer`） ，它接收一个参数 `reducers` ，返回值就为我们 `dispatch` 函数里想要的 `reducer` 格式 —— 是一个函数，第一个参数为所有 `state` 的集合 `states` ，第二个参数为 `action` ；返回值为更新的所有 `newState` 的集合 `newStates`。
```js
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
```

最后我们发现，`reducers` 和 `combineReducers` 应该是独立的，我们在 `todolist` 中，想要的就只有通过 `combineReducers(reducers)` 转换后的 `reducer` 。所以可以将 `reducers` 和 `combineReducers` 放在一个名为 `reducers.js` 的文件中，最后导出 `combineReducers(reducers)` ，在 `todolist` 中引入这个文件即可。

```js
// reducers.js
const reducers = { // 此处省略具体，详情可看项目代码 };
const combineReducers = (reducers) => { // 此处省略具体，详情可看项目代码 };

export default combineReducers(reducers);
```

```js
// App.jsx
import reducer = './reducers.js'
```

#  六、引入异步 Action 概念

> 这阶段为止的代码在 `reducer` 分支。

之前都是同步的操作，那如果在异步的场景，如何拿到正确的 `state` 呢？

先来模拟一下异步的场景，看看 `state` 是否是实时的。假设要新增一条 `todo` 不是同步的，而是异步的（使用定时器来模拟）。然后还要判断判断现有的 `todos` 里有没 `text` 相同的，如果没有，才新增：

1. 首先，之前的整个要新增的 `todo` 数据，都在 `Control` 组件里生成的，我们需要修改一下，只提供 `text` 字段就可以了：
```js
addTodo({
  text: newText,
});
```
2. 将新增 `todo` 的 `actionCreator`（即 `CreateAdd` ）改为异步 `action` ，使用定时器，然后在回调函数里加入判断 `text`，没有相同的才 `dispatch` 这个 `action`。所以可以把 `CreateAdd` 的返回改为 `函数`，接收两个参数，一个是`dispatch`，一个是所有 `state` 的 `states`，返回 `dispatch(action)`：
```js
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
    }
}
```

3. 接下来再修改 `dispatch` 函数，在它调用 `reducer` 函数逻辑之前，先判断 `action` 的类型，如果 `action` 的类型是函数（异步 `Action` ），直接调用它且把 `dispatch` 和 `states` 传给它，最后一定要记得 `return`，不再执行之后的操作。
```js
if (typeof action === 'function') {
  action(dispatch, states)
  return
}
```
4. 接下来实操一下，在 `todos` 里只有一条 `text` 为 "aaa" 的场景下，然后再新增一条 `text` 为 `"aaa"` 的 `todo` ，在敲下回车后，立马又把原来的 `todo` 删掉。

按道理来说，我们想要的结果是五秒后 `todos` 有一条 `"aaa"` 的 `todo`。
然而，五秒过去了，`todos` 空空如也。

5. 查阅代码发现，原来在五秒后的回调函数里，我们拿到的 `states` ，是五秒前就已经传进来的 `states` 。那时候， `todos` 里有一条 `text` 为 `"aaa"` 的 `todo` 。所以在回调函数的判断里，以为已经有了，所以不会新增。那么我们尝试把参数 `states` 改为 `getStates` 函数，然后在回调里再调用再获取 `states`。

修改 `createAdd` 这个异步的 `actionCreator` 里的代码：
```js
export const createAdd = (payload) => {
    // 参数该为getStates
    return (dispatch, getStates) => {
        setTimeout(() => {
           // 五秒后再去获取states里的todo
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
```
配合修改 `dispatch` 函数关于异步 `Action` 传参的代码：
```js
if (typeof action === 'function') {
  action(dispatch, () => states);
  return;
}
```

8. 再做跟步骤4一样的实操

结果发现，五秒过去，`todos` 还是空空如也。

再查阅代码发现，`dispatch` 函数里的 `states` 对象，总是在异步 `Action` 发起之前临时声明构成的。五秒钟之后，原数据的 `states`，由于中途我们删了一个todo，所以 `states` 已经发生变化，但通过 `getStates()` 获取到的 `dispatch` 里的 `states`，还是旧的。

# 七、引入 store 概念

针对上面的问题，可以猜想到，只要是在组件上下文的 `states` ，可能都获取不到最新值，很有可能每次的渲染周期，返回的 `states` 的值都不一样。所以，应该把 `states` 都放在 `App组件` 之外，通过 `useEffect` 来同步更新。

1. 声明提个 `store` 对象，用来存放 `states`
```js
const store = {
    todos,
    incrementCount
}
```

2. 用 `useEffect` 来同步更新
```js
useEffect(() => {
  Object.assign(store, {
    todos,
    incrementCount
  })
}, [todos, incrementCount])
```

3. 更换 `dispatch` 函数里的getStates里的返回值，改为store
```js
if (typeof action === 'function') {
  action(dispatch, () => store);
  return;
}
```
4. 实操，新增一条 `"aaa"` 的同时，删除原来的 `"aaa"` 。结果发现，五秒后，新增了两条 `"aaa"` 。

能成功新增说明异步后拿到的 `todos` 是最新的。

观察代码发现，五秒后在回调函数里我们 `dispatch` 了新的 `todo`，然后是走`dispatch` 的同步 `action` 的逻辑，通过 `reducer` 获取到返回的修改后的 `states` 值。而我们在这里传给 `reducer` 的仍是旧的 `states` 值，所以把传给 `reducer` 的也改为 `store` 。

然后我们还可以发现，在 `dispatch` 函数里，已经没有使用 `states` 了，所以可以把参数定义去掉，还有这个函数已经不再依赖 `states` 的 `todos` 和 
 `incrementCount` 了。所以也不再需要使用 `useCallback` 来包裹 `dispatch` 函数了。

5.再实操，终于成功啦！！！

