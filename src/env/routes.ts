// Static Pages

import Home from '../components/head/Home'
import Courses from '../components/pages/Courses/Courses'

// Authentication's Components

import Register from '../components/pages/Authentication/Register'
import Login from '../components/pages/Authentication/Login'

// University's Components

import CreateUniversity from '../components/pages/University/CreateUniversity'
import Universities from '../components/pages/University/Universities'
import University from '../components/pages/University/University'

// Material's Components

import CreateMaterial from '../components/pages/Material/CreateMaterial'
import Materials from '../components/pages/Material/Materials'
import Material from '../components/pages/Material/Material'

// Picnic's Components

import CreatePicnic from '../components/pages/Picnic/CreatePicnic'
import Picnics from '../components/pages/Picnic/Picnics'
import Picnic from '../components/pages/Picnic/Picnic'

// Lesson's Components

import CreateLesson from '../components/pages/Lesson/CreateLesson'
import Lessons from '../components/pages/Lesson/Lessons'
import Lesson from '../components/pages/Lesson/Lesson'

// Diary's Components

import CreateDiary from '../components/pages/Diary/CreateDiary'
import Diaries from '../components/pages/Diary/Diaries'
import Diary from '../components/pages/Diary/Diary'

// Profile's Components

import Profiles from '../components/pages/Profile/Profiles'
import Profile from '../components/pages/Profile/Profile'

import {RouteItem, RouteStatuses} from './types'

export const items: RouteItem[] = [
    {
        title: 'Главная',
        url: '/',
        component: Home,
        status: RouteStatuses.Allowed,
        visible: true
    },
    {
        title: 'Программы',
        url: '/courses',
        component: Courses,
        status: RouteStatuses.StrangerOnly,
        visible: true
    },
    {
        title: 'Университеты',
        url: '/universities',
        component: Universities,
        status: RouteStatuses.RegisteredOnly,
        visible: true
    },
    {
        title: 'Материалы',
        url: '/materials',
        component: Materials,
        status: RouteStatuses.RegisteredOnly,
        visible: true
    },
    {
        title: 'Пикники',
        url: '/picnics',
        component: Picnics,
        status: RouteStatuses.RegisteredOnly,
        visible: true
    },
    {
        title: 'Занятия',
        url: '/lessons',
        component: Lessons,
        status: RouteStatuses.RegisteredOnly,
        visible: true
    },
    {
        title: 'Дневники',
        url: '/diares',
        component: Diaries,
        status: RouteStatuses.RegisteredOnly,
        visible: true
    },
    {
        title: 'Пользователи',
        url: '/profiles',
        component: Profiles,
        status: RouteStatuses.RegisteredOnly,
        visible: true
    },
    {
        title: '',
        url: '/register',
        component: Register,
        status: RouteStatuses.StrangerOnly,
        visible: false
    },
    {
        title: '',
        url: '/login',
        component: Login,
        status: RouteStatuses.StrangerOnly,
        visible: false
    },
    {
        title: '',
        url: '/create-university/:id',
        component: CreateUniversity,
        status: RouteStatuses.RegisteredOnly,
        visible: false
    },
    {
        title: '',
        url: '/university/:id',
        component: University,
        status: RouteStatuses.RegisteredOnly,
        visible: false
    },
    {
        title: '',
        url: '/create-material/:id',
        component: CreateMaterial,
        status: RouteStatuses.RegisteredOnly,
        visible: false
    },
    {
        title: '',
        url: '/material/:id',
        component: Material,
        status: RouteStatuses.RegisteredOnly,
        visible: false
    },
    {
        title: '',
        url: '/create-picnic/:id',
        component: CreatePicnic,
        status: RouteStatuses.RegisteredOnly,
        visible: false
    },
    {
        title: '',
        url: '/picnic/:id',
        component: Picnic,
        status: RouteStatuses.RegisteredOnly,
        visible: false
    },
    {
        title: '',
        url: '/create-lesson/:id',
        component: CreateLesson,
        status: RouteStatuses.RegisteredOnly,
        visible: false
    },
    {
        title: '',
        url: '/lesson/:id',
        component: Lesson,
        status: RouteStatuses.RegisteredOnly,
        visible: false
    },
    {
        title: '',
        url: '/create-diary/:id',
        component: CreateDiary,
        status: RouteStatuses.RegisteredOnly,
        visible: false
    },
    {
        title: '',
        url: '/diary/:id',
        component: Diary,
        status: RouteStatuses.RegisteredOnly,
        visible: false
    },
    {
        title: '',
        url: '/profile/:id',
        component: Profile,
        status: RouteStatuses.RegisteredOnly,
        visible: false
    },
]