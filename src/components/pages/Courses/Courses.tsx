import React, {useLayoutEffect} from 'react'
import {centum} from '../../../shared/libs/libs'
import {changeTitle} from '../../../utils/notifications'
import ImageLook from '../../../shared/UI/ImageLook'
import previews from '../../../env/previews.json'
import {GOSTUDY_BASE_URL, GOSTUDY_PROGRAM_URL} from '../../../env/env'

const Courses: React.FC = () => {

    useLayoutEffect(() => {
        changeTitle('Программы')
    }, [])

    const onView = (isProgram: boolean) => {
        centum.go(isProgram ? GOSTUDY_PROGRAM_URL : GOSTUDY_BASE_URL)
    }

    return (
        <>
            <h1>Программы языковой школы GoStudy</h1>

            <span>
                Обучение ведётся в различных форматах, уровень владения языком - B2.
            </span>

            <button onClick={() => onView(true)}>Открыть</button>

            <h2>Последние интервью</h2>

            <div className='items half'>
                {previews.map(el =>
                    <div onClick={() => centum.go(el.link)} className='item part'>
                        <ImageLook src={el.path} className='photo' />
                        <small>{el.title}</small>
                    </div>
                )}
            </div>

            <button onClick={() => onView(false)} className='light'>О концепции</button>
        </>
    )
}

export default Courses