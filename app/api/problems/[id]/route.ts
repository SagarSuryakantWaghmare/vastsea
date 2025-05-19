import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import Problem from '@/lib/db/models/Problem';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Connect to database
    await connectToDatabase();
    
    // Find problem by ID and populate author
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
  req: Request,
  { params }: { params: { id: string } }
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
  req: Request,
  { params }: { params: { id: string } }
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