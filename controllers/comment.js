import Comment from "../models/comment.js";

export const createComment = async (req, res, next) => {
  const comment = new Comment(req.body);
  try {
    console.log("11212121");
    await comment.save();
    res.status(200).json({
      status: 200,
      message: "Comment create successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getComment = async (req, res, next) => {
  const productId = req.query;

  try {
    const comment = await Comment.find({
      productId: productId,
    });

    return res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};
