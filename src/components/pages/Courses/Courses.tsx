import React, {useLayoutEffect} from 'react'
import {centum} from '../../../shared/libs/libs'
import {changeTitle} from '../../../utils/notifications'
import {COUNTRIES, GOSTUDY_BASE_URL, GOSTUDY_PROGRAM_URL} from '../../../env/env'

const Courses: React.FC = () => {

    useLayoutEffect(() => {
        changeTitle('Учебные программы')
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

            <h2>Страны, где реализуются программы</h2>

            <div className='items half'>
                {COUNTRIES.map(el =>
                    <div className='item card'>
                        {el}
                    </div>
                )}
            </div>

            <h2>О концепции обучения</h2>

            <button onClick={() => onView(false)} className='light'>Подробнее</button>
        </>
    )
}

export default Courses