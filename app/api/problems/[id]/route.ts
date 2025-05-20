import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import Problem from '@/lib/db/models/Problem';
import User from '@/lib/db/models/User';
import type { NextRequest } from 'next/server';
// Import proper route types for Next.js 15
import type { RouteSegmentConfig } from 'next/dist/server/app-render/types';

// Define proper types for Next.js route handlers
type RouteParams = { params: { id: string } }

export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    await connectToDatabase();
    
    // Ensure User model is registered before population
    if (User) {
      console.log("User model registered for single problem");
    }
    
    const problem = await Problem.findById(id).populate('author', 'name email');
    
    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ problem });
  } catch (error) {
    console.error('Error fetching problem:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problem' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await req.json();
    const { title, description, codes, tags } = body;
    
    // Connect to database
    await connectToDatabase();
    
    // Find problem and verify ownership
    const problem = await Problem.findById(id);
    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      );
    }

    if (problem.author.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to update this problem' },
        { status: 403 }
      );
    }
    
    // Update problem
    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      {
        title,
        description,
        codes,
        tags,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    ).populate('author', 'name email');
    
    return NextResponse.json({ problem: updatedProblem });
  } catch (error) {
    console.error('Error updating problem:', error);
    return NextResponse.json(
      { error: 'Failed to update problem' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    
    // Connect to database
    await connectToDatabase();
    
    // Find problem and verify ownership
    const problem = await Problem.findById(id);
    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      );
    }

    if (problem.author.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to delete this problem' },
        { status: 403 }
      );
    }
    
    // Delete problem
    await Problem.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting problem:', error);
    return NextResponse.json(
      { error: 'Failed to delete problem' },
      { status: 500 }
    );
  }
}