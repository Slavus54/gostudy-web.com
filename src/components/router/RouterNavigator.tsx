import React, {useState, useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import {AppContext} from '../../context/AppContext'
import {RouterNavigatorPropsType, ContextType} from '../../env/types'

const RouterNavigator: React.FC<RouterNavigatorPropsType> = ({url, children}) => {
    const {account} = useContext<ContextType>(AppContext)
    const navigate = useNavigate()
    const [items] = useState<string[]>(url.split('/profile/'))
    
    const onRedirect = () => {
        let id = Boolean(items.length - 1) ? items[1] : '/'

        if (account.shortid === id) {
            navigate('/')
        } else {
            navigate(url)
        }
    }

    return (
        <div onClick={onRedirect} className='navigator'>
            {children}
        </div>
    )
}

export default RouterNavigator