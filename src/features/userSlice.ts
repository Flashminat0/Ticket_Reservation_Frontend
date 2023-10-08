import {createSlice} from '@reduxjs/toolkit'

export type UserRoles = 'ADMIN' | 'BACKOFFICE' | 'TRAVEL AGENT' | 'CUSTOMER' | 'UNREGISTERED'

export interface UserState {
    name : string,
    loggedIn: boolean,
    nic: string,
    isAdmin: boolean,
    userRoles: UserRoles[]
}

const initialState: UserState = {
    name: '',
    loggedIn: false,
    nic: '',
    isAdmin: false,
    userRoles: ['UNREGISTERED']
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.name = action.payload.name
            state.loggedIn = action.payload.loggedIn
            state.nic = action.payload.nic
            state.isAdmin = action.payload.isAdmin
            state.userRoles = action.payload.userRoles
        },
        logout: (state) => {
            state.name = ''
            state.loggedIn = false
            state.nic = ''
            state.isAdmin = false
            state.userRoles = ['UNREGISTERED']
        }
    },
})

// Action creators are generated for each case reducer function
export const {login, logout} = userSlice.actions

export default userSlice.reducer