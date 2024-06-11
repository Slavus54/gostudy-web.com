import {gql} from '@apollo/client'

export const createMaterialM = gql`
    mutation createMaterial($name: String!, $id: String!, $title: String!, $category: String!, $course: Float!, $link: String!, $format: String!, $url: String!) {
        createMaterial(name: $name, id: $id, title: $title, category: $category, course: $course, link: $link, format: $format, url: $url)
    }
`

export const getMaterialM = gql`   
    mutation getMaterial($id: String!) {
        getMaterial(id: $id) {
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

export const manageMaterialConspectM = gql`
    mutation manageMaterialConspect($name: String!, $id: String!, $option: String!, $text: String!, $category: String!, $image: String!, $likes: Float!, $collId: String!) {
        manageMaterialConspect(name: $name, id: $id, option: $option, text: $text, category: $category, image: $image, likes: $likes, collId: $collId)
    }
`

export const updateMaterialLinkM = gql`
    mutation updateMaterialLink($name: String!, $id: String!, $link: String!, $format: String!, $url: String!) {
        updateMaterialLink(name: $name, id: $id, link: $link, format: $format, url: $url)
    }
`

export const publishMaterialTermM = gql`
    mutation publishMaterialTerm($name: String!, $id: String!, $title: String!, $translation: String!, $language: String!, $dateUp: String!) {
        publishMaterialTerm(name: $name, id: $id, title: $title, translation: $translation, language: $language, dateUp: $dateUp)
    }
`