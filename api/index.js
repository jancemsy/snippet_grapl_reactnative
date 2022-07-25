import axios from "axios";

const config = require('../config.json');
const url = `${config.endpoint}/api` || "https://api-staging.grapl.it/api";


export const login = (data) => axios.post(`${url}/auth`, data)
export const getUser = (data) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${data}`
        }
    }

    return axios.post(`${url}/users/info`, {}, config)
}

export const getSpaces = (data) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${data}`
        }
    }

    return axios.get(`${url}/spaces/rooms`, config)
}

export const createSpaces = (data) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${data}`
        }
    }

    return axios.post(`${url}/spaces/`, {}, config)
}

export const getMe = (data) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${data}`
        }
    }

    return axios.post(`${url}/users/me`, {}, config)
}

export const getTwilioToken = (identity) => {
    return axios.get(`https://grapl-twilio-2351-dev.twil.io/token-service?identity=${identity}`)
}

export const guestJoin = (data) => {
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }


    return axios.post(`${url}/signup/guest-mobile`, data, config)

}

export const forgotPass = (data) => {

    return axios.post(`${url}/forgot-password`, data)

}

export const magicLink = (data) => {

    return axios.post(`${url}/auth/magic-link`, data)

}

export const signup = (data) => axios.post(`${url}/signup/create-mobile`, data)

export const test = () => axios.get(`${url}/signup/test`)
