import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import bcrypt from 'bcryptjs';

// This is a one-time setup endpoint to create the initial admin user
export async function POST(request: NextRequest) {
  try {
    const { adminEmail, adminPassword, adminName } = await request.json();

    if (!adminEmail || !adminPassword || !adminName) {
      return NextResponse.json({ 
        error: 'Admin email, password, and name are required' 
      }, { status: 400 });
    }

    // Verify this is a valid admin email
    const adminEmails = ['sagarwaghmare1384@gmail.com', 'admin@vastsea.com'];
    if (!adminEmails.includes(adminEmail)) {
      return NextResponse.json({ 
        error: 'Invalid admin email. Must be one of the configured admin emails.' 
      }, { status: 400 });
    }

    await connectToDatabase();

    // Check if admin user already exists
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      return NextResponse.json({ 
        error: 'Admin user already exists' 
      }, { status: 400 });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const adminUser = new User({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
    });

    await adminUser.save();

    return NextResponse.json({
      message: 'Admin user created successfully',
      user: {
        name: adminUser.name,
        email: adminUser.email,
        role: 'admin'
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json({ 
      error: 'Failed to create admin user' 
    }, { status: 500 });
  }
}
