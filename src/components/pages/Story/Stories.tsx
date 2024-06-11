import React, {useState, useMemo, useLayoutEffect} from 'react'
import {useQuery} from '@apollo/client'
import {centum} from '../../../shared/libs/libs'
import {changeTitle} from '../../../utils/notifications'
import {classHandler} from '../../../utils/css'
import RouterNavigator from '../../router/RouterNavigator'
import DataPagination from '../../../shared/UI/DataPagination'
import Loading from '../../../shared/UI/Loading'
import {getStoriesQ} from './gql/queries'
import {COUNTRIES, SEARCH_PERCENT} from '../../../env/env'
import {STORY_TYPES, STORY_STATUSES} from './env'

const Stories: React.FC = () => {
    const [filtered, setFiltered] = useState<any[]>([])
    const [stories, setStories] = useState<any[] | null>(null)
    
    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(STORY_TYPES[0])
    const [country, setCountry] = useState<string>(COUNTRIES[0])
    const [status, setStatus] = useState<string>(STORY_STATUSES[0])

    const {data, loading} = useQuery(getStoriesQ)

    useLayoutEffect(() => {
        changeTitle('Истории')

        if (data) {
            setStories(data.getStories)
        }
    }, [data])
    
    useMemo(() => {
        if (stories !== null) {
            let result: any[] = stories.filter(el => el.category === category && el.country === country)

            if (title.length !== 0) {
                result = result.filter(el => centum.search(el.title, title, SEARCH_PERCENT))
            }

            result = result.filter(el => el.status === status)

            setFiltered(result)
        }
    }, [stories, title, category, country, status])

    return (
        <>
            <h4 className='pale'>Название</h4>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Название истории' type='text' />

            <div className='items small'>
                {STORY_TYPES.map(el => <div onClick={() => setCategory(el)} className={classHandler(el, category)}>{el}</div>)}
            </div>
            
            <h4 className='pale'>Страна & Статус</h4>

            <div className='items small'>
                <select value={country} onChange={e => setCountry(e.target.value)}>
                    {COUNTRIES.map(el => <option value={el}>{el}</option>)}
                </select>
                <select value={status} onChange={e => setStatus(e.target.value)}>
                    {STORY_STATUSES.map(el => <option value={el}>{el}</option>)}
                </select>
            </div>

            <DataPagination items={filtered} setItems={setFiltered} label='Истории:' />
 
            {data &&
                <div className='items half'>
                    {filtered.map(el => 
                        <div className='item card'>
                            <RouterNavigator url={`/story/${el.shortid}`}>
                                {centum.shorter(el.title)}
                            </RouterNavigator>
                        </div>
                    )}
                </div>
            }

            {loading && <Loading label='Загрузка истории' />}
        </>
    )
}

export default Stories