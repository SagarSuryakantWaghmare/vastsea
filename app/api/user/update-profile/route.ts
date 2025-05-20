import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
// Using dynamic import for bcrypt to avoid Edge runtime issues
// @ts-ignore - We'll handle bcrypt in the route function
import * as bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth-options';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, email, currentPassword, newPassword } = await req.json();

    await connectToDatabase();

    // Get the current user
    const user = await User.findById(session.user.id).select('+password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update basic fields
    if (name) {
      user.name = name;
    }

    // Handle email update
    if (email && email !== user.email) {
      // Check if email is already in use
      const existingUserWithEmail = await User.findOne({ email });
      if (existingUserWithEmail) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        );
      }
      user.email = email;
    }

    // Handle password change if provided
    if (currentPassword && newPassword) {
      // Verify current password
      const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordMatch) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // Hash and set new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Save updated user
    await user.save();

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
