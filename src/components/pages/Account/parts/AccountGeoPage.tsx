import React, {useState, useLayoutEffect, useEffect, useMemo} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {useSelector, useDispatch} from 'react-redux'
import {centum} from '../../../../shared/libs/libs'
import {initRoute} from '../../../../store/slices/RouteSlice'
import MapPicker from '../../../../shared/UI/MapPicker'
import {updateProfileInfo, getTownsFromStorage} from '../../../../utils/storage'
import {buildNotification} from '../../../../utils/notifications'
import {updateProfileGeoInfoM} from '../gql/mutations'
import {SEARCH_PERCENT, MAP_ZOOM, VIEW_CONFIG, token} from '../../../../env/env'
import {AccountPropsType, Cords, TownType, MapType} from '../../../../env/types'

const AccountGeoPage: React.FC<AccountPropsType> = ({profile}) => {
    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())

    const [region, setRegion] = useState<string>(profile.region)
    const [cords, setCords] = useState<Cords>({lat: profile.cords.lat, long: profile.cords.long})
    const [isHome, setIsHome] = useState<boolean>(cords.lat === profile.cords.lat)

    const dispatch = useDispatch()

    const routes = useSelector((state: any) => state.route.routes)
    const currentCords = useSelector((state: any) => state.route.currentCords)
    const distance = useSelector((state: any) => state.route.distance)
    
    useLayoutEffect(() => {
        if (currentCords.lat === 0) {
            dispatch(initRoute(profile.cords))
        }
    }, [])

    useEffect(() => {
        if (region.length !== 0) {
            let result = towns.find(el => centum.search(el.translation, region, SEARCH_PERCENT, true))

            if (result !== undefined) {
                setRegion(result.translation)
                setCords(result.title === profile.region ? profile.cords : result.cords)               
            }
        }
    }, [region])

    useMemo(() => {
        setIsHome(cords.lat === profile.cords.lat)

        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    const [updateProfileGeoInfo] = useMutation(updateProfileGeoInfoM, {
        onCompleted(data) {
            buildNotification(data.updateProfileGeoInfo)
            updateProfileInfo(null)
        }
    })

    const onReset = () => {
        setRegion(profile.region)
        setCords(profile.cords)
    }
  
    const onUpdate = () => {
        updateProfileGeoInfo({
            variables: {
                id: profile.shortid, region, cords
            }
        })
    }

    return (
        <>
            <h2>Геолокация и Маршрут</h2>

            <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Населённый пункт' type='text' />

            <h4 className='pale'>Дистанция: <b>{distance}</b> метров ({routes.length} мест)</h4>
            
            <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                {!isHome &&
                    <Marker latitude={profile.cords.lat} longitude={profile.cords.long}>
                       <MapPicker type='home'  />
                    </Marker>
                }
                
                <Marker latitude={cords.lat} longitude={cords.long}>
                    <MapPicker type={isHome ? 'home' : 'picker'}  />
                </Marker>        

                {routes.map(el => 
                    <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                       {centum.shorter(el.title)}
                    </Marker>
                )}        
            </ReactMapGL> 

            <div className='items small'>
                <button onClick={onReset}>Сбросить</button>
                <button onClick={onUpdate}>Обновить</button>
            </div>
        </>
    )
}

export default AccountGeoPage