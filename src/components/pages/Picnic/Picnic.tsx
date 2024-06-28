import React, {useState, useContext, useMemo, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {useParams} from 'react-router-dom'
import {centum, datus} from '../../../shared/libs/libs'
import {AppContext} from '../../../context/AppContext' 
import {getWeatherAPI} from '../../../utils/weather' 
import {changeTitle, buildNotification} from '../../../utils/notifications'
import {classHandler} from '../../../utils/css'
import RouterNavigator from '../../router/RouterNavigator'
import DataPagination from '../../../shared/UI/DataPagination'
import ImageLoader from '../../../shared/UI/ImageLoader'
import ImageLook from '../../../shared/UI/ImageLook'
import CloseIt from '../../../shared/UI/CloseIt'
import Loading from '../../../shared/UI/Loading'
import MapPicker from '../../../shared/UI/MapPicker'
import {getPicnicM, managePicnicStatusM, offerPicnicThemeM, managePicnicDishM} from './gql/mutations'
import {ROLES, DISH_TYPES, THEME_TYPES} from './env'
import {INITIAL_PERCENT, CURRENCY, VIEW_CONFIG, MAP_ZOOM, token} from '../../../env/env'
import {ContextType, TownType, Cords, MapType} from '../../../env/types'

const Picnic: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)
    const [view, setView] = useState<MapType>(VIEW_CONFIG)

    const [picnic, setPicnic] = useState<any | null>(null)
    const [members, setMembers] = useState<any[]>([])
    const [personality, setPersonality] = useState<any | null>(null)
    const [dishes, setDishes] = useState<any[]>([])
    const [dish, setDish] = useState<any | null>(null)
    const [theme, setTheme] = useState<any | null>(null)
    
    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [weatherItems, setWeatherItems] = useState<string[]>([])
    const [image, setImage] = useState<string>('')

    const [state, setState] = useState({
        role: ROLES[0],
        text: '',
        format: THEME_TYPES[0],
        dateUp: datus.now('date'),
        title: '',
        category: DISH_TYPES[0],
        cost: INITIAL_PERCENT
    })

    const {role, text, format, dateUp, title, category, cost} = state

    // get component

    const [getPicnic] = useMutation(getPicnicM, {
        onCompleted(data) {
            setPicnic(data.getPicnic)
        }
    })

    const onUpdateComponent = () => getPicnic({
        variables: {
            id
        }
    })

    // mutations

    const [managePicnicStatus] = useMutation(managePicnicStatusM, {
        onCompleted(data) {
            onUpdateComponent()
            buildNotification(data.managePicnicStatus, 'Пикник')
        }
    })

    const [offerPicnicTheme] = useMutation(offerPicnicThemeM, {
        onCompleted(data) {
            onUpdateComponent()
            buildNotification(data.offerPicnicTheme, 'Пикник')
        }
    })

    const [managePicnicDish] = useMutation(managePicnicDishM, {
        onCompleted(data) {
            onUpdateComponent()
            buildNotification(data.managePicnicDish, 'Пикник')
        }
    })

    useLayoutEffect(() => {
        changeTitle('Пикник')

        if (account.shortid !== '') {
            onUpdateComponent()
        }
    }, [account])

    useEffect(() => {
        if (picnic !== null) {
            let result = picnic.members.find(el => centum.search(el.shortid, account.shortid, 1e2))

            if (result !== undefined) {
                setPersonality(result)
            }

            getWeatherAPI(picnic.cords.lat, picnic.cords.long, false).then(data => {
                let result: string[] = data.list.map(el => el.weather[0].main).slice(0, 3)

                setWeatherItems(result)
            })

            setCords(picnic.cords)
        }
    }, [picnic])

    useEffect(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    useMemo(() => {
        if (personality !== null) {
            setState({...state, role: personality.role})
        }
    }, [personality])

    const onTheme = () => {
        let result = centum.random(picnic.themes)?.value

        if (result !== undefined) {
            setTheme(result)
        }
    }

    const onManageStatus = (option: string) => {
        managePicnicStatus({
            variables: {
                name: theme.name, id, option, role
            }
        })
    }

    const onOfferTheme = () => {
        offerPicnicTheme({
            variables: {
                name: theme.name, id, text, format, dateUp
            }
        })
    }

    const onManageDish = (option: string) => {
        managePicnicDish({
            variables: {
                name: theme.name, id, option, title, category, cost, image, likes: Number(dish !== null), collId: dish !== null ? dish.shortid : ''
            }
        })
    } 

    return (
        <>
            {picnic !== null &&
                <>
                    <h2>{picnic.title}</h2>

                    <div className='items small'>
                        <h4 className='pale'>Язык: {picnic.language}</h4>
                        <h4 className='pale'>Уровень: {picnic.level}</h4>
                    </div>  

                    <span>Время: {picnic.dateUp} в {picnic.time}</span>

                    <h4 className='pale'>Прогноз погоды на каждые 3 часа</h4>
                    <div className='items small'>
                        {weatherItems.map(el => <h5>{el}</h5>)}
                    </div>

                    <ReactMapGL {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>
                    </ReactMapGL>

                    <h4 className='pale'>Ваша роль</h4>
                    <select value={role} onChange={e => setState({...state, role: e.target.value})}>
                        {ROLES.map(el => <option value={el}>{el}</option>)}
                    </select>

                    {personality === null ? 
                            <button onClick={() => onManageStatus('join')}>Присоединиться</button>
                        :
                            <button onClick={() => onManageStatus('update')}>Обновить</button>
                    }
                </>   
            }

            {picnic !== null && personality !== null &&
                <>
                    {dish === null ?
                            <>
                                <h2>Новый Рецепт</h2>
                                <h4 className='pale'>Поделитесь своими кулинарными идеями</h4>

                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название блюда...' />

                                <div className='items small'>
                                    {DISH_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                                </div>

                                <h4 className='pale'>Стоимость приготовления: <b>{cost}{CURRENCY}</b></h4>
                                <input value={cost} onChange={e => setState({...state, cost: parseInt(e.target.value)})} type='range' step={1} />

                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManageDish('create')}>Добавить</button>

                                <DataPagination items={picnic.dishes} setItems={setDishes} label='Меню блюд:' />
                                <div className='items half'>
                                    {dishes.map(el => 
                                        <div onClick={() => setDish(el)} className='item panel'>
                                            {centum.shorter(el.title)}
                                            <p className='pale'>{el.category}</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setDish(null)} />

                                {dish.image !== '' && <ImageLook src={dish.image} className='photo' />}
                                
                                <h2>{dish.title} ({dish.cost}{CURRENCY})</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Тип: {dish.category}</h4>
                                    <h4 className='pale'><b>{dish.likes}</b> лайков</h4>
                                </div>

                                {account.name === dish.name ?   
                                        <button onClick={() => onManageDish('delete')}>Удалить</button>
                                    :
                                        <button onClick={() => onManageDish('like')}>Нравиться</button>
                                }
                            </>
                    }

                    {theme === null ?
                            <>
                                <h2>Новая Тема</h2>
                                <h4 className='pale'>Практикуйте язык на определенную тему</h4>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Опишите это...' />

                                <h4 className='pale'>Возможный собеседник</h4>
                                <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                                    {THEME_TYPES.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <div className='items little'>
                                    <button onClick={onTheme}>Узнать</button>
                                    <button onClick={onOfferTheme}>Предложить</button>
                                </div>
                            </>
                        :
                            <>
                                <h2>Тема для практики от {theme.name}</h2>

                                <span>О чём будем говорить: {theme.text}</span>

                                <div className='items small'>
                                    <h4 className='pale'>Собеседник: {theme.format}</h4>
                                    <h4 className='pale'>Опубликовано {theme.dateUp}</h4>
                                </div>

                                <button onClick={() => setTheme(null)}>Понятно</button>
                            </>
                    }

                    <DataPagination items={picnic.members} setItems={setMembers} label='Участники мероприятия:' />
                    <div className='items half'>
                        {members.map(el => 
                            <div  className='item card'>
                                <RouterNavigator url={`/profile/${el.shortid}`}>{centum.shorter(el.name)}</RouterNavigator>
                                <p className='pale'>{el.role}</p>
                            </div>
                        )}
                    </div> 

                    <button onClick={() => onManageStatus('exit')}>Выйти</button>                   
                </>
            }

            {picnic === null && <Loading label='Загрузка пикника' />}
        </>
    )
}

export default Picnic