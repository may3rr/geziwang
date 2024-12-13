import express from 'express';
import { protect } from '../middleware/auth';
import User from '../models/User';
import Event from '../models/Event';

const router = express.Router();

// 获取当前用户信息
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新用户信息
router.put('/me', protect, async (req, res) => {
  try {
    const { username, email, avatar } = req.body;
    
    // 检查用户名和邮箱是否已被其他用户使用
    if (username) {
      const existingUser = await User.findOne({ username, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(400).json({ message: '用户名已存在' });
      }
    }

    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(400).json({ message: '邮箱已存在' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username, email, avatar },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取用户创建的活动
router.get('/me/events', protect, async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id })
      .populate('participants', 'username email')
      .sort({ date: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取用户参与的活动
router.get('/me/participating', protect, async (req, res) => {
  try {
    const events = await Event.find({ participants: req.user._id })
      .populate('organizer', 'username email')
      .sort({ date: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router; 