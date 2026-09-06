

export const checkIdentityMatch = (tokenID: string, id: string, needMatch: boolean) => {

    if (tokenID === id) {
        if (needMatch) {
            return true
        }
    }
    else {
        if (needMatch) {
            return false
        }
        return true
    }
    return false
}