import {gql} from '@apollo/client'

export const createUniversityM = gql`
    mutation createUniversity($name: String!, $id: String!, $title: String!, $category: String!, $country: String!, $format: String!, $century: String!, $region: String!, $cords: ICord!, $faculty: String!, $competition: Float!) {
        createUniversity(name: $name, id: $id, title: $title, category: $category, country: $country, format: $format, century: $century, region: $region, cords: $cords, faculty: $faculty, competition: $competition)
    }
`

export const getUniversityM = gql`
    mutation getUniversity($id: String!) {
        getUniversity(id: $id) {
            shortid
            name
            title
            category
            country
            format
            century
            region
            cords {
                lat
                long
            }
            faculty
            competition
            locations {
                shortid
                name
                title
                category
                image
                cords {
                    lat
                    long
                }
                likes
                dateUp
            }
            facts {
                shortid
                name
                text
                level
                status
                isTruth
            }
        }
    }
`

export const manageUniversityLocationM = gql`
    mutation manageUniversityLocation($name: String!, $id: String!, $option: String!, $title: String!, $category: String!, $image: String!, $cords: ICord!, $likes: Float!, $dateUp: String!, $collId: String!) {
        manageUniversityLocation(name: $name, id: $id, option: $option, title: $title, category: $category, image: $image, cords: $cords, likes: $likes, dateUp: $dateUp, collId: $collId) 
    }
`

export const updateUniversityInformationM = gql`
    mutation updateUniversityInformation($name: String!, $id: String!, $faculty: String!, $competition: Float!) {
        updateUniversityInformation(name: $name, id: $id, faculty: $faculty, competition: $competition) 
    }
`

export const publishUniveristyFactM = gql`
    mutation publishUniveristyFact($name: String!, $id: String!, $text: String!, $level: String!, $status: String!, $isTruth: Boolean!)  {
        publishUniveristyFact(name: $name, id: $id, text: $text, level: $level, status: $status, isTruth: $isTruth) 
    }
`