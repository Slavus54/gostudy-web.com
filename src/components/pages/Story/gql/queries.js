import {gql} from '@apollo/client'

export const getStoriesQ = gql`
    query {
        getStories {
            shortid
            name
            title
            category
            country
            level
            status
            image
            questions {
                shortid
                name
                text
                format
                reply
                likes
            }
            products {
                shortid
                name
                title
                category
                cost
                dateUp
            }
        }
    }
`