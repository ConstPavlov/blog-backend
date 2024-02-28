import Comment from '../models/Comment.js';
import PostModel from '../models/Post.js';

export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate('user').exec();
    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Неудалось получить комментарии',
    });
  }
};
export const getLastComments = async (req, res) => {
  try {
    const comments = await Comment.find().limit(4).populate('user').exec();
    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Неудалось получить комментарии',
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const doc = new Comment({
      text: req.body.text,
      user: req.userId,
      post: postId,
    });

    const comment = await doc.save();

    await PostModel.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

    res.status(201).json({ message: 'Комменнтарий создан', comment: comment });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: 'Неудалось создать комментарий',
    });
  }
};
export const getCommentsForPost = async (req, res) => {
  try {
    const post = req.post;

    const comments = await Comment.find({ post: post._id }).populate('user');
    // console.log(comments);
    if (!comments || comments.length === 0) {
      return res.status(400).json({
        message: 'Комментарии не найдены',
      });
    }
    console.log('Comments fetched successfully:', comments.comments); // Добавлено логирование
    res.json({ comments });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить комментарии',
    });
  }
};
