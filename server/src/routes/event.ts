import express from 'express';
import { protect } from '../middleware/auth';
import Event from '../models/Event';

const router = express.Router();

// 获取所有活动
router.get('/', async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'username email')
      .sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取单个活动
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'username email')
      .populate('participants', 'username email');
    
    if (!event) {
      return res.status(404).json({ message: '活动不存在' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 创建活动
router.post('/', protect, async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      organizer: req.user._id
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新活动
router.put('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: '活动不存在' });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '没有权限修改此活动' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除活动
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: '活动不存在' });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '没有权限删除此活动' });
    }

    await event.deleteOne();
    res.json({ message: '活动已删除' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 参加活动
router.post('/:id/join', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: '活动不存在' });
    }

    if (event.participants.includes(req.user._id)) {
      return res.status(400).json({ message: '您已经参加了此活动' });
    }

    if (event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ message: '活动参与人数已满' });
    }

    event.participants.push(req.user._id);
    await event.save();

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 退出活动
router.post('/:id/leave', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: '活动不存在' });
    }

    const participantIndex = event.participants.indexOf(req.user._id);
    if (participantIndex === -1) {
      return res.status(400).json({ message: '您还未参加此活动' });
    }

    event.participants.splice(participantIndex, 1);
    await event.save();

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router; 