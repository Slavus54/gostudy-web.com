import {gql} from '@apollo/client'

export const getPicnicsQ = gql`
    query {
        getPicnics {
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