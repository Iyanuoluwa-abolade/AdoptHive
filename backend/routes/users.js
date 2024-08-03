import express from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const saltRounds = 10;

router.post('/signup', async (req, res) => {
  const { FirstName, LastName, email, Username, Password, ConfirmPassword, role } = req.body;
  if (Password !== ConfirmPassword) {
    return res.status(401).json({ error: 'Passwords do not match' });
  } else {
    try {
      const existingUser = await prisma.user.findUnique({ where: { Username } });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      const hashedPassword = await bcrypt.hash(Password, saltRounds);
      const newUser = await prisma.user.create({
        data: {
          FirstName,
          LastName,
          email,
          Username,
          Password: hashedPassword,
          role,
        },
      });

      req.session.user = { id: newUser.id, role: newUser.role };

      res.status(201).json({
        user: newUser,
        redirectUrl: role === 'Adopter' ? '/adopter-profile' : '/adoptee-profile',
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
});

router.post('/signin', async (req, res) => {
  const { Username, Password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { Username } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    req.session.user = { id: user.id, role: user.role };

    res.status(200).json({
      user,
      redirectUrl: user.role === 'Adopter' ? '/adopter-home' : '/adoptee-home',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
