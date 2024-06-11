import {useState, useContext, useMemo} from 'react'
//@ts-ignore
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import {AppContext} from '../../context/AppContext'
import {items} from '../../env/routes'
import {ContextType, RouteItem, RouteStatuses} from '../../env/types'

const RouterComponent: any = () => {
    const {account} = useContext<ContextType>(AppContext)
    const [routes, setRoutes] = useState<RouteItem[]>(items)
    const [pages, setPages] = useState<RouteItem[]>(items)

    useMemo(() => {    
        let filteredPages = items.filter(el => account.shortid === '' ? el.status < RouteStatuses.RegisteredOnly : el.status > RouteStatuses.StrangerOnly)
        let filteredRoutes = filteredPages.filter(el => el.visible) 
     
        setRoutes(filteredRoutes)
        setPages(filteredPages)
    }, [account])

    return (
        <Router>
            <>
                <div className='navbar'>
                    {routes.map((el, idx) => 
                        <Link to={el.url} key={idx} className='navbar__item'>{el.title}</Link>
                    )}
                </div>
                
                <Routes>
                    {pages.map((el, idx) => <Route Component={el.component} path={el.url} key={idx} />)}
                </Routes>
            </>
        </Router>
        
    )
}

export default RouterComponent