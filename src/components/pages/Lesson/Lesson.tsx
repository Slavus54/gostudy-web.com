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
import {getLessonM, manageLessonWritingM, updateLessonRatingM, publishLessonQuoteM} from './gql/mutations'
import {INITIAL_PERCENT, COLLECTION_LIMIT} from '../../../env/env'
import {WRITING_TYPES, FONT_TYPES} from './env'
import {ContextType} from '../../../env/types'

const Lesson: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [writings, setWritings] = useState<any[]>([])
    const [writing, setWriting] = useState<any | null>(null)
    const [quote, setQuote] = useState<any | null>(null)
    const [lesson, setLesson] = useState<any | null>(null)
    
    const [image, setImage] = useState<string>('')

    const [state, setState] = useState({
        title: '',
        category: WRITING_TYPES[0],
        font: FONT_TYPES[0],
        rating: INITIAL_PERCENT,
        text: '',
        author: '',
        dateUp: datus.now('date')
    })

    const {title, category, font, rating, text, author, dateUp} = state

    // get component

    const [getLesson] = useMutation(getLessonM, {
        onCompleted(data) {
            setLesson(data.getLesson)
        }
    })

    const onUpdateComponent = () => getLesson({
        variables: {
            id
        }
    })
      
    // mutations

    const [manageLessonWriting] = useMutation(manageLessonWritingM, {
        onCompleted(data) {
            onUpdateComponent()
            buildNotification(data.manageLessonWriting)
        }
    })

    const [updateLessonRating] = useMutation(updateLessonRatingM, {
        onCompleted(data) {
            onUpdateComponent()
            buildNotification(data.updateLessonRating)
        }
    })

    const [publishLessonQuote] = useMutation(publishLessonQuoteM, {
        onCompleted(data) {
            onUpdateComponent()
            buildNotification(data.publishLessonQuote)
        }
    })

    useLayoutEffect(() => {
        changeTitle('Занятия')

        if (account.shortid !== '') {
            onUpdateComponent()
        }
    }, [account])
    
    useMemo(() => {
        if (lesson !== null) {
            setState({...state, rating: lesson.rating})
        }
    }, [lesson])

    const onQuote = () => {
        let result = centum.random(lesson.quotes)?.value

        if (result !== undefined) {
            setQuote(result)
        }
    }

    const onManageWriting = (option: string) => {
        manageLessonWriting({
            variables: {
                name: account.name, id, option, title, category, font, image, likes: Number(writing !== null), collId: writing !== null ? writing.shortid : ''
            }
        })
    }

    const onUpdateRating = () => {
        updateLessonRating({
            variables: {
                name: account.name, id, rating
            }
        })
    }

    const onPublishQuote = () => {
        publishLessonQuote({
            variables: {
                name: account.name, id, text, author, dateUp
            }
        })
    }

    return (
        <> 
            {lesson !== null &&
                <>
                    <h2>{lesson.title} ({lesson.language})</h2>

                    <div className='items small'>
                        <h4 className='pale'>Тема: {lesson.category}</h4>
                        <h4 className='pale'>Источник: {lesson.format}</h4>
                    </div>

                    {writing === null ?
                            <>
                                <h2>Новая Рукопись</h2>
                                <h4 className='pale'>Практикуйте письмо в разных жанрах</h4>

                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Озаглавьте рукопись...' />

                                <div className='items small'>
                                    <select value={category} onChange={e => setState({...state, category: e.target.value})}>
                                        {WRITING_TYPES.map(el => <option value={el}>{el}</option>)}
                                    </select>
                                    <select value={font} onChange={e => setState({...state, font: e.target.value})}>
                                        {FONT_TYPES.map(el => <option value={el}>{el}</option>)}
                                    </select>
                                </div>

                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManageWriting('create')}>Добавить</button>

                                <DataPagination items={lesson.writings} setItems={setWritings} label='Список руписей:' />
                                <div className='items half'>
                                    {writings.map(el => 
                                        <div onClick={() => setWriting(el)} className='item panel'>
                                            {centum.shorter(el.title)}
                                            <p className='pale'>{el.category}</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setWriting(null)} />

                                {writing.image !== '' && <ImageLook src={writing.image} className='photo' />}

                                <h2>{writing.title}</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Жанр: {writing.category} ({writing.font})</h4>
                                    <h4 className='pale'><b>{writing.likes}</b> лайков</h4>
                                </div>

                                {account.name === writing.name ? 
                                        <button onClick={() => onManageWriting('delete')}>Удалить</button>
                                    :
                                        <button onClick={() => onManageWriting('like')}>Нравится</button>
                                }
                            </>
                    }
                
                    <h4 className='pale'>Рейтинг занятия: <b>{rating}%</b></h4>
                    <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />

                    <button onClick={onUpdateRating}>Обновить</button>

                    {quote === null ?
                            <>
                                <h2>Новая Цитата</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Текст цитаты...' />

                                {quote.persons.length < COLLECTION_LIMIT / 2 ?
                                        <select value={author} onChange={e => setState({...state, author: e.target.value})}>
                                            {quote.persons.map(el => <option value={el}>{el}</option>)}
                                        </select>
                                    :
                                        <div className='items small'>
                                            {quote.persons.map(el => <div onClick={() => setState({...state, author: el})} className={classHandler(el, author)}>{el}</div>)}
                                        </div>
                                }

                                <div className='items little'>
                                    <button onClick={onQuote}>Сгенерировать</button>
                                    <button onClick={onPublishQuote}>Опубликовать</button>
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setQuote(null)} />
                                
                                <h2>Цитата от {quote.name} ({quote.dateUp})</h2>

                                <span>{quote.text} (c) {quote.author}</span>
                            </>
                    }
                </>
            }

            {lesson === null && <Loading label='Загрузка занятия' />}
        </>
    )
}

export default Lesson