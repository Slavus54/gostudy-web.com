import {gql} from '@apollo/client'

export const createStoryM = gql`
    mutation createStory($name: String!, $id: String!, $title: String!, $category: String!, $country: String!, $level: String!, $status: String!, $image: String!) {
        createStory(name: $name, id: $id, title: $title, category: $category, country: $country, level: $level, status: $status, image: $image) 
    }
`

export const getStoryM = gql`
    mutation getStory($id: String!) {
        getStory(id: $id) {
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

export const manageStoryQuestionM = gql`
    mutation manageStoryQuestion($name: String!, $id: String!, $option: String!, $text: String!, $format: String!, $reply: String!, $likes: Float!, $collId: String!) {
        manageStoryQuestion(name: $name, id: $id, option: $option, text: $text, format: $format, reply: $reply, likes: $likes, collId: $collId) 
    }
`

export const updateStoryInformationM = gql`
    mutation updateStoryInformation($name: String!, $id: String!, $status: String!, $image: String!) {
        updateStoryInformation(name: $name, id: $id, status: $status, image: $image) 
    }
`

export const offerStoryProductM = gql`
    mutation offerStoryProduct($name: String!, $id: String!, $title: String!, $category: String!, $cost: Float!, $dateUp: String!) {
        offerStoryProduct(name: $name, id: $id, title: $title, category: $category, cost: $cost, dateUp: $dateUp) 
    }
`