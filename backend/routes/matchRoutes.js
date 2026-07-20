import express from 'express';
import {
  getSuggestedMatchesController,
  sendMatchRequest,
  acceptMatchRequest,
  declineMatchRequest,
  getMyRequests,
} from '../controllers/matchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/suggested', protect, getSuggestedMatchesController);
router.post('/request', protect, sendMatchRequest);
router.patch('/:id/accept', protect, acceptMatchRequest);
router.patch('/:id/decline', protect, declineMatchRequest);
router.get('/my-requests', protect, getMyRequests);

export default router;
