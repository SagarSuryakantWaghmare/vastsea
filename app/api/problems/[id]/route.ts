import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/db/mongodb';
import Problem from '@/lib/db/models/Problem';
import User from '@/lib/db/models/User';
import { authOptions } from '@/lib/auth-options';

export const runtime = 'nodejs'; // Ensures compatibility with mongoose

// GET a single problem by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // In Next.js 15, params need to be awaited
    const resolvedParams = await params;
    const { id } = resolvedParams;

    await connectToDatabase();

    const problem = await Problem.findById(id).populate({
      path: 'author',
      select: 'name email',
    });

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    return NextResponse.json(problem);
  } catch (error) {
    console.error('Error fetching problem:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problem' },
      { status: 500 }
    );
  }
}

// PUT to update a problem
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const problem = await Problem.findById(id);

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    if (problem.author.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only edit your own problems' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, description, codes, tags } = body;

    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      { title, description, codes, tags },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedProblem);
  } catch (error) {
    console.error('Error updating problem:', error);
    return NextResponse.json(
      { error: 'Failed to update problem' },
      { status: 500 }
    );
  }
}

// DELETE a problem
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const problem = await Problem.findById(id);

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    if (problem.author.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only delete your own problems' },
        { status: 403 }
      );
    }

    await Problem.findByIdAndDelete(id);

    return NextResponse.json(
      { message: 'Problem deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting problem:', error);
    return NextResponse.json(
      { error: 'Failed to delete problem' },
      { status: 500 }
    );
  }
}
