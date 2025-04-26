// fetch products by category
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Category from '@/models//admin/Category'; // Adjust path if needed
import {connectDB} from '@/lib/db'; // Create this util if not already

export async function GET() {
  try {
    await connectDB(); // Ensure database connection

    const categories = await Category.find().sort({ createdAt: -1 }); // Sort by latest
    return NextResponse.json({ success: true, data: categories }, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch categories' }, { status: 500 });
  }
}
