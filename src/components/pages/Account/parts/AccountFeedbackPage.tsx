import React, {useState} from 'react'
import {saveAs} from 'file-saver'
import {classHandler} from '../../../../utils/css'
import files from '../../../../env/files.json'
import ImageLook from '../../../../shared/UI/ImageLook'
import {FEEDBACK_TYPES, FEEDBACK_URL, FEEDBACK_EMAIL, FILE_ICON} from '../env'
import {AccountPropsType} from '../../../../env/types'

const AccountFeedbackPage: React.FC<AccountPropsType> = () => {    
    const [state, setState] = useState({
        text: '',
        category: FEEDBACK_TYPES[0],
        email: ''
    })

    const {text, category, email} = state

    const onDownload = (file) => {
        saveAs(file.path, file.title + '.pdf')
    }

    const onSendFeedback = async () => {
        let flag = email.includes('@')

        if (flag === true) {
            await fetch(FEEDBACK_URL, {
                method: 'POST',
                body: JSON.stringify({text, category, email: email !== '' ? email : FEEDBACK_EMAIL}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })   
        }
    }

    return (
        <>
            <h2>Обратная связь</h2>
            <h4 className='pale'>Напишите в техподдержку</h4>

            <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Ваш текст...' />

            <div className='items small'>
                {FEEDBACK_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
            </div>

            <input value={email} onChange={e => setState({...state, email: e.target.value})} placeholder='Почтовый ящик' type='text' />

            <button onClick={onSendFeedback}>Отправить</button>

            <div className='items medium'>
                {files.map(el => 
                    <div onClick={() => onDownload(el)} className='item card'>
                        <ImageLook src={FILE_ICON} min={2} max={2} className='icon' />
                        <small>{el.title}.pdf</small>
                    </div>
                )}
            </div>
        </>
    )
}

export default AccountFeedbackPage