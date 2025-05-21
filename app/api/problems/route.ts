import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import Problem from '@/lib/db/models/Problem';
import User from '@/lib/db/models/User';
import { authOptions } from '@/lib/auth-options';

// Specify runtime configuration for this API route
export const runtime = 'nodejs'; // Ensures compatibility with mongoose

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    
    // Check if we're requesting a specific problem by ID
    const id = searchParams.get('id');
    if (id) {
      // This is a request for a specific problem
      await connectToDatabase();
      
      // Ensure User model is registered before population
      if (User) {
        console.log("User model registered for population");
      }
      
      try {
        const problem = await Problem.findById(id).populate({
          path: 'author',
          select: 'name email'
        });
        
        if (!problem) {
          return NextResponse.json(
            { error: 'Problem not found' },
            { status: 404 }
          );
        }
        
        return NextResponse.json(problem);
      } catch (error) {
        console.error('Error fetching problem by ID:', error);
        return NextResponse.json(
          { error: 'Failed to fetch problem' },
          { status: 500 }
        );
      }
    }
    
    // If no ID, continue with the regular list query
    const query = searchParams.get('query') || '';
    const language = searchParams.get('language') || '';
    const tag = searchParams.get('tag') || '';
    
    // Get session with authOptions
    const session = await getServerSession(authOptions);
    
    // Connect to database
    await connectToDatabase();
    
    // Ensure User model is registered before population
    if (User) {
      console.log("User model registered for population");
    }
    
    // Build query object
    const queryObj: any = {};
    
    if (query) {
      queryObj.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ];
    }
    
    if (language) {
      queryObj[`codes.${language}`] = { $exists: true, $ne: '' };
    }
    
    if (tag) {
      queryObj.tags = tag;
    }
    
    // Execute query
    const problems = await Problem.find(queryObj)
      .sort({ createdAt: -1 })
      .populate('author', 'name email');
    
    return NextResponse.json({ problems });
  } catch (error) {
    console.error('Error fetching problems:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problems' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Check authentication with authOptions
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { title, description, codes, tags } = body;
    
    // Validate input
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Check if user ID exists in the session
    if (!session.user || !session.user.id) {
      return NextResponse.json(
        { error: 'User ID not found in session' },
        { status: 400 }
      );
    }
    
    // Create new problem
    const problem = await Problem.create({
      title,
      description,
      codes,
      tags,
      author: session.user.id, // This is the MongoDB ObjectId reference to the user
    });
    
    return NextResponse.json({ problem }, { status: 201 });
  } catch (error) {
    console.error('Error creating problem:', error);
    return NextResponse.json(
      { error: 'Failed to create problem' },
      { status: 500 }
    );
  }
}