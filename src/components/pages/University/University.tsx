import React, {useState, useContext, useMemo, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {useParams} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import {appendRoute} from '../../../store/slices/RouteSlice'
import {centum, datus} from '../../../shared/libs/libs'
import {AppContext} from '../../../context/AppContext'
import {changeTitle, buildNotification} from '../../../utils/notifications'
import {classHandler} from '../../../utils/css'
import DataPagination from '../../../shared/UI/DataPagination'
import ImageLoader from '../../../shared/UI/ImageLoader'
import ImageLook from '../../../shared/UI/ImageLook'
import CloseIt from '../../../shared/UI/CloseIt'
import Loading from '../../../shared/UI/Loading'
import MapPicker from '../../../shared/UI/MapPicker'
import {getUniversityM, manageUniversityLocationM, updateUniversityInformationM, publishUniveristyFactM} from './gql/mutations'
import {LOCATION_TYPES, PROFILE_STATUSES} from './env'
import {INITIAL_PERCENT, LEVELS, VIEW_CONFIG, MAP_ZOOM, token} from '../../../env/env'
import {ContextType, Cords, MapType} from '../../../env/types'

const University: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)
    const [view, setView] = useState<MapType>(VIEW_CONFIG)

    const [locations, setLocations] = useState<any[]>([])
    const [location, setLocation] = useState<any | null>(null)
    const [fact, setFact] = useState<any | null>(null)
    const [university, setUniversity] = useState<any | null>(null)
    
    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [isTruth, setIsTruth] = useState<boolean>(true)
    const [points, setPoints] = useState<number>(0)
    const [image, setImage] = useState<string>('')

    const dispatch = useDispatch()

    const [state, setState] = useState({
        title: '',
        category: LOCATION_TYPES[0],
        dateUp: datus.now('date'),
        faculty: '',
        competition: INITIAL_PERCENT,
        text: '',
        level: LEVELS[0],
        status: PROFILE_STATUSES[0]
    })

    const {title, category, dateUp, faculty, competition, text, level, status} = state

    // get component
    
    const [getUniversity] = useMutation(getUniversityM, {
        onCompleted(data) {
            setUniversity(data.getUniversity)
        }
    })

    const onUpdateComponent = () => getUniversity({
        variables: {
            id
        }
    })

    // mutations

    const [manageUniversityLocation] = useMutation(manageUniversityLocationM, {
        onCompleted(data) {
            onUpdateComponent()
            buildNotification(data.manageUniversityLocation, 'Университет')
        }
    })

    const [updateUniversityInformation] = useMutation(updateUniversityInformationM, {
        onCompleted(data) {
            onUpdateComponent()
            buildNotification(data.updateUniversityInformation, 'Университет')
        }
    })

    const [publishUniveristyFact] = useMutation(publishUniveristyFactM, {
        onCompleted(data) {
            onUpdateComponent()
            buildNotification(data.publishUniveristyFact, 'Университет')
        }
    })

    useLayoutEffect(() => {
        changeTitle('Университет')

        if (account.shortid !== '') {
            onUpdateComponent()
        }
    }, [account])

    useEffect(() => {
        if (university !== null) {
            setState({...state, faculty: university.faculty, competition: university.competition})

            setCords(university.cords)
        }
    }, [university])

    useEffect(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    useMemo(() => {
        setIsTruth(true)
    }, [fact])

    const onFact = () => {
        if (fact === null) {
            let result = centum.random(university.facts)?.value

            if (result !== undefined) {
                setFact(result)
            }

        } else {
            if (fact.isTruth === isTruth) {
                let award: number = LEVELS.indexOf(fact.level) + 1

                setPoints(points + award)
            }

            setFact(null)
        }
    }

    const onAddRoute = (isUniversity: boolean) => {
        let result = {
            shortid: isUniversity ? university.shortid : location.shortid,
            title: isUniversity ? university.title : location.title, 
            category: isUniversity ? 'университет' : 'локация',
            cords: isUniversity ? university.cords : location.cords
        }
  
        dispatch(appendRoute(result))
    }

    const onManageLocation = (option: string) => {
        manageUniversityLocation({
            variables: {
                name: account.name, id, option, title, category, image, cords, likes: Number(location !== null), dateUp, collId: location !== null ? location.shortid : ''
            }
        })
    }

    const onUpdateInformation = () => {
        updateUniversityInformation({
            variables: {
                name: account.name, id, faculty, competition
            }
        })
    }

    const onPublishFact = () => {
        publishUniveristyFact({
            variables: {
                name: account.name, id, text, level, status, isTruth
            }
        })
    }

    return (
        <>
            {university !== null && 
                <>
                    <h2>{university.title}</h2>

                    <div className='items half'>
                        <h4 className='pale'>Категория: {university.category} ({university.format})</h4>
                        <h4 className='pale'>Основан в {university.century} ({university.country})</h4>
                    </div>

                    <button onClick={() => onAddRoute(true)} className='light'>В маршрут</button>

                    {location === null ?
                            <>
                                <h2>Новое Место</h2>
                                <h4 className='pale'>Отметьте его на карте</h4>

                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Опишите это...' />

                                <div className='items small'>
                                    {LOCATION_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                                </div>

                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManageLocation('create')}>Добавить</button>

                                <DataPagination items={university.locations} setItems={setLocations} label='Места на карте:' />
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setLocation(null)} />

                                {location.image !== '' && <ImageLook src={location.image} className='photo' />}

                                <h2>{location.title} ({location.dateUp})</h2>

                                <button onClick={() => onAddRoute(false)} className='light'>В маршрут</button>

                                <div className='items small'>
                                    <h4 className='pale'>Тип: {location.category}</h4>
                                    <h4 className='pale'><b>{location.likes}</b> лайков</h4>
                                </div>

                                {account.name === location.name ?
                                        <button onClick={() => onManageLocation('delete')}>Удалить</button>
                                    :
                                        <button onClick={() => onManageLocation('like')}>Нравится</button>
                                }
                            </>
                    }

                    <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={university.cords.lat} longitude={university.cords.long}>
                            <MapPicker type='home' />
                        </Marker>

                        {university.cords.lat !== cords.lat &&
                            <Marker latitude={cords.lat} longitude={cords.long}>
                                <MapPicker type='picker' />
                            </Marker>
                        }

                        {locations.map(el => 
                            <Marker onClick={() => setLocation(el)} latitude={el.cords.lat} longitude={el.cords.long}>
                                {centum.shorter(el.title)}
                            </Marker>
                        )}
                    </ReactMapGL>

                    <h4 className='pale'>Немного статистики</h4>

                    <input value={faculty} onChange={e => setState({...state, faculty: e.target.value})} placeholder='Аббревиатура факультета' type='text' />

                    <h4 className='pale'>Конкурс: <b>{competition} человек</b> на место в {faculty}</h4>
                    <input value={competition} onChange={e => setState({...state, competition: parseInt(e.target.value)})} type='range' step={1} />

                    <button onClick={onUpdateInformation}>Обновить</button>

                    {fact === null ?
                            <>
                                <h2>Игра "Правда/Ложь"</h2>
                                <h4 className='pale'>Узнайте что-нибудь интересное</h4>

                                <p>Набрано баллов: {points}</p>

                                <button onClick={onFact}>Сгенерировать</button>

                                <h2>Новый Факт</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Текст...' />

                                <span onClick={() => setIsTruth(!isTruth)}>Позиция: {isTruth ? 'Правда' : 'Ложь'}</span>

                                <h4 className='pale'>Уровень сложности & Статус</h4>
                                <div className='items small'>
                                    <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                                        {LEVELS.map(el => <option value={el}>{el}</option>)}
                                    </select>
                                    <select value={status} onChange={e => setState({...state, status: e.target.value})}>
                                        {PROFILE_STATUSES.map(el => <option value={el}>{el}</option>)}
                                    </select>
                                </div>

                                <button onClick={onPublishFact}>Опубликовать</button>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setFact(null)} />

                                <h2>Факт от {fact.name}</h2>

                                <span>{fact.text}</span>

                                <div className='items small'>       
                                    <h4 className='pale'>Сложность: {fact.level}</h4>
                                    <h4 className='pale'>Статус: {fact.status}</h4>
                                </div>

                                <p onClick={() => setIsTruth(!isTruth)}>Позиция: {isTruth ? 'Правда' : 'Ложь'}</p>

                                <button onClick={onFact}>Проверить</button>
                            </>
                    }
                </> 
            }

            {university === null && <Loading label='Загрузка университета' />}
        </>
    )
}

export default University