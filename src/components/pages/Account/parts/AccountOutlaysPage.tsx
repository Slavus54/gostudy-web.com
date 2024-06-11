import React, {useState, useMemo} from 'react'
import {useMutation} from '@apollo/client'
import {centum} from '../../../../shared/libs/libs'
import {updateProfileInfo} from '../../../../utils/storage'
import {buildNotification} from '../../../../utils/notifications'
import {classHandler} from '../../../../utils/css'
import DataPagination from '../../../../shared/UI/DataPagination'
import CloseIt from '../../../../shared/UI/CloseIt'
import {manageProfileOutlayM} from '../gql/mutations'
import {LEVELS, CURRENCY} from '../../../../env/env'
import {OUTLAY_TYPES, PAYMENT_FORMATS, DEFAULT_OUTLAY_COST} from '../env'
import {AccountPropsType} from '../../../../env/types'

const AccountOutlaysPage: React.FC<AccountPropsType> = ({profile}) => {    
    const [outlays, setOutlays] = useState<any[]>([])
    const [outlay, setOutlay] = useState<any | null>(null)

    const [percentage, setPercentage] = useState<number>(0)

    const [state, setState] = useState({
        text: '', 
        category: OUTLAY_TYPES[0], 
        format: PAYMENT_FORMATS[0], 
        level: LEVELS[0], 
        cost: DEFAULT_OUTLAY_COST
    })

    const {text, category, format, level, cost} = state

    const everyMonth = 'Ежемесячный'

    const [manageProfileOutlay] = useMutation(manageProfileOutlayM, {
        onCompleted(data) {
            buildNotification(data.manageProfileOutlay)
            updateProfileInfo(null)
        }
    })

    useMemo(() => {
        if (outlay !== null && outlay.format === everyMonth) {
            setPercentage(centum.percent(outlay.cost, profile.budget, 1))
        }
    }, [outlay])

    const onManageOutlay = (option: string) => {
        let budget = format === everyMonth ? option === 'create' ? profile.budget + cost : profile.budget - outlay.cost : profile.budget

        manageProfileOutlay({
            variables: {
                id: profile.shortid, option, text, category, format, level, cost, budget, collId: outlay !== null ? outlay.shortid : ''
            }
        })
    }

    return (
        <>
            {outlay === null ?
                    <>
                        <h2>Новый Расход</h2>

                        <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Источник ваших трат...' />

                        <div className='items small'>
                            {OUTLAY_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                        </div>

                        <h4 className='pale'>Стоимость (Бюджет: {profile.budget}{CURRENCY} / месяц)</h4>

                        <input value={cost} onChange={e => setState({...state, cost: parseInt(e.target.value)})} placeholder='Цена' type='text' />

                        <div className='items small'>
                            <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                                {PAYMENT_FORMATS.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                                {LEVELS.map(el => <option value={el}>{el}</option>)}
                            </select>
                        </div>                       
                   
                        {isNaN(cost) ? 
                                <button onClick={() => setState({...state, cost: DEFAULT_OUTLAY_COST})}>Сбросить</button>
                            :    
                                <button onClick={() => onManageOutlay('create')}>Добавить</button>
                        }

                        <DataPagination items={profile.outlays} setItems={setOutlays} label='Список расходов:' />
                        <div className='items medium'>
                            {outlays.map(el => 
                                <div onClick={() => setOutlay(el)} className='item card'>
                                    {centum.shorter(el.text)}
                                    <p className='pale'>{el.category}</p>
                                </div>
                            )}
                        </div>
                    </>
                :
                    <>
                        <CloseIt onClick={() => setOutlay(null)} />

                        <h2>{outlay.text} {outlay.format === everyMonth && `(${percentage}% от бюджета)`}</h2>

                        <div className='items small'>
                            <h4 className='pale'>Категория: {outlay.category}</h4>
                            <h4 className='pale'>Тип: {outlay.format}</h4>
                        </div>  
                    
                        <button onClick={() => onManageOutlay('delete')}>Удалить</button>
                    </>
            }
        </>
    )
}

export default AccountOutlaysPage