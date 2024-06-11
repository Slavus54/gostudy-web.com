import {TOWNS_API_ENDPOINT, TOWNS_API_KEY, SESSION_INFO_KEY, ACCOUNT_INFO_KEY} from '../env/env'

export const checkStorageData = (key, isLocal = true) => isLocal ? localStorage.getItem(key) === null : sessionStorage.getItem(key) === null 

// Towns API

export const getTownsFromServer = async () => {
    let data = await fetch(TOWNS_API_ENDPOINT)
    let result = await data.json()

    localStorage.setItem(TOWNS_API_KEY, JSON.stringify(result || []))
}

export const getTownsFromStorage = () => {
    return checkStorageData(TOWNS_API_KEY) ? [] : JSON.parse(localStorage.getItem(TOWNS_API_KEY))
}

// Current Session 

export const updateSession = name => {
    sessionStorage.setItem(SESSION_INFO_KEY, JSON.stringify(name))
}

export const getSession = () => {
    return checkStorageData(SESSION_INFO_KEY, false) ? null : JSON.parse(sessionStorage.getItem(SESSION_INFO_KEY))
}

// Profile Collections

export const updateProfileInfo = (profile) => {
    localStorage.setItem(ACCOUNT_INFO_KEY, JSON.stringify(profile))
    window.location.reload()
}

export const getProfileInfo = () => {
    return checkStorageData(ACCOUNT_INFO_KEY) ? null : JSON.parse(localStorage.getItem(ACCOUNT_INFO_KEY))
}