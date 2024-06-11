import React, {useState, useContext, useLayoutEffect} from 'react'
import {useMutation} from '@apollo/client'
import {useParams} from 'react-router-dom'
import {AppContext} from '../../../context/AppContext'
import {changeTitle, buildNotification} from '../../../utils/notifications'
import {updateProfileInfo} from '../../../utils/storage'
import {classHandler} from '../../../utils/css'
import FormPagination from '../../../shared/UI/FormPagination'
import CounterView from '../../../shared/UI/CounterView'
import {createMaterialM} from './gql/mutations'
import {MATERIAL_TYPES, LINK_TYPES, COURSE_LIMIT} from './env'
import {ContextType} from '../../../env/types'

const CreateMaterial: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [course, setCourse] = useState<number>(COURSE_LIMIT / 2)
    
    const [state, setState] = useState({
        title: '', 
        category: MATERIAL_TYPES[0], 
        link: '', 
        format: LINK_TYPES[0],
        url: ''
    })

    const {title, category, link, format, url} = state

    useLayoutEffect(() => {
        changeTitle('Новый Материал')
    }, [])

    const [createMaterial] = useMutation(createMaterialM, {
        onCompleted(data) {
            buildNotification(data.createMaterial)
            updateProfileInfo(null)
        }
    })
  
    const onCreate = () => {
        createMaterial({
            variables: {
                name: account.name, id, title, category, course, link, format, url
            }
        })
    }

    return (
        <>
            <FormPagination items={[
                <>  
                    <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Тема учебного материала...' />
                    
                    <div className='items small'>
                        {MATERIAL_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                    </div>

                    <CounterView num={course} setNum={setCourse} part={1} min={1} max={COURSE_LIMIT}>
                        Текущий курс: {course}
                    </CounterView>

                    <input value={link} onChange={e => setState({...state, link: e.target.value})} placeholder='Название источника' type='text' />

                    <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                        {LINK_TYPES.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <input value={url} onChange={e => setState({...state, url: e.target.value})} placeholder='URL' type='text' />
                </>
            ]}>
                <h2>Новый Материал</h2>
            </FormPagination>  
            
            <button onClick={onCreate}>Создать</button>
        </>
    )
}

export default CreateMaterial