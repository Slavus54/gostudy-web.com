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
import {getMaterialM, manageMaterialConspectM, updateMaterialLinkM, publishMaterialTermM} from './gql/mutations'
import {CONSPECT_TYPES, LINK_TYPES, COURSE_LIMIT} from './env'
import {LANGUAGES} from '../../../env/env'
import {ContextType} from '../../../env/types'

const Material: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [material, setMaterial] = useState<any | null>(null)
    const [conspects, setConspects] = useState<any[]>([])
    const [conspect, setConspect] = useState<any | null>(null)
    const [term, setTerm] = useState<any | null>(null)
    
    const [image, setImage] = useState<string>('')

    const [state, setState] = useState({
        text: '',
        category: CONSPECT_TYPES[0],
        link: '',
        format: LINK_TYPES[0],
        url: '',
        title: '',
        translation: '',
        language: LANGUAGES[0],
        dateUp: datus.now('date')
    })

    const {text, category, link, format, url, title, translation, language, dateUp} = state

    // get component

    const [getMaterial] = useMutation(getMaterialM, {
        onCompleted(data) {
            setMaterial(data.getMaterial)
        }
    })

    const onUpdateComponent = () => getMaterial({
        variables: {
            id
        }
    })

    // mutations

    const [manageMaterialConspect] = useMutation(manageMaterialConspectM, {
        onCompleted(data) {
            onUpdateComponent()
            buildNotification(data.manageMaterialConspect, 'Материал')
        }
    })

    const [updateMaterialLink] = useMutation(updateMaterialLinkM, {
        onCompleted(data) {
            onUpdateComponent()
            buildNotification(data.updateMaterialLink, 'Материал')
        }
    })

    const [publishMaterialTerm] = useMutation(publishMaterialTermM, {
        onCompleted(data) {
            onUpdateComponent()
            buildNotification(data.publishMaterialTerm, 'Материал')
        }
    })

    useLayoutEffect(() => {
        changeTitle('Материал')

        if (account.shortid !== '') {
            onUpdateComponent()
        }
    }, [account])
    
    useMemo(() => {
        if (material !== null) {
            setState({...state, link: material.link, format: material.format, url: material.url})
        }
    }, [material])

    const onView = () => {
        centum.go(material.url)
    }

    const onTerm = () => {
        let result = centum.random(material.terms)?.value

        if (result !== undefined) {
            setTerm(result)
        }
    }

    const onManageConspect = (option: string) => {
        manageMaterialConspect({
            variables: {
                name: account.name, id, option, text, category, image, likes: Number(conspect !== null), collId: conspect !== null ? conspect.shortid : ''
            }
        })
    }

    const onUpdateLink = () => {
        updateMaterialLink({
            variables: {
                name: account.name, id, link, format, url 
            }
        })
    }

    const onPublishTerm = () => {
        publishMaterialTerm({
            variables: {
                name: account.name, id, title, translation, language, dateUp
            }
        })
    }

    return (
        <> 
            {material !== null &&
                <>
                    <h2>{material.title}</h2>

                    <div className='items small'>
                        <h4 className='pale'>Тема: {material.category}</h4>
                        <h4 className='pale'>Курс: {material.course}/{COURSE_LIMIT}</h4>
                    </div>

                    <button onClick={onView}>Подробнее</button>

                    {conspect === null ?
                            <>
                                <h2>Новый Конспект</h2>
                                <h4 className='pale'>Поделитесь вашими знаниями</h4>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Опишите это...' />

                                <div className='items small'>
                                    {CONSPECT_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                                </div>

                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManageConspect('create')}>Создать</button>

                                <DataPagination items={material.conspects} setItems={setConspects} label='Список конспектов:' />
                                <div className='items half'>
                                    {conspects.map(el => 
                                        <div onClick={() => setConspect(el)} className='item panel'>
                                            {centum.shorter(el.text)}
                                            <p className='pale'>{el.category}</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setConspect(null)} />

                                {conspect.image !== '' && <ImageLook src={conspect.image} className='photo' />}

                                <h2>Конспект от {conspect.name}</h2>

                                <span>{conspect.text}</span>

                                <div className='items small'>
                                    <h4 className='pale'>Тип: {conspect.category}</h4>
                                    <h4 className='pale'><b>{conspect.likes}</b> лайков</h4>
                                </div>

                                {account.name === conspect.name ?   
                                        <button onClick={() => onManageConspect('delete')}>Удалить</button>
                                    :
                                        <button onClick={() => onManageConspect('like')}>Нравиться</button>
                                }
                            </>
                    }

                    <h2>Текущий источник</h2>

                    <textarea value={link} onChange={e => setState({...state, link: e.target.value})} placeholder='Название источника...' />

                    <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                        {LINK_TYPES.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <input value={url} onChange={e => setState({...state, url: e.target.value})} placeholder='URL' type='text' />

                    <button onClick={onUpdateLink}>Обновить</button>

                    {term === null ?
                            <>
                                <h2>Новый Термин</h2>
                                <h4 className='pale'>Расширяйте словарный запас</h4>

                                <div className='items small'>
                                    <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название термина' type='text' />
                                    <input value={translation} onChange={e => setState({...state, translation: e.target.value})} placeholder='Перевод термина' type='text' />
                                </div>

                                <select value={language} onChange={e => setState({...state, language: e.target.value})}>
                                    {LANGUAGES.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <div className='items little'>
                                    <button onClick={onTerm}>Сгенерировать</button>
                                    <button onClick={onPublishTerm}>Опубликовать</button>
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setTerm(null)} />

                                <span>{term.title} - {term.translation}</span>

                                <h4 className='pale'>Язык: {term.language} ({term.dateUp})</h4>
                            </>
                    }
                </>
            }

            {material === null && <Loading label='Загрузка материала' />}
        </>
    )
}

export default Material