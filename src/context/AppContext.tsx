import {useState, createContext} from 'react'
import Cookies from 'js-cookie'
import {useLocation} from 'wouter'
import {UserCookieType, ContextPropsType} from '../env/types'
import {ACCOUNT_COOKIE_KEY} from '../env/env'

const initialState: UserCookieType = {
    shortid: '',
    name: ''
}

export const AppContext = createContext<any>(initialState)

const AppProvider = ({children}: ContextPropsType) => {
    const [_, setLocation] = useLocation()
    const [account, setAccount] = useState(initialState) 

    const accountUpdate = (key = 'create', data = null, expires = 1, url = '/') => {

        if (key === 'create') {
            const cookie = Cookies.get(ACCOUNT_COOKIE_KEY)
            let result = cookie === undefined ? null : JSON.parse(cookie)
       
            if (result !== null) {
                setAccount({...account, shortid: result.shortid, name: result.name})
            } else {    
                Cookies.set(ACCOUNT_COOKIE_KEY, result, {expires})
            }
          
        } else if (key === 'update') {
            Cookies.set(ACCOUNT_COOKIE_KEY, JSON.stringify(data), {expires})
            
            setTimeout(() => {
                setLocation(url) 
                window.location.reload()
            }, 5e2)   
        }  
    }

    return <AppContext.Provider value={{account, accountUpdate}}>{children}</AppContext.Provider>
}

export default AppProvider