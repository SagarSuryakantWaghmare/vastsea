import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import Problem from '@/lib/db/models/Problem';
import { handleApiError } from '@/lib/api-error-utils';

// Specify runtime configuration for this API route
export const runtime = 'nodejs';

/**
 * GET handler for fetching leaderboard data
 * Retrieves users and the number of problems they've created
 */
export async function GET() {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Get all users with their basic info
    const users = await User.find({})
      .select('name email createdAt')
      .lean();
      
    // Get problem counts per user
    const userCounts = await Problem.aggregate([
      { 
        $group: { 
          _id: "$author", 
          problemCount: { $sum: 1 } 
        } 
      }
    ]);
    
    // Map problem counts to users
    const leaderboardData = users.map(user => {
      // Find corresponding problem count for this user
      const userCountData = userCounts.find(
        // @ts-ignore
        count => count._id && count._id.toString() === user._id.toString()
      );
      
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        problemCount: userCountData ? userCountData.problemCount : 0,
        createdAt: user.createdAt
      };
    });
    
    // Sort by problem count (descending)
    leaderboardData.sort((a, b) => b.problemCount - a.problemCount);
    
    return NextResponse.json({ leaderboard: leaderboardData }, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    });
    
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return handleApiError(error);
  }
}
