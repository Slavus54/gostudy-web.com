import {useLayoutEffect, useContext} from 'react'
import RouterComponent from '../router/Router'
import {AppContext} from '../../context/AppContext'
import {getTownsFromStorage, getTownsFromServer} from '../../utils/storage'
import {ContextType, TownType} from '../../env/types'

const Layout = () => {
    const {accountUpdate} = useContext<ContextType>(AppContext)

    useLayoutEffect(() => {
        accountUpdate('create')

        let towns: TownType[] = getTownsFromStorage()

        if (towns.length === 0) {
            getTownsFromServer()
        }
    }, [])
  
    return (
        <div className='main'>
            <RouterComponent />
        </div>
    )
}

export default Layout