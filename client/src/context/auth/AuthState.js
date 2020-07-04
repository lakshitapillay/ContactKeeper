import React, { useReducer } from 'react'
import axios from 'axios'
import AuthContext from './authContext'
import authReducer from './authReducer'
import { setAuthToken } from '../../utils/setAuthToken'
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_ERRORS
} from '../types'

const AuthState = props => {
    const initialState = {
        token: localStorage.getItem('token'),
        isAuthenticated: null,
        user: null,
        loading: true,
        error: null
    }
    const [state, dispatch] = useReducer(authReducer, initialState);

    const register = async formData => {
        const config = {
            header: {
                'Content-Type': 'application/json'
            }
        }
        try {
            const res = await axios.post('/api/users', formData, config);
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            })
            loadUser();
        } catch (error) {
            dispatch({
                type: REGISTER_FAIL,
                payload: error.response.data.msg
            })
        }
    }

    const login = async formData => {
        const config = {
            header: {
                'Content-Type': 'application/json'
            }
        }
        try {
            const res = await axios.post('/api/auth', formData, config);
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            })
            loadUser();
        } catch (error) {
            console.log(error.response.data.msg, 'in auth state');
            dispatch({
                type: LOGIN_FAIL,
                payload: error.response.data.msg
            })
        }
    }

    const logout = () => dispatch({ type: LOGOUT });

    const clearError = () => dispatch({ type: CLEAR_ERRORS });

    const loadUser = async () => {
        //load token into global header
        if (localStorage.token) {
            setAuthToken(localStorage.token);
        }
        try {
            const res = await axios.get('/api/auth');
            dispatch({ type: USER_LOADED, payload: res.data });
        } catch (error) {
            dispatch({ type: AUTH_ERROR });
        }
    }

    return (
        <AuthContext.Provider
            value={{
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                loading: state.loading,
                error: state.error,
                register,
                clearError,
                loadUser,
                login,
                logout
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}
export default AuthState;