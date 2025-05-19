import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import Problem from '@/lib/db/models/Problem';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Fetch user data (excluding password)
    const userData = await User.findById(session.user.id).select('-password');
    
    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch problems created by the user
    // Check if the Problem model exists before querying
    let userProblems = [];
    try {
      if (Problem) {
        userProblems = await Problem.find({ userId: session.user.id });
      }
    } catch (error) {
      console.error('Error fetching user problems:', error);
      // Continue with empty problems array
    }

    return NextResponse.json({
      user: {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        createdAt: userData.createdAt
      },
      problems: userProblems
    });
  } catch (error) {
    console.error('Error in user profile API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
