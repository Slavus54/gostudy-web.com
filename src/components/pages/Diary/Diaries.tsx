import React, {useState, useMemo, useLayoutEffect} from 'react'
import {useQuery} from '@apollo/client'
import {centum} from '../../../shared/libs/libs'
import {changeTitle} from '../../../utils/notifications'
import {classHandler} from '../../../utils/css'
import RouterNavigator from '../../router/RouterNavigator'
import DataPagination from '../../../shared/UI/DataPagination'
import Loading from '../../../shared/UI/Loading'
import {getDiariesQ} from './gql/queries'
import {COUNTRIES, SEARCH_PERCENT} from '../../../env/env'
import {DIARY_TYPES, LANG_LEVELS} from './env'

const Diaries: React.FC = () => {
    const [filtered, setFiltered] = useState<any[]>([])
    const [diaries, setDiaries] = useState<any[] | null>(null)
    
    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(DIARY_TYPES[0])
    const [country, setCountry] = useState<string>(COUNTRIES[0])
    const [level, setLevel] = useState<string>(LANG_LEVELS[0])

    const {data, loading} = useQuery(getDiariesQ)

    useLayoutEffect(() => {
        changeTitle('Дневники')

        if (data) {
            setDiaries(data.getDiaries)
        }
    }, [data])
    
    useMemo(() => {
        if (diaries !== null) {
            let result: any[] = diaries.filter(el => el.category === category && el.level === level)

            if (title.length !== 0) {
                result = result.filter(el => centum.search(el.title, title, SEARCH_PERCENT))
            }

            result = result.filter(el => el.country === country)

            setFiltered(result)
        }
    }, [diaries, title, category, country, level])

    return (
        <>
            <h4 className='pale'>Название</h4>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Название дневника' type='text' />

            <div className='items small'>
                {DIARY_TYPES.map(el => <div onClick={() => setCategory(el)} className={classHandler(el, category)}>{el}</div>)}
            </div>
            
            <h4 className='pale'>Страна & Язык</h4>

            <div className='items small'>
                <select value={country} onChange={e => setCountry(e.target.value)}>
                    {COUNTRIES.map(el => <option value={el}>{el}</option>)}
                </select>
                <select value={level} onChange={e => setLevel(e.target.value)}>
                    {LANG_LEVELS.map(el => <option value={el}>{el}</option>)}
                </select>
            </div>

            <DataPagination items={filtered} setItems={setFiltered} label='Дневники:' />
 
            {data &&
                <div className='items half'>
                    {filtered.map(el => 
                        <div className='item card'>
                            <RouterNavigator url={`/diary/${el.shortid}`}>
                                {centum.shorter(el.title)}
                            </RouterNavigator>
                        </div>
                    )}
                </div>
            }

            {loading && <Loading label='Загрузка дневников' />}
        </>
    )
}

export default Diaries