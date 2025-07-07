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

// GET - Fetch all problems for admin
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !await isAdmin(session.user?.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const problems = await Problem.find({})
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(problems);
  } catch (error) {
    console.error('Error fetching problems:', error);
    return NextResponse.json({ error: 'Failed to fetch problems' }, { status: 500 });
  }
}

// POST - Create new problem
export async function POST(request: NextRequest) {
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

    const problem = new Problem({
      title,
      description,
      author: session.user?.id || session.user?.email,
      createdAt: new Date(),
    });

    await problem.save();
    await problem.populate('author', 'name email');

    return NextResponse.json(problem, { status: 201 });
  } catch (error) {
    console.error('Error creating problem:', error);
    return NextResponse.json({ error: 'Failed to create problem' }, { status: 500 });
  }
}
