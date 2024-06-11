import React, {useState, useContext, useMemo, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {useParams} from 'react-router-dom'
import {centum, datus, maxMinutes} from '../../../shared/libs/libs'
import {AppContext} from '../../../context/AppContext'
import {changeTitle, buildNotification} from '../../../utils/notifications'
import {getTownsFromStorage, updateProfileInfo} from '../../../utils/storage'
import {classHandler} from '../../../utils/css'
import FormPagination from '../../../shared/UI/FormPagination'
import MapPicker from '../../../shared/UI/MapPicker'
import CounterView from '../../../shared/UI/CounterView'
import {createPicnicM} from './gql/mutations'
import {PICNIC_TYPES, STUDY_LEVELS, ROLES} from './env'
import {LANGUAGES, DATES_LENGTH, TIME_PART, SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '../../../env/env'
import {ContextType, TownType, MapType} from '../../../env/types'

const CreatePicnic: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)
    const [view, setView] = useState<MapType>(VIEW_CONFIG)

    const [towns] = useState<TownType[]>(getTownsFromStorage())
    const [dates] = useState<string[]>(datus.dates('day', DATES_LENGTH))
    const [timer, setTimer] = useState<number>(maxMinutes / 2)
    
    const [state, setState] = useState({
        title: '', 
        category: PICNIC_TYPES[0], 
        language: LANGUAGES[0], 
        level: STUDY_LEVELS[0], 
        dateUp: dates[0], 
        time: '',
        region: towns[0].translation, 
        cords: towns[0].cords,
        role: ROLES[0]
    })

    const {title, category, language, level, dateUp, time, region, cords, role} = state

    useLayoutEffect(() => {
        changeTitle('Новый Пикник')
    }, [])

    useEffect(() => {
        if (region.length !== 0) {
            let result = towns.find(el => centum.search(el.translation, region, SEARCH_PERCENT))

            if (result !== undefined) {
                setState({...state, region: result.translation, cords: result.cords})
            }
        }
    }, [region])

    useEffect(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    useMemo(() => {
        let result: string = datus.time(timer)

        setState({...state, time: result})
    }, [timer])

    const [createPicnic] = useMutation(createPicnicM, {
        onCompleted(data) {
            buildNotification(data.createPicnic)
            updateProfileInfo(null)
        }
    })
  
    const onCreate = () => {
        createPicnic({
            variables: {
                name: account.name, id, title, category, language, level, dateUp, time, region, cords, role
            }
        })
    }

    return (
        <>
            <FormPagination items={[
                <>  
                    <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название мероприятия...' />
                    
                    <div className='items small'>
                        {PICNIC_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                    </div>

                    <h4 className='pale'>Язык & Уровень владения</h4>
                    <div className='items small'>
                        <select value={language} onChange={e => setState({...state, language: e.target.value})}>
                            {LANGUAGES.map(el => <option value={el}>{el}</option>)}
                        </select>
                        <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                            {STUDY_LEVELS.map(el => <option value={el}>{el}</option>)}
                        </select>
                    </div>

                    <div className='items small'>
                        {dates.map(el => <div onClick={() => setState({...state, dateUp: el})} className={classHandler(el, dateUp)}>{el}</div>)}
                    </div>
                
                    <CounterView num={timer} setNum={setTimer} part={TIME_PART} min={maxMinutes / 3} max={maxMinutes}>
                        Начало в {time}
                    </CounterView>
                </>,
                <>
                    <h4 className='pale'>Найдите регион</h4>
                    <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Населённый пункт' type='text' />

                    <h4 className='pale'>Ваша роль</h4>
                    <select value={role} onChange={e => setState({...state, role: e.target.value})}>
                        {ROLES.map(el => <option value={el}>{el}</option>)}
                    </select>
                    
                    <ReactMapGL onClick={e => setState({...state, cords: centum.mapboxCords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>
                    </ReactMapGL> 
                </>
            ]}>
                <h2>Новый Пикник</h2>
            </FormPagination>  
            
            <button onClick={onCreate}>Организовать</button>
        </>
    )
}

export default CreatePicnic