import User from '../models/User.js';
import MatchRequest from '../models/MatchRequest.js';
import { getSuggestedMatches } from '../utils/matchingLogic.js';

export const getSuggestedMatchesController = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const allUsers = await User.find({ _id: { $ne: currentUser._id } });
    const matches = getSuggestedMatches(currentUser, allUsers);
    res.json(matches);
  } catch (err) {
    next(err);
  }
};

export const sendMatchRequest = async (req, res, next) => {
  try {
    const { toUser, skill, message } = req.body;
    
    const targetUser = await User.findById(toUser);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!targetUser.skillsToTeach.includes(skill)) {
      return res.status(400).json({ message: 'This user cannot teach the requested skill' });
    }
    
    if (!req.user.skillsToLearn.includes(skill)) {
      return res.status(400).json({ message: 'You are not looking to learn this skill' });
    }
    
    const existingRequest = await MatchRequest.findOne({
      fromUser: req.user._id,
      toUser,
      skill,
      status: 'pending',
    });
    
    if (existingRequest) {
      return res.status(400).json({ message: 'Request already sent for this skill' });
    }
    
    const matchRequest = await MatchRequest.create({
      fromUser: req.user._id,
      toUser,
      skill,
      message: message || '',
    });
    
    const populatedRequest = await MatchRequest.findById(matchRequest._id)
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email');
    
    res.status(201).json(populatedRequest);
  } catch (err) {
    next(err);
  }
};

export const acceptMatchRequest = async (req, res, next) => {
  try {
    const matchRequest = await MatchRequest.findById(req.params.id);
    
    if (!matchRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    if (matchRequest.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to accept this request' });
    }
    
    if (matchRequest.status !== 'pending') {
      return res.status(400).json({ message: `Request is already ${matchRequest.status}` });
    }
    
    matchRequest.status = 'accepted';
    await matchRequest.save();
    
    const populatedRequest = await MatchRequest.findById(matchRequest._id)
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email');
    
    res.json(populatedRequest);
  } catch (err) {
    next(err);
  }
};

export const declineMatchRequest = async (req, res, next) => {
  try {
    const matchRequest = await MatchRequest.findById(req.params.id);
    
    if (!matchRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    if (matchRequest.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to decline this request' });
    }
    
    if (matchRequest.status !== 'pending') {
      return res.status(400).json({ message: `Request is already ${matchRequest.status}` });
    }
    
    matchRequest.status = 'declined';
    await matchRequest.save();
    
    const populatedRequest = await MatchRequest.findById(matchRequest._id)
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email');
    
    res.json(populatedRequest);
  } catch (err) {
    next(err);
  }
};

export const getMyRequests = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    const sent = await MatchRequest.find({ fromUser: userId })
      .populate('toUser', 'name email')
      .populate('fromUser', 'name email')
      .sort({ createdAt: -1 });
    
    const received = await MatchRequest.find({ toUser: userId })
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ sent, received });
  } catch (err) {
    next(err);
  }
};
