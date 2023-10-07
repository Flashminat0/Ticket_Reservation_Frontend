import bcrypt from "bcryptjs-react"

export const storeNIC = (nic: string) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(nic, salt);

    localStorage.setItem('hash', hash)
    localStorage.setItem('nic', nic)

    return hash

}

export const checkNIC = async () => {
    const hash = localStorage.getItem('hash')!
    const nic = localStorage.getItem('nic')!

    return await bcrypt.compare(nic, hash);
}

export const removeNIC = () => {
    localStorage.removeItem('hash')
    localStorage.removeItem('nic')
}

export const checkLoggedInWithResistance = (): boolean => {
    return localStorage.getItem('hash') !== null && localStorage.getItem('nic') !== null
}