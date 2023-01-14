const Router = require('express').Router
const userController = require('../controllers/user-controller')
const router = new Router()
const {body} = require('express-validator')
const authMiddleware = require('../middlewares/auth-middleware')

router.post('/registration',
    body('login').notEmpty()
        .withMessage(' логин не должен быть пустым'),
    body('password')
        .isLength({ min: 3, max: 32 })
        .notEmpty()
        .withMessage('Пароль не должен быть пустым')
        // .withMessage('Длина пароля от 3 до 32 символов')
    ,
    userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/refresh', userController.refresh)
router.get('/users', authMiddleware, userController.getUsers)

module.exports = router
