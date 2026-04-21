import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from './server/models/User.ts';
import { Score } from './server/models/Score.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const rawUri = process.env.MONGODB_URI;
  const MONGODB_URI = (rawUri && rawUri.trim() !== '') 
    ? rawUri 
    : 'mongodb://localhost:27017/swingfund';
  
  const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

  // DB Connection
  if (MONGODB_URI.startsWith('mongodb://') || MONGODB_URI.startsWith('mongodb+srv://')) {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('MongoDB Connected successfully');
    } catch (err) {
      console.error('MongoDB Connection Error:', err);
    }
  } else {
    console.error('CRITICAL: MONGODB_URI is invalid or not provided. Please set it in the Secrets panel.');
    console.error('Expected format: "mongodb://..." or "mongodb+srv://..."');
    console.log('Current value attempted:', MONGODB_URI);
  }

  app.use(cors());
  app.use(express.json());

  // --- API ROUTES ---

  // Auth: Register
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password } = req.body;
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashedPassword });
      await user.save();

      const token = jwt.sign({ userId: user._id }, JWT_SECRET);
      res.json({ token, user: { email: user.email, id: user._id } });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Auth: Login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ userId: user._id }, JWT_SECRET);
      res.json({ token, user: { email: user.email, id: user._id, isAdmin: user.isAdmin } });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Middleware to verify JWT
  const authMiddleware = (req: any, res: any, next: any) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      req.userId = decoded.userId;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  };

  // Profile
  app.get('/api/profile', authMiddleware, async (req: any, res: any) => {
    try {
      const user = await User.findById(req.userId).select('-password');
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Scores: Get last 5
  app.get('/api/scores', authMiddleware, async (req: any, res: any) => {
    try {
      const scores = await Score.find({ userId: req.userId }).sort({ date: -1 }).limit(5);
      res.json(scores);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Scores: Add
  app.post('/api/scores', authMiddleware, async (req: any, res: any) => {
    try {
      const { value } = req.body;
      const newScore = new Score({ userId: req.userId, value });
      await newScore.save();

      // Maintain only 5 scores
      const count = await Score.countDocuments({ userId: req.userId });
      if (count > 5) {
        const oldest = await Score.findOne({ userId: req.userId }).sort({ date: 1 });
        if (oldest) await Score.deleteOne({ _id: oldest._id });
      }

      res.json(newScore);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // --- VITE MIDDLEWARE ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MERN server running on http://localhost:${PORT}`);
  });
}

startServer();
