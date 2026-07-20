import mongoose from 'mongoose';

const matchRequestSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  skill: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

matchRequestSchema.index(
  { fromUser: 1, toUser: 1, skill: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'pending' } }
);

export default mongoose.model('MatchRequest', matchRequestSchema);
