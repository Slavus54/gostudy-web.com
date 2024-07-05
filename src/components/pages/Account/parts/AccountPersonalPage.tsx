import React, {useState, useEffect, useLayoutEffect} from 'react'
import {useMutation} from '@apollo/client'
import ProfilePhoto from '../../../../assets/photo/profile_photo.jpg'
import ImageLoader from '../../../../shared/UI/ImageLoader'
import ImageLook from '../../../../shared/UI/ImageLook'
import {onUpdateTheme} from '../../../../utils/storage'
import {updateProfileInfo} from '../../../../utils/storage'
import {buildNotification} from '../../../../utils/notifications'
import {updateProfilePersonalInfoM} from '../gql/mutations'
import {THEME_KEY, THEMES, COUNTRIES, STAGES} from '../../../../env/env'
import {AccountPropsType} from '../../../../env/types'

const AccountPersonalPage: React.FC<AccountPropsType> = ({profile}) => {
    const [theme, setTheme] = useState<string>(localStorage.getItem(THEME_KEY) ?? THEMES[0])
    const [image, setImage] = useState<string>('')

    const [state, setState] = useState({
        country: profile.country, 
        stage: profile.stage
    })

    const {country, stage} = state

    useLayoutEffect(() => {
        if (profile !== null) {
            setImage(profile.image === '' ? ProfilePhoto : profile.image)
        }


    }, [profile])

    useEffect(() => {
        const navbar = document.querySelector('.navbar')

        navbar.className = `navbar ${theme}`

        onUpdateTheme(theme)        
    }, [theme])

    const [updateProfilePersonalInfo] = useMutation(updateProfilePersonalInfoM, {
        onCompleted(data) {
            buildNotification(data.updateProfilePersonalInfo)
            updateProfileInfo(null)
        }
    })

    const onUpdate = () => {
        updateProfilePersonalInfo({
            variables: {
                id: profile.shortid, country, stage, image
            }
        })
    }

    return (
        <>
            <ImageLook src={image} min={16} max={18} className='photo' alt="account's photo" />
            <h3>{profile.name}</h3> 
            
            <div className='items small'>
                <select value={country} onChange={e => setState({...state, country: e.target.value})}>
                    {COUNTRIES.map(el => <option value={el}>{el}</option>)}
                </select>
                <select value={stage} onChange={e => setState({...state, stage: e.target.value})}>
                    {STAGES.map(el => <option value={el}>{el}</option>)}
                </select>
            </div>

            <ImageLoader setImage={setImage} />

            <button onClick={onUpdate}>Обновить</button>

            <select value={theme} onChange={e => setTheme(e.target.value)} className='theme-picker'>
                {THEMES.map(el => <option value={el}>{el}</option>)}
            </select>
        </>
    )
}

export default AccountPersonalPage