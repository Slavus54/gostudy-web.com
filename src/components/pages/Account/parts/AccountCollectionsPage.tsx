import React, {useState, useMemo} from 'react'
import {centum} from '../../../../shared/libs/libs'
import RouterNavigator from '../../../router/RouterNavigator'
import DataPagination from '../../../../shared/UI/DataPagination'
import {SEARCH_PERCENT} from '../../../../env/env'
import {components} from '../../../../env/collections'
import {AccountPropsType, AccountCollectionType} from '../../../../env/types'

const AccountCollectionsPage: React.FC<AccountPropsType> = ({profile}) => {   
    const [collections, setCollections] = useState<AccountCollectionType[]>([])
    
    const [title, setTitle] = useState<string>('')
 
    useMemo(() => {
        let result: AccountCollectionType[] = profile.account_components

        if (title.length !== 0) {
            result = result.filter(el => centum.search(el.title, title, SEARCH_PERCENT))
        }

        setCollections(result)
    }, [title])
    return (
        <>
            <h2>Компоненты</h2>
            <h4 className='pale'>Создайте что-нибудь своё</h4>

            <div className='items medium'>
                {components.map(el => 
                    <div className='item label'>
                        <RouterNavigator url={`/create-${el.url}/${profile.shortid}`}>
                            {el.title}
                        </RouterNavigator>
                    </div>
                )}
            </div>
            
            <h2>Поиск</h2>
            <textarea value={title} onChange={e => setTitle(e.target.value)} placeholder='Название компонента....' />

            <DataPagination items={profile.account_components} setItems={setCollections} label='Список коллекций:' />
            <div className='items half'>
                {collections.map(el => 
                    <div className='item panel'>
                        <RouterNavigator url={`/${el.url}/${el.shortid}`}>
                            {el.title}
                        </RouterNavigator>
                        <p className='pale'>{el.url}</p>
                    </div>
                )}
            </div>            
        </>
    )
}

export default AccountCollectionsPage