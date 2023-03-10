import $api from '../http'
import {AxiosResponse} from 'axios'
import {AuthResponse} from '../models/response/AuthResponse'

export default class AuthService {
    static async login(login: String, password: String): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/login', {login, password})
    }

    static async registration(login: String, password: String): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/registration', {login, password})
    }

    static async logout(): Promise<void> {
        return $api.post('/logout')
    }
}
