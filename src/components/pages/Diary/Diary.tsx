import React, {useState, useContext, useMemo, useLayoutEffect} from 'react'
import {useMutation} from '@apollo/client'
import {useParams} from 'react-router-dom'
import {centum, datus} from '../../../shared/libs/libs'
import {AppContext} from '../../../context/AppContext'
import {changeTitle, buildNotification} from '../../../utils/notifications'
import {classHandler} from '../../../utils/css'
import DataPagination from '../../../shared/UI/DataPagination'
import ImageLoader from '../../../shared/UI/ImageLoader'
import ImageLook from '../../../shared/UI/ImageLook'
import CloseIt from '../../../shared/UI/CloseIt'
import Loading from '../../../shared/UI/Loading'
import {getDiaryM, manageDiaryQuestionM, manageDiaryThoughtM} from './gql/mutations'
import {LANGUAGES, LEVELS} from '../../../env/env'
import {THOUGHT_TYPES} from './env'
import {ContextType} from '../../../env/types'

const Diary: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [questions, setQuestions] = useState<any[]>([])
    const [question, setQuestion] = useState<any | null>(null)
    const [thoughts, setThoughts] = useState<any[]>([])
    const [thought, setThought] = useState<any | null>(null)
    const [diary, setDiary] = useState<any | null>(null)
    
    const [isAuthor, setIsAuthor] = useState<boolean>(false)
    const [likes, setLikes] = useState<number>(0)
    const [image, setImage] = useState<string>('')

    const [state, setState] = useState({
        content: '',       
        language: LANGUAGES[0],
        level: LEVELS[0],
        reply: '',
        text: '',
        category: THOUGHT_TYPES[0],
        dateUp: datus.now('date')
    })

    const {content, language, level, reply, text, category, dateUp} = state

    // get component

    const [getDiary] = useMutation(getDiaryM, {
        onCompleted(data) {
            setDiary(data.getDiary)
        }
    })

    const onGetComponent = () => getDiary({
        variables: {
            id
        }
    })

    // mutations

    const [manageDiaryQuestion] = useMutation(manageDiaryQuestionM, {
        onCompleted(data) {
            onGetComponent()
            buildNotification(data.manageDiaryQuestion, 'Дневник')
        }
    })

    const [manageDiaryThought] = useMutation(manageDiaryThoughtM, {
        onCompleted(data) {
            onGetComponent()
            buildNotification(data.manageDiaryThought, 'Дневник')
        }
    })

    useLayoutEffect(() => {
        changeTitle('Дневник')

        if (account.shortid !== '') {
            onGetComponent()
        }
    }, [account])
    
    useMemo(() => {
        if (diary !== null) {
            setIsAuthor(account.name === diary.name)
        }
    }, [diary])

    useMemo(() => {
        setState({...state, reply: question === null ? '' : question.reply})
    }, [question])

    useMemo(() => {
        setLikes(thought === null ? 0 : thought.likes)
    }, [thought])

    const onManageQuestion = (option: string) => {
        manageDiaryQuestion({
            variables: {
                name: account.name, id, option, content, language, level, reply, collId: question === null ? '' : question.shortid
            }
        })
    }

    const onManageThought = (option: string) => {
        let flag: boolean = thought !== null

        if (option === 'like') {
            setLikes(thought.likes + 1)
        }

        manageDiaryThought({
            variables: {
                name: account.name, id, option, text, category, image, dateUp, likes: Number(flag), collId: flag ? thought.shortid : ''
            }
        })
    }

    return (
        <>
            {diary !== null &&
                <>
                    <h2>{diary.title}</h2>

                    <div className='items small'>
                        <h4 className='pale'>Страна: {diary.country}</h4>
                        <h4 className='pale'>Уровень владения: {diary.level}</h4>
                    </div>

                    {isAuthor ? 
                            <>
                                <h2>Новая Мысль</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Введите текст...' />

                                <div className='items small'>
                                    {THOUGHT_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                                </div>
                            
                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManageThought('create')}>Опубликовать</button>
                            </>
                        :
                            <>
                                <h2>Новый Вопрос</h2>

                                <textarea value={content} onChange={e => setState({...state, content: e.target.value})} placeholder='Формулировка...' />

                                <h4 className='pale'>Язык & Уровень</h4>
                                <div className='items small'>
                                    <select value={language} onChange={e => setState({...state, language: e.target.value})}>
                                        {LANGUAGES.map(el => <option value={el}>{el}</option>)}
                                    </select>
                                    <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                                        {LEVELS.map(el => <option value={el}>{el}</option>)}
                                    </select>
                                </div>

                                <button onClick={() => onManageQuestion('create')}>Задать</button>
                            </>
                    }

                    {question === null ?
                            <>
                                <DataPagination items={diary.questions} setItems={setQuestions} label='Список вопросов:' />
                                <div className='items half'>
                                    {questions.map(el => 
                                        <div onClick={() => setQuestion(el)} className='item card'>
                                            {centum.shorter(el.content)}
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setQuestion(null)} />

                                <h2>Вопрос от {question.name}</h2>

                                <span>{question.content}?</span>

                                <div className='items small'>
                                    <h4 className='pale'>Язык: {question.language}</h4>
                                    <h4 className='pale'>Сложность: {question.level}</h4>
                                </div>

                                {isAuthor ?
                                        <>
                                            <textarea value={reply} onChange={e => setState({...state, reply: e.target.value})} placeholder='Ваш ответ...' />

                                            <button onClick={() => onManageQuestion('reply')}>Ответить</button>
                                        </>
                                    :
                                        <p>Ответ: {question.reply}</p>
                                }

                                {account.name === question.name && <button onClick={() => onManageQuestion('delete')}>Удалить</button>}
                            </>
                    }

                    {thought === null ?
                            <>
                                <DataPagination items={diary.thoughts} setItems={setThoughts} label='Мысли автора дневника:' />
                                <div className='items half'>
                                    {questions.map(el => 
                                        <div onClick={() => setThought(el)} className='item panel'>
                                            {centum.shorter(el.text)}
                                            <p className='pale'>{el.dateUp}</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setThought(null)} />

                                {thought.image !== '' && <ImageLook src={thought.image} className='photo' />}

                                <span>{thought.text}</span>

                                <div className='items small'>
                                    <h4 className='pale'>Тип: {thought.category}</h4>
                                    <h4 className='pale'><b>{likes}</b> лайков</h4>
                                </div>

                                {isAuthor ? 
                                        <button onClick={() => onManageThought('delete')}>Удалить</button>
                                    :
                                        <button onClick={() => onManageThought('like')}>Нравится</button>
                                }
                            </>
                    }
                </>
            }

            {diary === null && <Loading label='Загрузка дневника' />}
        </>
    )
}

export default Diary