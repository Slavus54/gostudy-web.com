import {gql} from '@apollo/client'

export const getLessonsQ = gql`
    query {
        getLessons {
            shortid
            name
            title
            category
            format
            language
            persons
            rating
            writings {
                shortid
                name
                title
                category
                font
                image
                likes
            }
            quotes {
                shortid
                name
                text
                author
                dateUp
            }
        }
    }
`