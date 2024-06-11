import React, {useState} from 'react'
import {useMutation} from '@apollo/client'
import uniqid from 'uniqid'
import {updateProfileInfo} from '../../../../utils/storage'
import {buildNotification} from '../../../../utils/notifications'
import {updateProfilePasswordM} from '../gql/mutations'
import {AccountPropsType} from '../../../../env/types'

const AccountSecurityPage: React.FC<AccountPropsType> = ({profile}) => {    

    const [state, setState] = useState({
        current_password: '', 
        new_password: ''
    })

    const {current_password, new_password} = state

    const [updateProfilePassword] = useMutation(updateProfilePasswordM, {
        onCompleted(data) {
            buildNotification(data.updateProfilePassword)
            updateProfileInfo(null)
        }
    })

    const onGenerate = () => {
        setState({...state, new_password: uniqid()})
    }

    const onUpdate = () => {
        updateProfilePassword({
            variables: {
                id: profile.shortid, current_password, new_password
            }
        })
    }

    return (
        <>
            <h2>Безопасность</h2>

            <div className='items small'>
                <input value={current_password} onChange={e => setState({...state, current_password: e.target.value})} placeholder='Текущий пароль' type='text' />
                <input value={new_password} onChange={e => setState({...state, new_password: e.target.value})} placeholder='Новый пароль' type='text' />
            </div>

            <div className='items little'>
                <button onClick={onGenerate}>Сгенерировать</button>
                <button onClick={onUpdate}>Обновить</button>
            </div>
        </>
    )
}

export default AccountSecurityPage