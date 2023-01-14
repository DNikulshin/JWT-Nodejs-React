import React, {FC, useContext, useState} from 'react'
import {Context} from '../index'
import {observer} from 'mobx-react-lite'

const LoginForm: FC = () => {
    const [login, setLogin] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const {store} = useContext(Context)

    return (
        <div>
            <input
                onChange={e => setLogin(e.target.value)}
                value={login}
                type='text'
                placeholder='Введите логин'
                autoComplete='true'
            />

            <input
                onChange={e => setPassword(e.target.value)}
                value={password}
                type='text'
                placeholder='Введите пароль'
            />
            <button onClick={() => store.login(login, password)}>Войти</button>
            <button onClick={() => store.registration(login, password)}>Регистрация</button>
        </div>
    )
}

export default observer(LoginForm)
