import React, {useState, useContext, useMemo, useLayoutEffect, useEffect} from 'react'
import {useMutation} from '@apollo/client'
import {centum, datus} from '../../../shared/libs/libs'
import {AppContext} from '../../../context/AppContext'
import {changeTitle, buildNotification} from '../../../utils/notifications'
import {classHandler} from '../../../utils/css'
import DataPagination from '../../../shared/UI/DataPagination'
import ImageLoader from '../../../shared/UI/ImageLoader'
import ImageLook from '../../../shared/UI/ImageLook'
import CloseIt from '../../../shared/UI/CloseIt'
import Loading from '../../../shared/UI/Loading'
import {getStoryM, manageStoryQuestionM, updateStoryInformationM, offerStoryProductM} from './gql/mutations'
import {CURRENCY, INITIAL_PERCENT} from '../../../env/env'
import {QUESTION_TYPES, STORY_STATUSES, PRODUCT_TYPES, PRODUCT_DEFAULT_COST, PRODUCT_PRICES} from './env'
import {CollectionPropsType, ContextType} from '../../../env/types'

const Story: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {account} = useContext<ContextType>(AppContext)

    const [questions, setQuestions] = useState<any[]>([])
    const [question, setQuestion] = useState<any | null>(null)
    const [product, setProduct] = useState<any | null>(null)
    const [story, setStory] = useState<any | null>(null)
    
    const [isAuthor, setIsAuthor] = useState<boolean>(false)
    const [image, setImage] = useState<string>('')
    const [percent, setPercent] = useState<number>(INITIAL_PERCENT)

    const [state, setState] = useState({
        text: '',
        format: QUESTION_TYPES[0],
        reply: '',
        status: STORY_STATUSES[0],
        title: '',
        category: PRODUCT_TYPES[0],
        cost: PRODUCT_DEFAULT_COST,
        dateUp: datus.now('date')
    })

    const {text, format, reply, status, title, category, cost, dateUp} = state

    // get component

    const [getStory] = useMutation(getStoryM, {
        onCompleted(data) {
            setStory(data.getStory)
        }
    })

    const onUpdateComponent = () => getStory({
        variables: {
            id
        }
    })

    // mutations

    const [manageStoryQuestion] = useMutation(manageStoryQuestionM, {
        onCompleted(data) {
            onUpdateComponent()
            buildNotification(data.manageStoryQuestion)
        }
    })

    const [updateStoryInformation] = useMutation(updateStoryInformationM, {
        onCompleted(data) {
            onUpdateComponent()
            buildNotification(data.updateStoryInformation)
        }
    })

    const [offerStoryProduct] = useMutation(offerStoryProductM, {
        onCompleted(data) {
            onUpdateComponent()
            buildNotification(data.offerStoryProduct)
        }
    })

    useLayoutEffect(() => {
        changeTitle('История')

        if (account.shortid !== '') {
            onUpdateComponent()
        }
    }, [account])
    
    useMemo(() => {
        if (story !== null) {
            setImage(story.image)
            setIsAuthor(account.name === story.name)
            setState({...state, status: story.status})
        }
    }, [story])

    useMemo(() => {
        setState({...state, reply: question === null ? '' : question.reply})
    }, [question])

    useEffect(() => {
        setState({...state, cost: product === null ? PRODUCT_DEFAULT_COST : PRODUCT_PRICES[0]})
    }, [product])

    const onOffer = () => {
        if (product === null) {
            let result = centum.random(story.products)?.value

            if (result !== undefined) {
                setProduct(result)
            }

        } else {

            let diffirence: number = Math.abs(product.cost - cost)
            let result: number = centum.percent(diffirence, product.cost, 1)

            setPercent(result)
            setProduct(null)
        }
    }

    const onManageQuestion = (option: string) => {
        manageStoryQuestion({
            variables: {
                name: account.name, id, option, text, format, reply, likes: Number(question !== null), collId: question !== null ? question.shortid : ''
            }
        })
    }
    
    const onUpdateInformation = () => {
        updateStoryInformation({
            variables: {
                name: account.name, id, status, image
            }
        })
    }

    const onOfferProduct = () => {
        offerStoryProduct({
            variables: {
                name: account.name, id, title, category, cost, dateUp
            }
        })
    }

    return (
        <> 
            {story !== null &&
                <>
                    {image !== '' && <ImageLook src={image} className='photo' />}

                    <h2>{story.title}</h2>

                    <div className='items small'>
                        <h4 className='pale'>Тип: {story.category}</h4>
                        <h4 className='pale'>Страна: {story.country}</h4>
                    </div>

                    {isAuthor ?
                            <>
                                <h2>Основаная Информация</h2>

                                <select value={status} onChange={e => setState({...state, status: e.target.value})}>
                                    {STORY_STATUSES.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <ImageLoader setImage={setImage} />

                                <button onClick={onUpdateInformation}>Обновить</button>
                            </>
                        :
                            <>
                                <h2>Новый Вопрос</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Сформулируйте это...' />

                                <div className='items small'>
                                    {QUESTION_TYPES.map(el => <div onClick={() => setState({...state, format: el})} className={classHandler(el, format)}>{el}</div>)}
                                </div>

                                <button onClick={() => onManageQuestion('create')}>Опубликовать</button>
                            </>
                    }

                    {question === null ? 
                            <>
                                <DataPagination items={story.questions} setItems={setQuestions} label='Список вопросов:' />
                                <div className='items half'>
                                    {questions.map(el => 
                                        <div onClick={() => setQuestion(el)} className='item panel'>
                                            {centum.shorter(el.text)}
                                            <p className='pale'>{el.format}</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setQuestion(null)} />

                                <h2>Вопрос от {question.name}</h2>

                                <span>Формулировка: {question.text}</span>

                                {account.name === question.name ?
                                        <button onClick={() => onManageQuestion('delete')}>Удалить</button>
                                    :
                                        <button onClick={() => onManageQuestion('like')}>Нравится</button>
                                }

                                <div className='items small'>
                                    <h4 className='pale'>Тип: {question.format}</h4>
                                    <h4 className='pale'><b>{question.likes}</b> лайков</h4>
                                </div>

                                {isAuthor ?
                                        <>
                                            <h2>Оставьте свой ответ</h2>

                                            <textarea value={reply} onChange={e => setState({...state, reply: e.target.value})} placeholder='Текст...' />

                                            <button onClick={() => onManageQuestion('reply')}>Отправить</button>
                                        </>
                                    :
                                        <span>Ответ: {question.reply}</span>
                                }
                            </>
                    }


                    {product === null ?
                            <>
                                <h2>Новый Товар</h2>
                               
                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название продукта...' />

                                <div className='items small'>
                                    {PRODUCT_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                                </div>

                                <h4 className='pale'>Примерная цена ({CURRENCY})</h4>
                                <input value={cost} onChange={e => setState({...state, cost: parseInt(e.target.value)})} placeholder='Цена' type='text' />

                                <div className='items little'>
                                    <button onClick={onOffer}>Подобрать</button>
                                    <button onClick={onOfferProduct}>Предложить</button>
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setProduct(null)} />

                                <h2>{product.title}</h2>
                                <h4 className='pale'>Тип: {product.category}</h4>

                                <h2>Определите ближайшую цену</h2>

                                <h4 className='pale'>Разница: <b>{percent}%</b></h4>

                                <div className='items small'>
                                    {PRODUCT_PRICES.map(el => <div onClick={() => setState({...state, cost: el})} className={classHandler(el, cost)}>{el}{CURRENCY}</div>)}
                                </div>

                                <button onClick={onOffer}>Проверить</button>
                            </>
                    }
                </>
            }

            {story === null && <Loading label='Загрузка истории' />}
        </>
    )
}

export default Story