import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import Problem from '@/lib/db/models/Problem';
import bcrypt from 'bcryptjs';

// Check if user is admin
async function isAdmin(email: string | null | undefined): Promise<boolean> {
  const adminEmails = ['sagarwaghmare1384@gmail.com', 'admin@vastsea.com'];
  return adminEmails.includes(email || '');
}

// GET - Fetch all users for admin
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !await isAdmin(session.user?.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Fetch users and count their problems
    const users = await User.find({}, { password: 0 })
      .sort({ createdAt: -1 })
      .lean();

    // Get problem counts for each user
    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        const problemsCount = await Problem.countDocuments({ author: user._id });
        return {
          ...user,
          problemsCount,
        };
      })
    );

    return NextResponse.json(usersWithCounts);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !await isAdmin(session.user?.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, role, password } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Generate a random password if not provided
    const userPassword = password || Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      createdAt: new Date(),
    });

    await user.save();

    // Remove password from response
    const { password: _, ...userResponse } = user.toJSON();

    return NextResponse.json({
      ...userResponse,
      tempPassword: password ? undefined : userPassword, // Only include if auto-generated
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
