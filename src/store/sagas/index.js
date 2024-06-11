import {takeEvery} from 'redux-saga/effects'
import {initRoute} from '../slices/RouteSlice'
import {TEST_API_ENDPOINT} from '../../env/env'

const getTowns = async () => {
    const data = await fetch(TEST_API_ENDPOINT)

    return await data.json()
}

export function* workerSaga() {
    const result = yield getTowns()
    console.log(result) 
}

export function* watchSaga() {
    yield takeEvery(initRoute, workerSaga)
}

export default function* rootSaga() {
    yield watchSaga()
}