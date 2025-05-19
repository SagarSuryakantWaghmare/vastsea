import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    
    await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });
    
    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in signup:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}