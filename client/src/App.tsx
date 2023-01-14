import React, {FC, useContext, useEffect, useState} from 'react'
import './App.css'
import LoginForm from './components/LoginForm'
import {Context} from './index'
import {observer} from 'mobx-react-lite'
import {IUser} from "./models/IUser";
import UserService from "./services/UserService";

const App: FC = () => {
    const {store} = useContext(Context)
    const [users, setUsers] = useState<IUser[]>([])

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
    }, [])

    async function getUsers() {
        try {
            const response = await UserService.fetchUsers()
            setUsers(response.data)
        } catch (e) {
            console.log(e)
        }
    }

    if (store.isLoading) {
        return (
            <div>Загрузка...</div>
        )
    }

    if (!store.isAuth) {
        return (
            <div>
                <LoginForm/>
            </div>


        )
    }
    return (
        <div>
            <h3>{store.isAuth ? `Пользователь ${store.user.login} авторизован` : 'Нет авторизации'}</h3>
            <button onClick={() => store.logout()}>выйти</button>
            <div>
                <button onClick={getUsers}>Получить список пользователей</button>
            </div>
            {
                users.map(user =>
                    <div key={user.login}>{user.login}</div>
                )
            }
        </div>
    )
}

export default observer(App)
