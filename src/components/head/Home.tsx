import {useContext, useState, useLayoutEffect} from 'react'
import Account from './Account'
import Welcome from './Welcome'
import {AppContext} from '../../context/AppContext'
import {ContextType} from '../../env/types'

const Home = () => {
    const {account} = useContext<ContextType>(AppContext)
    const [shortid, setShortid] = useState<string>('')

    useLayoutEffect(() => {
        if (account.shortid !== '') {
            setShortid(account.shortid)
        }
    }, [account])

    return shortid === '' ? <Welcome /> : <Account shortid={shortid} />
}

export default Home