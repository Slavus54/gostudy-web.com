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
import {getPicnicsQ} from './gql/queries'
import {PICNIC_TYPES, STUDY_LEVELS} from './env'
import {LANGUAGES, SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '../../../env/env'
import {TownType, Cords, MapType} from '../../../env/types'

const Picnics: React.FC = () => {
    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())

    const [filtered, setFiltered] = useState<any[]>([])
    const [picnics, setPicnics] = useState<any[] | null>(null)
    
    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(PICNIC_TYPES[0])
    const [language, setLanguage] = useState<string>(LANGUAGES[0])
    const [level, setLevel] = useState<string>(STUDY_LEVELS[0])
    const [region, setRegion] = useState<string>(towns[0].translation)
    const [cords, setCords] = useState<Cords>(towns[0].cords)

    const {data, loading} = useQuery(getPicnicsQ)

    useLayoutEffect(() => {
        changeTitle('Пикники')

        if (data) {
            setPicnics(data.getPicnics)
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
        if (picnics !== null) {
            let result: any[] = picnics.filter(el => el.language === language && el.region === region)

            if (title.length !== 0) {
                result = result.filter(el => centum.search(el.title, title, SEARCH_PERCENT))
            }

            result = result.filter(el => el.category === category && el.level === level)

            setFiltered(result)
        }
    }, [picnics, title, category, language, level, region])

    return (
        <>
            <div className='items small'>
                <div className='item'>
                    <h4 className='pale'>Название</h4>
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Название мероприятия' type='text' />
                </div>
                <div className='item'>
                    <h4 className='pale'>Регион</h4>
                    <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Населённый пункт' type='text' />
                </div>
            </div>

            <div className='items small'>
                {PICNIC_TYPES.map(el => <div onClick={() => setCategory(el)} className={classHandler(el, category)}>{el}</div>)}
            </div>

            <h4 className='pale'>Язык & Уровень владения</h4>
            <div className='items small'>
                <select value={language} onChange={e => setLanguage(e.target.value)}>
                    {LANGUAGES.map(el => <option value={el}>{el}</option>)}
                </select>
                <select value={level} onChange={e => setLevel(e.target.value)}>
                    {STUDY_LEVELS.map(el => <option value={el}>{el}</option>)}
                </select>
            </div>

            <DataPagination items={filtered} setItems={setFiltered} label='Пикники на карте:' />
 
            {data &&
                <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                    <Marker latitude={cords.lat} longitude={cords.long}>
                        <MapPicker type='picker' />
                    </Marker>

                    {filtered.map(el => 
                        <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                            <RouterNavigator url={`/picnic/${el.shortid}`}>
                                {centum.shorter(el.title)}
                            </RouterNavigator>
                        </Marker>
                    )}
                </ReactMapGL>
            }

            {loading && <Loading label='Загрузка пикников' />}
        </>
    )
}

export default Picnics