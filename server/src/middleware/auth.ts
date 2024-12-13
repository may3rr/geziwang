import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface IDecodedToken {
  id: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: '未授权访问' });
    }

    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as IDecodedToken;

    // 检查用户是否存在
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: '用户不存在' });
    }

    // 将用户信息添加到请求对象中
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token 无效或已过期' });
  }
}; 