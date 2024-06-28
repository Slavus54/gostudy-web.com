import {gql} from '@apollo/client'

export const getDiariesQ = gql`
    query {
        getDiaries {
            shortid
            name
            title
            category
            country
            level
            latestDate
            questions {
                shortid
                name
                content       
                language
                level
                reply
            }
            thoughts {
                shortid
                text
                category
                image
                dateUp
                likes
            }
        }
    }
`