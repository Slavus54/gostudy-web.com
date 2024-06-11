import {createSlice} from '@reduxjs/toolkit'
import {centum} from '../../shared/libs/libs'

export const RouteSlice = createSlice({
    name: 'route',
    initialState: {
        routes: [],
        distance: 0,
        currentCords: {lat: 0, long: 0}
    },
    reducers: { 
        initRoute: (state, {payload}) => {  
            state.currentCords = payload
        },
        appendRoute: (state, {payload}) => {
            let isAlreadyExist = state.routes.find(el => centum.search(el.shortid, payload.shortid, 1e2))

            if (isAlreadyExist === undefined) {
                let distance = centum.haversine([state.currentCords.lat, state.currentCords.long, payload.cords.lat, payload.cords.long], 1)

                state.routes = [...state.routes, payload]
                state.distance += distance
                state.currentCords = payload.cords
            }
        }
    }
})

export const {initRoute, appendRoute} = RouteSlice.actions

export default RouteSlice.reducer