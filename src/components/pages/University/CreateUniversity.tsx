import React, {useState, useContext, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {useParams} from 'react-router-dom'
import {centum} from '../../../shared/libs/libs'
import {AppContext} from '../../../context/AppContext'
import {changeTitle, buildNotification} from '../../../utils/notifications'
import {getTownsFromStorage, updateProfileInfo} from '../../../utils/storage'
import {classHandler} from '../../../utils/css'
import FormPagination from '../../../shared/UI/FormPagination'
import MapPicker from '../../../shared/UI/MapPicker'
import {createUniversityM} from './gql/mutations'
import {UNIVERSITY_TYPES, UNIVERSITY_FORMATS, CENTURIES} from './env'
import {COUNTRIES, INITIAL_PERCENT, SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '../../../env/env'
import {ContextType, TownType, MapType} from '../../../env/types'

const CreateUniversity: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)
    const [view, setView] = useState<MapType>(VIEW_CONFIG)

    const [towns] = useState<TownType[]>(getTownsFromStorage())
    
    const [state, setState] = useState({
        title: '', 
        category: UNIVERSITY_TYPES[0], 
        country: CENTURIES[0], 
        format: UNIVERSITY_FORMATS[0], 
        century: CENTURIES[0],
        region: towns[0].translation, 
        cords: towns[0].cords,
        faculty: '', 
        competition: INITIAL_PERCENT
    })

    const {title, category, country, format, century, region, cords, faculty, competition} = state

    useLayoutEffect(() => {
        changeTitle('Новый Университет')
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

    const [createUniversity] = useMutation(createUniversityM, {
        onCompleted(data) {
            buildNotification(data.createUniversity)
            updateProfileInfo(null)
        }
    })
  
    const onCreate = () => {
        createUniversity({
            variables: {
                name: account.name, id, title, category, country, format, century, region, cords, faculty, competition
            }
        })
    }

    return (
        <>
            <FormPagination items={[
                <>  
                    <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название учебного заведения...' />
                    
                    <div className='items small'>
                        {UNIVERSITY_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                    </div>

                    <h4 className='pale'>Страна & Тип & Век</h4>
                    <div className='items small'>
                        <select value={country} onChange={e => setState({...state, country: e.target.value})}>
                            {COUNTRIES.map(el => <option value={el}>{el}</option>)}
                        </select>
                        <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                            {UNIVERSITY_FORMATS.map(el => <option value={el}>{el}</option>)}
                        </select>
                        <select value={century} onChange={e => setState({...state, century: e.target.value})}>
                            {CENTURIES.map(el => <option value={el}>{el}</option>)}
                        </select>
                    </div>

                    <h4 className='pale'>Немного статистики</h4>

                    <input value={faculty} onChange={e => setState({...state, faculty: e.target.value})} placeholder='Аббревиатура факультета' type='text' />

                    <h4 className='pale'>Конкурс: <b>{competition} человек</b> на место в {faculty}</h4>
                    <input value={competition} onChange={e => setState({...state, competition: parseInt(e.target.value)})} type='range' step={1} />
                </>,
                <>
                    <h4 className='pale'>Найдите регион</h4>
                    <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Населённый пункт' type='text' />
                    
                    <ReactMapGL onClick={e => setState({...state, cords: centum.mapboxCords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>
                    </ReactMapGL> 
                </>
            ]}>
                <h2>Новый Университет</h2>
            </FormPagination>  
            
            <button onClick={onCreate}>Добавить</button>
        </>
    )
}

export default CreateUniversity