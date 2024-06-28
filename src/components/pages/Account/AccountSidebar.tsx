import React, {useState} from 'react'
import ImageLook from '../../../shared/UI/ImageLook'
import {parts} from '../../../env/parts'
import {AccountPropsType, AccountPart} from '../../../env/types'

const AccountSidebar: React.FC<AccountPropsType> = ({profile}) => {
    const [part, setPart] = useState<AccountPart>(parts[0])

    return (
        <>
            <div className='profile-menu'>
                {parts.map(el => 
                    <div onClick={() => setPart(el)} className='profile-menu__item'>
                        <ImageLook src={el.url} min={2} max={2} className='icon' alt='icon' />
                    </div>
                )}
            </div>
        
            {part !== null && profile !== null && <part.component profile={profile} />}
        </>
    )
}

export default AccountSidebar