import {gql} from '@apollo/client'

export const createDiaryM = gql`
    mutation createDiary($name: String!, $id: String!, $title: String!, $category: String!, $country: String!, $level: String!, $latestDate: String!) {
        createDiary(name: $name, id: $id, title: $title, category: $category, country: $country, level: $level, latestDate: $latestDate) 
    }
`

export const getDiaryM = gql`
    mutation getDiary($id: String!) {
        getDiary(id: $id) {
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

export const manageDiaryQuestionM = gql`
    mutation manageDiaryQuestion($name: String!, $id: String!, $option: String!, $content: String!, $language: String!, $level: String!, $reply: String!, $collId: String!) {
        manageDiaryQuestion(name: $name, id: $id, option: $option, content: $content, language: $language, level: $level, reply: $reply, collId: $collId)
    }
`

export const manageDiaryThoughtM = gql`
    mutation manageDiaryThought($name: String!, $id: String!, $option: String!, $text: String!, $category: String!, $image: String!, $dateUp: String!, $likes: Float!, $collId: String!) {
        manageDiaryThought(name: $name, id: $id, option: $option, text: $text, category: $category, image: $image, dateUp: $dateUp, likes: $likes, collId: $collId)
    }
`