import PostModel from '../models/Post.js';
import mongoose from 'mongoose';
export const fetchPost = async (req, res, next) => {
  try {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        message: 'Недопустимый идентификатор поста',
      });
    }

    const post = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        new: true,
      },
    ).populate('user');

    if (!post) {
      return res.status(400).json({
        message: 'Не удалось найти статью',
      });
    }
    console.log('Post fetched successfully:', post); // Добавлено логирование
    req.post = post;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};
