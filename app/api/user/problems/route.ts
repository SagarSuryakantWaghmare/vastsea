import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/db/mongodb';
import Problem from '@/lib/db/models/Problem';
import { authOptions } from '@/lib/auth-options';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();    // Fetch problems created by the user
    // Check if the Problem model exists before querying
    let userProblems = [];
    try {
      if (Problem) {
        userProblems = await Problem.find({ author: session.user.id })
          .populate('author', 'name email')
          .sort({ createdAt: -1 });
      }
    } catch (error) {
      console.error('Error fetching user problems:', error);
      // Continue with empty problems array
    }

    return NextResponse.json({
      problems: userProblems
    });
  } catch (error) {
    console.error('Error in user problems API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
