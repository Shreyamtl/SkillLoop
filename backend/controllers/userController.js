import User from '../models/User.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { skillsToTeach, skillsToLearn } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (skillsToTeach !== undefined) user.skillsToTeach = skillsToTeach;
    if (skillsToLearn !== undefined) user.skillsToLearn = skillsToLearn;
    
    await user.save();
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      skillsToTeach: user.skillsToTeach,
      skillsToLearn: user.skillsToLearn,
    });
  } catch (err) {
    next(err);
  }
};
