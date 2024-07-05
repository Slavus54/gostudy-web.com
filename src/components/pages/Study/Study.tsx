import React, {useState, useEffect, useLayoutEffect} from 'react'
import {centum, datus} from '../../../shared/libs/libs'
import {onTranslate} from '../../../utils/translation'
import {changeTitle} from '../../../utils/notifications'
import {onUpdateTranslationHistory, translations} from '../../../utils/storage'
import ImageLook from '../../../shared/UI/ImageLook'
import {COUNTRIES} from '../../../env/env'
import {ALPHABENT_TYPES, SOURCES_TYPES, LANGUAGE_TYPES} from './env' 

const Study: React.FC = () => {
    const [sources, setSources] = useState<any[]>([])
    const [text, setText] = useState<string>('')
    const [translated, setTranslated] = useState<string>('Здесь будет переведённый текст')
    const [langFrom, setLangFrom] = useState<string>(LANGUAGE_TYPES[0])
    const [langTo, setLangTo] = useState<string>(LANGUAGE_TYPES[0])
    const [country, setCountry] = useState<string>(COUNTRIES[0])

    useLayoutEffect(() => {
        changeTitle('Учёба')
    }, [])

    useEffect(() => {
        let result = SOURCES_TYPES.filter(el => el.country === country)

        setSources(result)
    }, [country])

    const onTranslated = async () => {
        let data = await onTranslate(text, langFrom, langTo)
        let result: string = data.responseData.translatedText
    
        setTranslated(result)
        onUpdateTranslationHistory(text, result, langFrom, langTo, datus.now('date'))
    }

    return (
        <>
            <h1>Алфавиты</h1>

            <div className='items half'>
                {ALPHABENT_TYPES.map(el => <ImageLook src={el} className='photo' />)}
            </div>

            <h2>Переводчик</h2>

            <textarea value={text} onChange={e => setText(e.target.value)} placeholder='Ваш текст...' />

            <h4 className='pale'>Перевод с {langFrom} на {langTo}</h4>
            <div className='items small'>
                <select value={langFrom} onChange={e => setLangFrom(e.target.value)}>
                    {LANGUAGE_TYPES.map(el => <option value={el}>{el}</option>)}
                </select>
                <select value={langTo} onChange={e => setLangTo(e.target.value)}>
                    {LANGUAGE_TYPES.map(el => <option value={el}>{el}</option>)}
                </select>
            </div>

            <button onClick={onTranslated}>Перевести</button>

            <span>{translated}</span>

            <h2>Источники информации</h2>

            <select value={country} onChange={e => setCountry(e.target.value)}>
                {COUNTRIES.map(el => <option value={el}>{el}</option>)}
            </select>

            <div className='items half'>
                {sources.map(el => 
                    <div onClick={() => centum.go(el.url)} className='item card'>
                        {el.title}
                    </div>
                )}
            </div>

            <h2>Ваши переводы</h2>
            <div className='items half'>
                {translations.map(el => 
                    <div className='item panel'>
                        <p>{centum.shorter(el.text, 3)} | {centum.shorter(el.translated, 2)}</p>
                        <small>{el.timestamp}</small>
                    </div>
                )}
            </div>
        </>
    )
}

export default Study