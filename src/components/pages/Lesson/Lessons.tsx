import React, {useState, useMemo, useLayoutEffect} from 'react'
import {useQuery} from '@apollo/client'
import {centum} from '../../../shared/libs/libs'
import {changeTitle} from '../../../utils/notifications'
import {classHandler} from '../../../utils/css'
import RouterNavigator from '../../router/RouterNavigator'
import DataPagination from '../../../shared/UI/DataPagination'
import Loading from '../../../shared/UI/Loading'
import {getLessonsQ} from './gql/queries'
import {LANGUAGES, SEARCH_PERCENT} from '../../../env/env'
import {LESSON_TYPES, SOURCE_TYPES} from './env'

const Lessons: React.FC = () => {
    const [filtered, setFiltered] = useState<any[]>([])
    const [lessons, setLessons] = useState<any[] | null>(null)
    
    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(LESSON_TYPES[0])
    const [format, setFormat] = useState<string>(SOURCE_TYPES[0])
    const [language, setLanguage] = useState<string>(LANGUAGES[0])

    const {data, loading} = useQuery(getLessonsQ)

    useLayoutEffect(() => {
        changeTitle('Занятия')

        if (data) {
            setLessons(data.getLessons)
        }
    }, [data])
    
    useMemo(() => {
        if (lessons !== null) {
            let result: any[] = lessons.filter(el => el.category === category && el.language === language)

            if (title.length !== 0) {
                result = result.filter(el => centum.search(el.title, title, SEARCH_PERCENT))
            }

            result = result.filter(el => el.format === format)

            setFiltered(result)
        }
    }, [lessons, title, category, format, language])

    return (
        <>
            <h4 className='pale'>Название</h4>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Название занятия' type='text' />

            <div className='items small'>
                {LESSON_TYPES.map(el => <div onClick={() => setCategory(el)} className={classHandler(el, category)}>{el}</div>)}
            </div>
            
            <h4 className='pale'>Источник & Язык</h4>

            <div className='items small'>
                <select value={format} onChange={e => setFormat(e.target.value)}>
                    {SOURCE_TYPES.map(el => <option value={el}>{el}</option>)}
                </select>
                <select value={language} onChange={e => setLanguage(e.target.value)}>
                    {LANGUAGES.map(el => <option value={el}>{el}</option>)}
                </select>
            </div>

            <DataPagination items={filtered} setItems={setFiltered} label='Занятия:' />
 
            {data &&
                <div className='items half'>
                    {filtered.map(el => 
                        <div className='item card'>
                            <RouterNavigator url={`/lesson/${el.shortid}`}>
                                {centum.shorter(el.title)}
                            </RouterNavigator>
                        </div>
                    )}
                </div>
            }

            {loading && <Loading label='Загрузка занятий' />}
        </>
    )
}

export default Lessons