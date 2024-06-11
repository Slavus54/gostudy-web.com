import {gql} from '@apollo/client'

export const getMaterialsQ = gql`   
    query {
        getMaterials {
            shortid
            name
            title
            category
            course
            link
            format
            url
            conspects {   
                shortid
                name
                text
                category
                image
                likes
            }
            terms {
                shortid
                name
                title
                translation
                language
                dateUp
            }
        }
    }
`