import React, {useState, useContext, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {centum, datus} from '../../../shared/libs/libs'
import {AppContext} from '../../../context/AppContext'
import {registerNotification, changeTitle} from '../../../utils/notifications'
import {updateSession, getTownsFromStorage} from '../../../utils/storage'
import FormPagination from '../../../shared/UI/FormPagination'
import ImageLoader from '../../../shared/UI/ImageLoader'
import ImageLook from '../../../shared/UI/ImageLook'
import MapPicker from '../../../shared/UI/MapPicker'
import {registerProfileM} from './gql/mutations'
import {COUNTRIES, STAGES, TG_ICON, SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '../../../env/env'
import {ContextType, TownType, MapType} from '../../../env/types'

const Register: React.FC = () => {
    const {accountUpdate} = useContext<ContextType>(AppContext)
    const [view, setView] = useState<MapType>(VIEW_CONFIG)

    const [towns] = useState<TownType[]>(getTownsFromStorage())
    const [image, setImage] = useState<string>('')
    
    const [state, setState] = useState({
        name: '',
        password: '', 
        telegram: '', 
        country: COUNTRIES[0], 
        stage: STAGES[0],
        region: towns[0].translation, 
        cords: towns[0].cords
    })

    const {name, password, telegram, country, stage, region, cords} = state

    useLayoutEffect(() => {
        changeTitle('Новый Аккаунт')
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

    const [registerProfile] = useMutation(registerProfileM, {
        onCompleted(data) {
            accountUpdate('update', data.registerProfile, 3)
            registerNotification()
            updateSession(data.registerProfile.name)
        }
    })

    const onRegister = () => {
        registerProfile({
            variables: {
                name, password, telegram, country, stage, region, cords, image, timestamp: datus.now(), budget: 0
            }
        })
    }

    return (
        <>
            <FormPagination items={[
                <>
                    <div className='items small'>
                        <input value={name} onChange={e => setState({...state, name: e.target.value})} placeholder='Ваше полное имя' type='text' />
                        <input value={password} onChange={e => setState({...state, password: e.target.value})} placeholder='Пароль' type='text' />  
                    </div>

                    <ImageLook src={TG_ICON} min={2} max={2} className='icon' />
                    <input value={telegram} onChange={e => setState({...state, telegram: e.target.value})} placeholder='Telegram' type='text' />

                    <h4 className='pale'>Страна & Стадия</h4>
                    <div className='items small'>
                        <select value={country} onChange={e => setState({...state, country: e.target.value})}>
                            {COUNTRIES.map(el => <option value={el}>{el}</option>)}
                        </select>
                        <select value={stage} onChange={e => setState({...state, stage: e.target.value})}>
                            {STAGES.map(el => <option value={el}>{el}</option>)}
                        </select>
                    </div>
                </>,
                <>
                    <h4 className='pale'>Найдите регион</h4>
                    <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Населённый пункт' type='text' />
                    
                    <ReactMapGL onClick={e => setState({...state, cords: centum.mapboxCords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>
                    </ReactMapGL> 
                
                    <ImageLoader setImage={setImage} />  
                </>
            ]}>
                <h2>Новый Аккаунт</h2>
            </FormPagination>  
            
            <button onClick={onRegister}>Создать</button>
        </>
    )
}

export default Register