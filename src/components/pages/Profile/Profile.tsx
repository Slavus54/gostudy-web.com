import React, {useState, useContext, useMemo, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {useParams} from 'react-router-dom'
import ProfilePhoto from '../../../assets/photo/profile_photo.jpg'
import {centum} from '../../../shared/libs/libs'
import {AppContext} from '../../../context/AppContext'
import {changeTitle, buildNotification} from '../../../utils/notifications'
import ImageLook from '../../../shared/UI/ImageLook'
import CloseIt from '../../../shared/UI/CloseIt'
import DataPagination from '../../../shared/UI/DataPagination'
import Loading from '../../../shared/UI/Loading'
import MapPicker from '../../../shared/UI/MapPicker'
import {getProfileM, manageProfileAchievementM} from './gql/mutations'
import {TG_ICON, VIEW_CONFIG, MAP_ZOOM, token} from '../../../env/env'
import {ContextType, Cords, MapType} from '../../../env/types'

const Profile: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [view, setView] = useState<MapType>(VIEW_CONFIG)

    const [profile, setProfile] = useState<any | null>(null)
    const [achievements, setAchievements] = useState<any[]>([])
    const [achievement, setAchievement] = useState<any | null>(null)

    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [likes, setLikes] = useState<number>(0)
    const [image, setImage] = useState<string>('')

    // get component

    const [getProfile] = useMutation(getProfileM, {
        onCompleted(data) {
            setProfile(data.getProfile)
        }
    })

    const onUpdateComponent = () => getProfile({
        variables: {
            id
        }
    })

    // mutations 

    const [manageProfileAchievement] = useMutation(manageProfileAchievementM, {
        onCompleted(data) {
            onUpdateComponent()
            buildNotification(data.manageProfileAchievement)
        }
    })

    useLayoutEffect(() => {
        changeTitle('Пользователь')

        if (account.shortid != '') {
            onUpdateComponent()
        }
    }, [account])

    useEffect(() => {
        if (profile !== null) {
            setCords(profile.cords)
            setImage(profile.image === '' ? ProfilePhoto : profile.image)
        }
    }, [profile])

    useEffect(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    useMemo(() => {
        if (achievement !== null) {
            setLikes(achievement.likes)
        }
    }, [achievement])

    const onView = () => {
        centum.go(profile.telegram, 'telegram')
    }

    const onLike = () => {
        manageProfileAchievement({
            variables: {
                id: profile.shortid, option: 'like', title: '', category: '', url: '', image: '', likes: 1, dateUp: '', collId: achievement.shortid
            }
        })

        setLikes(achievement.likes + 1)
    }

    return (
        <div className='main page'>
            {profile !== null && account.shortid !== profile.shortid &&
                <>
                    <ImageLook src={image} min={16} max={18} className='photo' alt="account's photo" />
                    <h3>{profile.name}</h3> 

                    <ImageLook onClick={onView} src={TG_ICON} min={2} max={2} className='icon' />

                    <div className='items small'>
                        <h4 className='pale'>Страна: {profile.country}</h4>
                        <h4 className='pale'>Стадия: {profile.stage}</h4>
                    </div>

                    <ReactMapGL {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>
                    </ReactMapGL>

                    <span>Пользователь был в сети {profile.timestamp}</span>

                    {achievement === null ?
                            <>
                                <DataPagination items={profile.achievements} setItems={setAchievements} label='Список достижений:' />
                                <div className='items half'>
                                    {achievements.map(el => 
                                        <div onClick={() => setAchievement(el)} className='item card'>
                                            {centum.shorter(el.title)}
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setAchievement(null)} />

                                {achievement.image !== '' && <ImageLook src={achievement.image} className='photo' />}

                                <h2>{achievement.title} ({achievement.dateUp})</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Категория: {achievement.category}</h4>
                                    <h4 className='pale'><b>{likes}</b> лайков</h4>
                                </div> 

                                <button onClick={onLike}>Нравится</button> 
                            </>
                    }
                </>
            }

            {profile === null && <Loading label='Загрузка пользователя' />}
        </div>
    )
}

export default Profile