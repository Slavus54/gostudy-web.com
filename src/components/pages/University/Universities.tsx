import React, {useState, useMemo, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useQuery} from '@apollo/client'
import {centum} from '../../../shared/libs/libs'
import {changeTitle} from '../../../utils/notifications'
import {getTownsFromStorage} from '../../../utils/storage'
import {classHandler} from '../../../utils/css'
import RouterNavigator from '../../router/RouterNavigator'
import DataPagination from '../../../shared/UI/DataPagination'
import Loading from '../../../shared/UI/Loading'
import MapPicker from '../../../shared/UI/MapPicker'
import {getUniversitiesQ} from './gql/queries'
import {UNIVERSITY_TYPES, UNIVERSITY_FORMATS} from './env'
import {COUNTRIES, SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '../../../env/env'
import {TownType, Cords, MapType} from '../../../env/types'

const Universities: React.FC = () => {
    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())

    const [filtered, setFiltered] = useState<any[]>([])
    const [universities, setUniversities] = useState<any[] | null>(null)
    
    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(UNIVERSITY_TYPES[0])
    const [format, setFormat] = useState<string>(UNIVERSITY_FORMATS[0])
    const [country, setCountry] = useState<string>(COUNTRIES[0])
    const [region, setRegion] = useState<string>(towns[0].translation)
    const [cords, setCords] = useState<Cords>(towns[0].cords)

    const {data, loading} = useQuery(getUniversitiesQ)

    useLayoutEffect(() => {
        changeTitle('Университеты')

        if (data) {
            setUniversities(data.getUniversities)
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
        if (universities !== null) {
            let result: any[] = universities.filter(el => el.country === country && el.region === region)

            if (title.length !== 0) {
                result = result.filter(el => centum.search(el.title, title, SEARCH_PERCENT))
            }

            result = result.filter(el => el.category === category && el.format === format)

            setFiltered(result)
        }
    }, [universities, title, category, format, country, region])

    return (
        <>
            <div className='items small'>
                <div className='item'>
                    <h4 className='pale'>Название</h4>
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Название учебного заведения' type='text' />
                </div>
                <div className='item'>
                    <h4 className='pale'>Регион</h4>
                    <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Населённый пункт' type='text' />
                </div>
            </div>

            <div className='items small'>
                {UNIVERSITY_TYPES.map(el => <div onClick={() => setCategory(el)} className={classHandler(el, category)}>{el}</div>)}
            </div>

            <h4 className='pale'>Страна & Тип</h4>
            <div className='items small'>
                <select value={country} onChange={e => setCountry(e.target.value)}>
                    {COUNTRIES.map(el => <option value={el}>{el}</option>)}
                </select>
                <select value={format} onChange={e => setFormat(e.target.value)}>
                    {UNIVERSITY_FORMATS.map(el => <option value={el}>{el}</option>)}
                </select>
            </div>

            <DataPagination items={filtered} setItems={setFiltered} label='Университеты на карте:' />
 
            {data &&
                <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                    <Marker latitude={cords.lat} longitude={cords.long}>
                        <MapPicker type='picker' />
                    </Marker>

                    {filtered.map(el => 
                        <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                            <RouterNavigator url={`/university/${el.shortid}`}>
                                {centum.shorter(el.title)}
                            </RouterNavigator>
                        </Marker>
                    )}
                </ReactMapGL>
            }

            {loading && <Loading label='Загрузка университетов' />}
        </>
    )
}

export default Universities