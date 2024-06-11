import React, {useLayoutEffect} from 'react'
import {centum} from '../../shared/libs/libs'
import {changeTitle} from '../../utils/notifications'
import RouterNavigator from '../router/RouterNavigator'
import ImageLook from '../../shared/UI/ImageLook'
import features from '../../env/features.json'
import media from '../../env/media.json'

const Welcome: React.FC = () => {

    useLayoutEffect(() => {
        changeTitle('Главная')
    }, [])

    const onView = (url: string) => {
        centum.go(url)
    }

    return (
        <>
            <h2>GoStudy Web</h2>

            <div className='items little'>
                <RouterNavigator url='/login'>
                    <button>Войти</button>
                </RouterNavigator>
                <RouterNavigator url='/register'>
                    <button>Регистрация</button>
                </RouterNavigator>
            </div>           
        
            <h2>О чём платформа?</h2>
            <h4 className='pale'>Коммуникация и погружение в языковую среду</h4>

            <div className='items half'>
                {features.map(el => 
                    <div className='item panel'>
                        {el.title}
                        <p className='pale'>{el.content}</p>
                    </div>
                )}
            </div>

            <h2>Медиа</h2>

            <div className='items little'>
                {media.map(el => <ImageLook onClick={() => onView(el.url)} src={el.image} min={2} max={2} className='icon' />)}
            </div>
        </>
    )
}

export default Welcome