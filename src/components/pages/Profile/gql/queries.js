import {gql} from '@apollo/client'

export const getProfilesQ = gql`
    query {
        getProfiles {
            shortid
            name
            country
            stage
            region
            cords {
                lat
                long
            }
        }
    }
`