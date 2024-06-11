import React, {useState} from 'react'
import LeftArrow from '../../assets/form/left.png'
import RightArrow from '../../assets/form/right.png'
import ImageLook from './ImageLook'
import {FormPaginationProps} from '../../env/types'

const FormPagination: React.FC<FormPaginationProps> = ({children, items = []}) => {
    const [num, setNum] = useState<number>(0)

    return (
        <div className='main profile'>
            <div className='items small'>
                <ImageLook onClick={() => num > 0 && setNum(num - 1)} src={LeftArrow} min={2} max={2} className='icon' alt='prev' />
                    {children}
                <ImageLook onClick={() => num < items.length - 1 && setNum(num + 1)} src={RightArrow} min={2} max={2} className='icon' alt='next' />
            </div>

            {items[num]}           
        </div>
    )
}

export default FormPagination