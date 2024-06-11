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

export const manageProfileAchievementM = gql`
    mutation manageProfileAchievement($id: String!, $option: String!, $title: String!, $category: String!, $url: String!, $image: String!, $likes: Float!, $dateUp: String!, $collId: String!)  {
        manageProfileAchievement(id: $id, option: $option, title: $title, category: $category, url: $url, image: $image, likes: $likes, dateUp: $dateUp, collId: $collId) 
    }
`