import React, {useState, useContext, useLayoutEffect} from 'react'
import {useMutation} from '@apollo/client'
import {useParams} from 'react-router-dom'
import {datus} from '../../../shared/libs/libs'
import {AppContext} from '../../../context/AppContext'
import {changeTitle, buildNotification} from '../../../utils/notifications'
import {updateProfileInfo} from '../../../utils/storage'
import {classHandler} from '../../../utils/css'
import FormPagination from '../../../shared/UI/FormPagination'
import {createDiaryM} from './gql/mutations'
import {DIARY_TYPES, LANG_LEVELS} from './env'
import {COUNTRIES} from '../../../env/env'
import {ContextType} from '../../../env/types'

const CreateDiary: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)
    
    const [state, setState] = useState({
        title: '', 
        category: DIARY_TYPES[0], 
        country: COUNTRIES[0], 
        level: LANG_LEVELS[0], 
        latestDate: datus.now('date')
    })

    const {title, category, country, level, latestDate} = state

    useLayoutEffect(() => {
        changeTitle('Новый Дневник')
    }, [])

    const [createDiary] = useMutation(createDiaryM, {
        onCompleted(data) {
            buildNotification(data.createDiary)
            updateProfileInfo(null)
        }
    })

    const onCreate = () => {
        createDiary({
            variables: {
                name: account.name, id, title, category, country, level, latestDate
            }
        })
    }

    return (
        <>
            <FormPagination items={[
                <>  
                    <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название вашего дневника...' />
                    
                    <div className='items small'>
                        {DIARY_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                    </div>

                    <h4 className='pale'>Страна & Язык</h4>
                    <div className='items small'>
                        <select value={country} onChange={e => setState({...state, country: e.target.value})}>
                            {COUNTRIES.map(el => <option value={el}>{el}</option>)}
                        </select>
                        <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                            {LANG_LEVELS.map(el => <option value={el}>{el}</option>)}
                        </select>
                    </div>
                </>
            ]}>
                <h2>Новый Дневник</h2>
            </FormPagination>  
            
            <button onClick={onCreate}>Начать</button>
        </>
    )
}

export default CreateDiary