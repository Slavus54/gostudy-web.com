import {gql} from '@apollo/client'

export const getUniversitiesQ = gql`
    query {
        getUniversities {
            shortid
            name
            title
            category
            country
            format
            region
            cords {
                lat
                long
            }
        }
    }
`