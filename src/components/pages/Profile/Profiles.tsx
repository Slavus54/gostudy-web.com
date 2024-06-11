import React, {useState, useMemo, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useQuery} from '@apollo/client'
import {centum} from '../../../shared/libs/libs'
import {changeTitle} from '../../../utils/notifications'
import {getTownsFromStorage} from '../../../utils/storage'
import RouterNavigator from '../../router/RouterNavigator'
import DataPagination from '../../../shared/UI/DataPagination'
import Loading from '../../../shared/UI/Loading'
import MapPicker from '../../../shared/UI/MapPicker'
import {getProfilesQ} from './gql/queries'
import {COUNTRIES, STAGES, SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '../../../env/env'
import {TownType, Cords, MapType} from '../../../env/types'

const Profiles: React.FC = () => {
    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())

    const [filtered, setFiltered] = useState<any[]>([])
    const [profiles, setProfiles] = useState<any[] | null>(null)
    
    const [name, setName] = useState<string>('')
    const [stage, setStage] = useState<string>(STAGES[0])
    const [country, setCountry] = useState<string>(COUNTRIES[0])
    const [region, setRegion] = useState<string>(towns[0].translation)
    const [cords, setCords] = useState<Cords>(towns[0].cords)

    const {data, loading} = useQuery(getProfilesQ)

    useLayoutEffect(() => {
        changeTitle('Пользователи')

        if (data) {
            setProfiles(data.getProfiles)
        }
    }, [data])

    useEffect(() => {
        if (region.length !== 0) {
            let result = towns.find(el => centum.search(el.translation, region, SEARCH_PERCENT))

            if (result !== undefined) {
                setRegion(result.translation)
                setCords(result.cords)
            }
        }
    }, [region])

    useEffect(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    useMemo(() => {
        if (profiles !== null) {
            let result: any[] = profiles.filter(el => el.country === country && el.region === region)

            if (name.length !== 0) {
                result = result.filter(el => centum.search(el.name, name, SEARCH_PERCENT))
            }

            result = result.filter(el => el.stage === stage)

            setFiltered(result)
        }
    }, [profiles, name, country, stage, region])

    return (
        <div className='main page'>
            <div className='items small'>
                <div className='item'>
                    <h4 className='pale'>Имя</h4>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder='Имя пользователя' type='text' />
                </div>
                <div className='item'>
                    <h4 className='pale'>Регион</h4>
                    <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Населённый пункт' type='text' />
                </div>
            </div>

            <h4 className='pale'>Страна & Стадия</h4>
            <div className='items small'>
                <select value={country} onChange={e => setCountry(e.target.value)}>
                    {COUNTRIES.map(el => <option value={el}>{el}</option>)}
                </select>
                <select value={stage} onChange={e => setStage(e.target.value)}>
                    {STAGES.map(el => <option value={el}>{el}</option>)}
                </select>
            </div>

            <DataPagination items={filtered} setItems={setFiltered} label='Пользователи на карте:' />
 
            {data &&
                <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                    <Marker latitude={cords.lat} longitude={cords.long}>
                        <MapPicker type='picker' />
                    </Marker>

                    {filtered.map(el => 
                        <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                            <RouterNavigator url={`/profile/${el.shortid}`}>
                                {centum.shorter(el.name)}
                            </RouterNavigator>
                        </Marker>
                    )}
                </ReactMapGL>
            }

            {loading && <Loading label='Загрузка пользователей' />}
        </div>
    )
}

export default Profiles