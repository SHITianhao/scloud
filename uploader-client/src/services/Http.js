import axios from 'axios';
import Storage from './Storage';
import { STORAGE_TOKEN_KEY } from '../components/constants';

const getHeaders = (auth, contentType='application/json') => {
    if(auth) {
        return {
            'Content-Type': contentType,
            'Authorization': `Bearer ${Storage.get(STORAGE_TOKEN_KEY)}`
        }
    } else {
        return {
            'Content-Type': 'application/json'
        }
    }
}

/**
 * 
 * @param {*} url 
 * @param {*} queries : {'key':'value'}
 */
export const GET = (url, queries={}, auth=true, contentType='application/json', responseType="json") => {
    return axios.get(`${url}`, {
        headers: getHeaders(auth, contentType),
        params: queries,
        responseType
    })
}

/**
 * 
 * @param {*} url 
 * @param {*} queries : {'key':'value'}
 */
export const DELETE = (url, queries={}, auth=true, contentType='application/json', responseType="json") => {
    return axios.delete(`${url}`, {
        headers: getHeaders(auth, contentType),
        params: queries,
        responseType
    })
}

/**
 * 
 * @param {*} url 
 * @param {*} queries : {'key':'value'}
 */
export const POST = (url, body={}, auth=true, contentType='application/json', responseType="json") => {
    return axios.post(`${url}`, body, {
        headers: getHeaders(auth, contentType),
        responseType
    })
}