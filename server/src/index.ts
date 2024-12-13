import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// 路由导入
import authRoutes from './routes/auth';
import eventRoutes from './routes/event';
import userRoutes from './routes/user';

// 加载环境变量
dotenv.config();

const app = express();

// CORS 配置
const corsOptions = {
  origin: 'http://localhost:3000', // React 前端地址
  credentials: true,
  optionsSuccessStatus: 200
};

// 中间件
app.use(cors(corsOptions));
app.use(express.json());

// 数据库连接
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('MongoDB connection error:', error));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 