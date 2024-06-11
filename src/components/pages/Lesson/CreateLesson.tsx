import React, {useState, useContext, useLayoutEffect} from 'react'
import {useMutation} from '@apollo/client'
import {useParams} from 'react-router-dom'
import {AppContext} from '../../../context/AppContext'
import {changeTitle, buildNotification} from '../../../utils/notifications'
import {updateProfileInfo} from '../../../utils/storage'
import {classHandler} from '../../../utils/css'
import FormPagination from '../../../shared/UI/FormPagination'
import {createLessonM} from './gql/mutations'
import {LESSON_TYPES, SOURCE_TYPES} from './env'
import {LANGUAGES, INITIAL_PERCENT, COLLECTION_LIMIT} from '../../../env/env'
import {ContextType} from '../../../env/types'

const CreateLesson: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [person, setPerson] = useState<string>('')
    
    const [state, setState] = useState({
        title: '', 
        category: LESSON_TYPES[0], 
        format: SOURCE_TYPES[0], 
        language: LANGUAGES[0], 
        persons: [], 
        rating: INITIAL_PERCENT 
    })

    const {title, category, format, language, persons, rating} = state

    useLayoutEffect(() => {
        changeTitle('Новое Занятие')
    }, [])

    const [createLesson] = useMutation(createLessonM, {
        onCompleted(data) {
            buildNotification(data.createLesson)
            updateProfileInfo(null)
        }
    })
  
    const onPerson = () => {
        if (persons.length < COLLECTION_LIMIT) {
            setState({...state, persons: [...persons, person]})
        }

        setPerson('')
    }

    const onCreate = () => {
        createLesson({
            variables: {
                name: account.name, id, title, category, format, language, persons, rating
            }
        })
    }

    return (
        <>
            <FormPagination items={[
                <>  
                    <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Опишите обсуждение источника...' />
                    
                    <div className='items small'>
                        {LESSON_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                    </div>

                    <h4 className='pale'>Личности ({persons.length}/{COLLECTION_LIMIT})</h4>
                
                    <input value={person} onChange={e => setPerson(e.target.value)} placeholder='Полное имя' type='text' />

                    <button onClick={onPerson}>+</button>

                    <h4 className='pale'>Источник & Язык</h4>
                    <div className='items small'>
                        <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                            {SOURCE_TYPES.map(el => <option value={el}>{el}</option>)}
                        </select>
                        <select value={language} onChange={e => setState({...state, language: e.target.value})}>
                            {LANGUAGES.map(el => <option value={el}>{el}</option>)}
                        </select>
                    </div>

                    <h4 className='pale'>Рейтинг: <b>{rating}%</b></h4>
                    <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />
                </>
            ]}>
                <h2>Новое Занятие</h2>
            </FormPagination>  
            
            <button onClick={onCreate}>Начать</button>
        </>
    )
}

export default CreateLesson