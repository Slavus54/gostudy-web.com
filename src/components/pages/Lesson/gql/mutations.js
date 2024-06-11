import {gql} from '@apollo/client'

export const createLessonM = gql`
    mutation createLesson($name: String!, $id: String!, $title: String!, $category: String!, $format: String!, $language: String!, $persons: [String]!, $rating: Float!) {
        createLesson(name: $name, id: $id, title: $title, category: $category, format: $format, language: $language, persons: $persons, rating: $rating) 
    }
`

export const getLessonM = gql`
    mutation getLesson($id: String!) {
        getLesson(id: $id) {
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

export const manageLessonWritingM = gql`
    mutation manageLessonWriting($name: String!, $id: String!, $option: String!, $title: String!, $category: String!, $font: String!, $image: String!, $likes: Float!, $collId: String!) {
        manageLessonWriting(name: $name, id: $id, option: $option, title: $title, category: $category, font: $font, image: $image, likes: $likes, collId: $collId)
    }
`

export const updateLessonRatingM = gql`
    mutation updateLessonRating($name: String!, $id: String!, $rating: Float!) {
        updateLessonRating(name: $name, id: $id, rating: $rating)
    }
`

export const publishLessonQuoteM = gql`
    mutation publishLessonQuote($name: String!, $id: String!, $text: String!, $author: String!, $dateUp: String!) {
        publishLessonQuote(name: $name, id: $id, text: $text, author: $author, dateUp: $dateUp)
    }
`