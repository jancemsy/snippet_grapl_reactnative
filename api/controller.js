import * as api from './index'

export const login = async (data) => {
    try {
        const loginData = await api.login(data)

        return loginData.data

    } catch (error) {
        console.log(error.message);
    }
}

export const getSpaces = async (data) => {
    try {
        const spaces = await api.getSpaces(data)

        return spaces

    } catch (error) {
        console.log(error.message);
    }
}

export const getUser = async (data) => {
    try {
        const userData = await api.getUser(data)

        return userData.data

    } catch (error) {
        console.log(error.message);
    }
}

export const getMe = async (data) => {
	try {
		 const me = await api.getMe(data)

		 return me.data

	} catch (error) {
		console.log('error here 1');
		 console.log(error);
	}
}

export const getTwilioToken = async (data) => {
	try {
		 const twilioToken = await api.getTwilioToken(data)

		 return twilioToken.data

	} catch (error) {
		 console.log(error);
	}
}

export const guestJoin = async (data) => {
    try {
        const token = await api.guestJoin(data)

        return token.data

    } catch (error) {
        console.log(error.message);
    }
}


export const signup = async (data) => {
    try {
        const response = await api.signup(data)

        return response.data

    } catch (error) {
        console.log(error.message);
    }
}

export const forgotPass = async (data) => {
    try {
        const response = await api.forgotPass(data)

        return response.data

    } catch (error) {
        console.log(error.message);
    }
}

export const magicLink = async (data) => {
    try {
        const response = await api.magicLink(data)

        return response.data

    } catch (error) {
        console.log(error.message);
    }
}
