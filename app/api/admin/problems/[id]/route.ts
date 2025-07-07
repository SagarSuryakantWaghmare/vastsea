import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { connectToDatabase } from '@/lib/db/mongodb';
import Problem from '@/lib/db/models/Problem';

// Check if user is admin
async function isAdmin(email: string | null | undefined): Promise<boolean> {
  const adminEmails = ['sagarwaghmare1384@gmail.com', 'admin@vastsea.com'];
  return adminEmails.includes(email || '');
}

// GET - Fetch specific problem
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
    
    const problem = await Problem.findById(params.id)
      .populate('author', 'name email')
      .lean();

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    return NextResponse.json(problem);
  } catch (error) {
    console.error('Error fetching problem:', error);
    return NextResponse.json({ error: 'Failed to fetch problem' }, { status: 500 });
  }
}

// PUT - Update problem
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !await isAdmin(session.user?.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description } = await request.json();

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    await connectToDatabase();

    const problem = await Problem.findByIdAndUpdate(
      params.id,
      {
        title,
        description,
        updatedAt: new Date(),
      },
      { new: true }
    ).populate('author', 'name email');

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    return NextResponse.json(problem);
  } catch (error) {
    console.error('Error updating problem:', error);
    return NextResponse.json({ error: 'Failed to update problem' }, { status: 500 });
  }
}

// DELETE - Delete problem
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

    const problem = await Problem.findByIdAndDelete(params.id);

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    console.error('Error deleting problem:', error);
    return NextResponse.json({ error: 'Failed to delete problem' }, { status: 500 });
  }
}
