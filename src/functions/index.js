export const getLoggedInUserId = () => {

    const id = localStorage.getItem("id")
    return id
}

export const getToken = () => {

    const token = localStorage.getItem("token")
    return token
} 