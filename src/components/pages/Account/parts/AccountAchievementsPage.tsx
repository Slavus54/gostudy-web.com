import React, {useState} from 'react'
import {useMutation} from '@apollo/client'
import {centum, datus} from '../../../../shared/libs/libs'
import {updateProfileInfo} from '../../../../utils/storage'
import {buildNotification} from '../../../../utils/notifications'
import {classHandler} from '../../../../utils/css'
import ImageLoader from '../../../../shared/UI/ImageLoader'
import ImageLook from '../../../../shared/UI/ImageLook'
import DataPagination from '../../../../shared/UI/DataPagination'
import CloseIt from '../../../../shared/UI/CloseIt'
import {manageProfileAchievementM} from '../gql/mutations'
import {ACHIEVEMENT_TYPES} from '../env'
import {AccountPropsType} from '../../../../env/types'

const AccountAchievementsPage: React.FC<AccountPropsType> = ({profile}) => {    
    const [achievements, setAchievements] = useState<any[]>([])
    const [achievement, setAchievement] = useState<any | null>(null)

    const [image, setImage] = useState<string>('')

    const [state, setState] = useState({
        title: '', 
        category: ACHIEVEMENT_TYPES[0], 
        url: '', 
        dateUp: datus.now('date')
    })

    const {title, category, url, dateUp} = state

    const [manageProfileAchievement] = useMutation(manageProfileAchievementM, {
        onCompleted(data) {
            buildNotification(data.manageProfileAchievement)
            updateProfileInfo(null)
        }
    })

    const onManageAchievement = (option: string) => {
        manageProfileAchievement({
            variables: {
                id: profile.shortid, option, title, category, url, image, likes: Number(achievement !== null), dateUp, collId: achievement !== null ? achievement.shortid : ''
            }
        })
    }

    return (
        <>
            {achievement === null ?
                    <>
                        <h2>Новое Достижение</h2>
                        <h4 className='pale'>Поделитесь вашим результатом с миром</h4>

                        <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Опишите это...' />

                        <div className='items small'>
                            {ACHIEVEMENT_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                        </div>

                        <input value={url} onChange={e => setState({...state, url: e.target.value})} placeholder='URL' type='text' />

                        <ImageLoader setImage={setImage} />

                        <button onClick={() => onManageAchievement('create')}>Опубликовать</button>

                        <DataPagination items={profile.achievements} setItems={setAchievements} label='Портфолио достижений:' />
                        <div className='items small'>
                            {achievements.map(el => 
                                <div onClick={() => setAchievement(el)} className='item card'>
                                    {centum.shorter(el.title)}
                                    <p className='pale'>{el.dateUp}</p>
                                </div>
                            )}
                        </div>
                    </>
                :
                    <>
                        <CloseIt onClick={() => setAchievement(null)} />

                        {achievement.image !== '' && <ImageLook src={achievement.image} className='photo' />}

                        <h2>{achievement.title} ({achievement.dateUp})</h2>

                        <div className='items small'>
                            <h4 className='pale'>Категория: {achievement.category}</h4>
                            <h4 className='pale'><b>{achievement.likes}</b> лайков</h4>
                        </div>  
                    
                        <button onClick={() => onManageAchievement('delete')}>Удалить</button>
                    </>
            }
        </>
    )
}

export default AccountAchievementsPage