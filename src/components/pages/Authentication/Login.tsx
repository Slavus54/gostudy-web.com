import React, {useState, useContext, useLayoutEffect} from 'react'
import {useMutation} from '@apollo/client'
import {datus} from '../../../shared/libs/libs'
import {AppContext} from '../../../context/AppContext'
import {updateSession, getSession} from '../../../utils/storage'
import {changeTitle} from '../../../utils/notifications'
import Loading from '../../../shared/UI/Loading'
import {loginProfileM} from './gql/mutations'
import {ContextType} from '../../../env/types'

const Login: React.FC = () => {
    const {accountUpdate} = useContext<ContextType>(AppContext)

    const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false)

    const [state, setState] = useState({
        name: getSession() ?? '',
        password: ''
    })

    const {name, password} = state

    useLayoutEffect(() => {
        changeTitle('Вход в Аккаунт')
    }, [])

    const [loginProfile] = useMutation(loginProfileM, {
        onCompleted(data) {
            accountUpdate('update', data.loginProfile, 2)
            updateSession(data.loginProfile.name)
        }
    })

    const onLogin = () => {
        loginProfile({
            variables: {
                name, password, timestamp: datus.now()
            }
        })

        setIsLoginLoading(true)
    }

    return (
        <>
            {isLoginLoading ? 
                    <Loading label='Вход в аккаунт' />
                :
                    <>
                        <h2>Войдите в учётную запись</h2>

                        <input value={name} onChange={e => setState({...state, name: e.target.value})} placeholder='Ваше полное имя' type='text' />
                        <input value={password} onChange={e => setState({...state, password: e.target.value})} placeholder='Пароль' type='text' />                   

                        <button onClick={onLogin} className='light'>Войти</button>
                    </>
            }
        </>
    )
}

export default Login