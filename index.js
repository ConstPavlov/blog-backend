import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { fetchPost } from './middlewares/fetchPost.js';

import mongoose from 'mongoose';

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
  commentValidation,
} from './validations.js';

import { checkAuth, handleValidatorErrors } from './utils/index.js';

import { UserController, PostController, CommentController } from './controllers/index.js';

mongoose
  .connect('mongodb+srv://admin:qqqqq@cluster0.xmfpnea.mongodb.net/blog')
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());

app.use(cors());
app.use('/uploads', express.static('uploads'));

// Роуты авторизации и юзера
app.post('/auth/register', registerValidation, handleValidatorErrors, UserController.register);
app.post('/auth/login', loginValidation, handleValidatorErrors, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// Роуты Постов
app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/popular', PostController.getPopularPost);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', fetchPost, PostController.getOne);
app.get('/posts/:id/comments', fetchPost, CommentController.getCommentsForPost);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidatorErrors,
  PostController.update,
);
app.post('/posts', checkAuth, postCreateValidation, handleValidatorErrors, PostController.create);

// Роуты Комментариев

app.get('/comments', checkAuth, CommentController.getAllComments);
app.get('/lastComments', checkAuth, CommentController.getLastComments);
app.post('/add-comment:id', checkAuth, commentValidation, CommentController.createComment);

const PORT = 4444;

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server Ok');
});