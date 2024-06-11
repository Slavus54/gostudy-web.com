import AccountPersonalPage from '../components/pages/Account/parts/AccountPersonalPage'
import AccountGeoPage from '../components/pages/Account/parts/AccountGeoPage'
import AccountSecurityPage from '../components/pages/Account/parts/AccountSecurityPage'
import AccountOutlaysPage from '../components/pages/Account/parts/AccountOutlaysPage'
import AccountAchievementsPage from '../components/pages/Account/parts/AccountAchievementsPage'
import AccountCollectionsPage from '../components/pages/Account/parts/AccountCollectionsPage'
import AccountFeedbackPage from '../components/pages/Account/parts/AccountFeedbackPage'

import {AccountPart} from './types'

export const parts: AccountPart[] = [
    {
        url: './profile/account.png',
        component: AccountPersonalPage
    },
    {
        url: './profile/geo.png',
        component: AccountGeoPage
    },
    {
        url: './profile/security.png',
        component: AccountSecurityPage
    },
    {
        url: './profile/outlay.png',
        component: AccountOutlaysPage
    },
    {
        url: './profile/achievement.png',
        component: AccountAchievementsPage
    },
    {
        url: './profile/collections.png',
        component: AccountCollectionsPage
    },
    {
        url: './profile/feedback.png',
        component: AccountFeedbackPage
    }
]