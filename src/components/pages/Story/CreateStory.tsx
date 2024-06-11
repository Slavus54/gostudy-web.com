import React, {useState, useContext, useLayoutEffect} from 'react'
import {useMutation} from '@apollo/client'
import {useParams} from 'react-router-dom'
import {AppContext} from '../../../context/AppContext'
import {changeTitle, buildNotification} from '../../../utils/notifications'
import {updateProfileInfo} from '../../../utils/storage'
import {classHandler} from '../../../utils/css'
import FormPagination from '../../../shared/UI/FormPagination'
import ImageLoader from '../../../shared/UI/ImageLoader'
import {createStoryM} from './gql/mutations'
import {STORY_TYPES, STORY_STATUSES} from './env'
import {COUNTRIES, LEVELS} from '../../../env/env'
import {ContextType} from '../../../env/types'

const CreateStory: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [image, setImage] = useState<string>('')
    
    const [state, setState] = useState({
        title: '', 
        category: STORY_TYPES[0], 
        country: COUNTRIES[0], 
        level: LEVELS[0], 
        status: STORY_STATUSES[0]
    })

    const {title, category, country, level, status} = state

    useLayoutEffect(() => {
        changeTitle('Новая История')
    }, [])

    const [createStory] = useMutation(createStoryM, {
        onCompleted(data) {
            buildNotification(data.createStory)
            updateProfileInfo(null)
        }
    })
  
    const onCreate = () => {
        createStory({
            variables: {
                name: account.name, id, title, category, country, level, status, image
            }
        })
    }

    return (
        <>
            <FormPagination items={[
                <>  
                    <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название эмигрантской истории...' />
                    
                    <div className='items small'>
                        {STORY_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                    </div>

                    <h4 className='pale'>Страна & Сложность & Статус</h4>
                    <div className='items small'>
                        <select value={country} onChange={e => setState({...state, country: e.target.value})}>
                            {COUNTRIES.map(el => <option value={el}>{el}</option>)}
                        </select>
                        <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                            {LEVELS.map(el => <option value={el}>{el}</option>)}
                        </select>
                        <select value={status} onChange={e => setState({...state, status: e.target.value})}>
                            {STORY_STATUSES.map(el => <option value={el}>{el}</option>)}
                        </select>
                    </div>

                    <ImageLoader setImage={setImage} />
                </>
            ]}>
                <h2>Новая История</h2>
            </FormPagination>  
            
            <button onClick={onCreate}>Опубликовать</button>
        </>
    )
}

export default CreateStory