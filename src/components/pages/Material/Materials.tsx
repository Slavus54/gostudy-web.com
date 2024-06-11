import React, {useState, useMemo, useLayoutEffect} from 'react'
import {useQuery} from '@apollo/client'
import {centum} from '../../../shared/libs/libs'
import {changeTitle} from '../../../utils/notifications'
import {classHandler} from '../../../utils/css'
import RouterNavigator from '../../router/RouterNavigator'
import DataPagination from '../../../shared/UI/DataPagination'
import CounterView from '../../../shared/UI/CounterView'
import Loading from '../../../shared/UI/Loading'
import {getMaterialsQ} from './gql/queries'
import {SEARCH_PERCENT} from '../../../env/env'
import {MATERIAL_TYPES, COURSE_LIMIT} from './env'

const Materials: React.FC = () => {
    const [filtered, setFiltered] = useState<any[]>([])
    const [materials, setMaterials] = useState<any[] | null>(null)
    
    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(MATERIAL_TYPES[0])
    const [course, setCourse] = useState<number>(COURSE_LIMIT / 2)

    const {data, loading} = useQuery(getMaterialsQ)

    useLayoutEffect(() => {
        changeTitle('Материалы')

        if (data) {
            setMaterials(data.getMaterials)
        }
    }, [data])
    
    useMemo(() => {
        if (materials !== null) {
            let result: any[] = materials.filter(el => el.category === category)

            if (title.length !== 0) {
                result = result.filter(el => centum.search(el.title, title, SEARCH_PERCENT))
            }

            result = result.filter(el => el.course === course)

            setFiltered(result)
        }
    }, [materials, title, category, course])

    return (
        <>
            <h4 className='pale'>Название</h4>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Название материала' type='text' />

            <div className='items small'>
                {MATERIAL_TYPES.map(el => <div onClick={() => setCategory(el)} className={classHandler(el, category)}>{el}</div>)}
            </div>

            <CounterView num={course} setNum={setCourse} part={1} min={1} max={COURSE_LIMIT}>
                Курс: {course}
            </CounterView>

            <DataPagination items={filtered} setItems={setFiltered} label='Материалы:' />
 
            {data &&
                <div className='items half'>
                    {filtered.map(el => 
                        <div className='item card'>
                            <RouterNavigator url={`/material/${el.shortid}`}>
                                {centum.shorter(el.title)}
                            </RouterNavigator>
                        </div>
                    )}
                </div>
            }

            {loading && <Loading label='Загрузка материалов' />}
        </>
    )
}

export default Materials