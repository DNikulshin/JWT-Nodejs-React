const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const UserDto = require('../dtos/user-dto')
const tokenService = require('../service/token-service')
const ApiError = require('../exceptions/api-error')

class UserService {
    async registration (login, password) {
        const candidate = await UserModel.findOne({ login })
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь ${login} уже существует`)
        }
        const hasPassword = await bcrypt.hash(password, 3)
        const user = await UserModel.create({ login, password: hasPassword })

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }

    async login (login, password) {
        const user = await UserModel.findOne({ login })
        if (!user) {
            throw ApiError.BadRequest(`Пользователь ${login} не найден`)
        }

        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль')
        }

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }

    async logout (refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token

    }

    async refresh (refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }

    async getAllUsers () {
        const users = await UserModel.find()
        return users
    }
}

module.exports = new UserService()
