import express from 'express';
import { validateAndCalculateCPD, getUserCPDCompletions, recordCPDCompletion } from './cpdService.js';

const router = express.Router();

router.get('/users/:userId/cpd-status', async (req, res) => {
  try {
    const { userId } = req.params;
    const cpdSummary = await validateAndCalculateCPD(userId);
    
    return res.status(200).json({
      success: true,
      data: cpdSummary
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/users/:userId/completions', async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await getUserCPDCompletions(userId);
    
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/users/:userId/completions', async (req, res) => {
  try {
    const { userId } = req.params;
    const completion = await recordCPDCompletion(userId, req.body);
    
    return res.status(201).json({
      success: true,
      data: completion
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
