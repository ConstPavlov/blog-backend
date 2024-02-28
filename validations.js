import { body } from 'express-validator';

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
  body('fullName', 'Укажите имя').isLength({ min: 3 }).isString(),
  body('avatar', 'Не верная ссылка на аватарку').optional().isURL(),
];

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
];

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
  body('text', 'Введите текст статьи').isLength({ min: 10 }).isString(),
  body('tags', 'Не верный формат тэгов(укажите массив)').optional().isString(),
  body('imageUrl', 'Неверная ссылка на изображенние').optional().isString(),
];

export const commentValidation = [body('text', 'Введите минимум 5 букв').isLength({ min: 5 })];
