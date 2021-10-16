import { applyMiddleware, createStore, combineReducers } from "redux"
import { save, load } from "redux-localstorage-simple"
import board from "./board/board"
import drawing from "./drawing/drawing"
import loading from "./loading/loading"
import session from "./session/session"

const rootReducer = combineReducers({
    board,
    drawing,
    loading,
    session,
})

/*
    Saving to LocalStorage is achieved using Redux
    middleware. The 'save' method is called by Redux
    each time an action is handled by your reducer.
*/
const createStoreWithMiddleware = applyMiddleware(
    save({
        states: ["board", "drawing", "session"],
        namespace: "redux_local",
        debounce: 1000,
    })
)(createStore)

/*
    Loading from LocalStorage happens during
    creation of the Redux store.
*/
const store = createStoreWithMiddleware(
    rootReducer,
    load({
        states: ["board", "drawing", "session"],
        namespace: "redux_local",
        immutablejs: false,
    })
)

// const store = createStore(rootReducer)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
