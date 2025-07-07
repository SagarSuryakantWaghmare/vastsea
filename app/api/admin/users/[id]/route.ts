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

// GET - Fetch specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !await isAdmin(session.user?.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const user = await User.findById(params.id, { password: 0 }).lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get problem count for this user
    const problemsCount = await Problem.countDocuments({ author: (user as any)._id });

    return NextResponse.json({
      ...user,
      problemsCount,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// PUT - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: params.id } 
    });
    
    if (existingUser) {
      return NextResponse.json({ error: 'Email is already taken by another user' }, { status: 400 });
    }

    const updateData: any = {
      name,
      email,
      role: role || 'user',
      updatedAt: new Date(),
    };

    // Only update password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, select: '-password' }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !await isAdmin(session.user?.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Prevent deleting admin users
    const userToDelete = await User.findById(params.id);
    if (!userToDelete) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const adminEmails = ['sagarwaghmare1384@gmail.com', 'admin@vastsea.com'];
    if (adminEmails.includes(userToDelete.email)) {
      return NextResponse.json({ error: 'Cannot delete admin users' }, { status: 403 });
    }

    // Delete the user
    await User.findByIdAndDelete(params.id);

    // Optionally, you might want to handle what happens to the user's problems
    // For now, we'll keep them but you could delete or reassign them

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
