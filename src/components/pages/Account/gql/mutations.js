import {gql} from '@apollo/client'

export const getProfileM = gql`
    mutation getProfile($id: String!) {
        getProfile(id: $id) {
            shortid
            name
            password
            telegram
            country
            stage
            region
            cords {
                lat
                long
            }
            image
            timestamp
            budget
            outlays {
                shortid
                text
                category
                format
                level
                cost
            }
            achievements {
                shortid
                title
                category
                url
                image
                likes
                dateUp
            }
            account_components {
                shortid
                title
                url
            }
        }
    }
`

export const updateProfilePersonalInfoM = gql`
    mutation updateProfilePersonalInfo($id: String!, $country: String!, $stage: String!, $image: String!) {
        updateProfilePersonalInfo(id: $id, country: $country, stage: $stage, image: $image)
    }
`

export const updateProfileGeoInfoM = gql`
    mutation updateProfileGeoInfo($id: String!, $region: String!, $cords: ICord!) {
        updateProfileGeoInfo(id: $id, region: $region, cords: $cords)
    }
`

export const updateProfilePasswordM = gql`
    mutation updateProfilePassword($id: String!, $current_password: String!, $new_password: String!) {
        updateProfilePassword(id: $id, current_password: $current_password, new_password: $new_password)
    }
`

export const manageProfileOutlayM = gql`
    mutation manageProfileOutlay($id: String!, $option: String!, $text: String!, $category: String!, $format: String!, $level: String!, $cost: Float!, $budget: Float!, $collId: String!) {
        manageProfileOutlay(id: $id, option: $option, text: $text, category: $category, format: $format, level: $level, cost: $cost, budget: $budget, collId: $collId)
    }
`

export const manageProfileAchievementM = gql`
    mutation manageProfileAchievement($id: String!, $option: String!, $title: String!, $category: String!, $url: String!, $image: String!, $likes: Float!, $dateUp: String!, $collId: String!)  {
        manageProfileAchievement(id: $id, option: $option, title: $title, category: $category, url: $url, image: $image, likes: $likes, dateUp: $dateUp, collId: $collId) 
    }
`