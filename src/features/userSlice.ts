import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'

export enum UserRoles {
    ADMIN = 'ADMIN',
    BACKOFFICE = 'BACKOFFICE',
    TRAVEL_AGENT = 'TRAVEL_AGENT',
    CUSTOMER = 'CUSTOMER',
    UNREGISTERED = 'UNREGISTERED'
}

export interface UserState {
    nic: string,
    isAdmin: boolean,
    userRoles?: UserRoles[]
}

const initialState: UserState = {
    nic: '',
    isAdmin: false,
    userRoles: [UserRoles.UNREGISTERED]
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

        login: (state, action) => {
            state.nic = action.payload.nic
            state.isAdmin = action.payload.isAdmin
            state.userRoles = action.payload.userRoles
        },
        logout: (state) => {
            state.nic = ''
            state.isAdmin = false
            state.userRoles = [UserRoles.UNREGISTERED]
        }
    },
})

// Action creators are generated for each case reducer function
export const {login, logout} = userSlice.actions

export default userSlice.reducer