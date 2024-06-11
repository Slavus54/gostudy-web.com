import {configureStore} from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import RouteSlice from './slices/RouteSlice'
import rootSaga from './sagas/index'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
    reducer: {
        route: RouteSlice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({thunk: false}).concat(sagaMiddleware)
})

sagaMiddleware.run(rootSaga)