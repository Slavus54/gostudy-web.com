import {gql} from '@apollo/client'

export const registerProfileM = gql`
    mutation registerProfile($name: String!, $password: String!, $telegram: String!, $country: String!, $stage: String!, $region: String!, $cords: ICord!, $image: String!, $timestamp: String!, $budget: Float!) {
        registerProfile(name: $name, password: $password, telegram: $telegram, country: $country, stage: $stage, region: $region, cords: $cords, image: $image, timestamp: $timestamp, budget: $budget) {
            shortid
            name
        }
    }
`

export const loginProfileM = gql`
    mutation loginProfile($name: String!, $password: String!, $timestamp: String!) {
        loginProfile(name: $name, password: $password, timestamp: $timestamp) {
            shortid
            name
        }
    }
`