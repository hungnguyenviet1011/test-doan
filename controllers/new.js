import New from "../models/New.js";

export const createNew = async (req, res, next) => {
  const newDB = new New(req.body);
  try {
    const save = await newDB.save();
    return res.status(200).json(save);
  } catch (error) {
    next(error);
  }
};

export const updateNew = async (req, res, next) => {
  const newId = req.params.id;
  try {
    const update = await New.findByIdAndUpdate(
      newId,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(update);
  } catch (error) {
    next(error);
  }
};

export const deleteNew = async (req, res, next) => {
  const newId = req.params.id;
  try {
    await New.findByIdAndDelete(newId);

    return res.status(200).json("delete new successfully");
  } catch (error) {
    next(error);
  }
};

export const getNew = async (req, res, next) => {
  const newId = req.params.id;

  try {
    const newDB = await New.findById(newId);

    return res.status(200).json(newDB);
  } catch (error) {
    next(error);
  }
};

export const getNews = async (req, res, next) => {
  try {
    const news = await New.find();

    return res.status(200).json(news);
  } catch (error) {
    next(error);
  }
};
