import {gql} from '@apollo/client'

export const createPicnicM = gql`
    mutation createPicnic($name: String!, $id: String!, $title: String!, $category: String!, $language: String!, $level: String!, $dateUp: String!, $time: String!, $region: String!, $cords: ICord!, $role: String!) {
        createPicnic(name: $name, id: $id, title: $title, category: $category, language: $language, level: $level, dateUp: $dateUp, time: $time, region: $region, cords: $cords, role: $role)
    }
`

export const getPicnicM = gql`
    mutation getPicnic($id: String!) {
        getPicnic(id: $id) {
            shortid
            name
            title
            category
            language
            level
            dateUp
            time
            region
            cords {
                lat
                long
            }
            members {
                shortid
                name
                role
            }
            dishes {
                shortid
                name
                title
                category
                cost
                image
                likes
            }
            themes {
                shortid
                name
                text
                format
                dateUp
            }
        }
    }
`

export const managePicnicStatusM = gql`
    mutation managePicnicStatus($name: String!, $id: String!, $option: String!, $role: String!) {
        managePicnicStatus(name: $name, id: $id, option: $option, role: $role)
    }
`

export const offerPicnicThemeM = gql`
    mutation offerPicnicTheme($name: String!, $id: String!, $text: String!, $format: String!, $dateUp: String!) {
        offerPicnicTheme(name: $name, id: $id, text: $text, format: $format, dateUp: $dateUp)
    }
`

export const managePicnicDishM = gql`
    mutation managePicnicDish($name: String!, $id: String!, $option: String!, $title: String!, $category: String!, $cost: Float!, $image: String!, $likes: Float!, $collId: String!) {
        managePicnicDish(name: $name, id: $id, option: $option, title: $title, category: $category, cost: $cost, image: $image, likes: $likes, collId: $collId)
    }
`