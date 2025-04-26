// list all sellers

import { connectDB } from '@/lib/db';
import Seller from '@/models//seller/Seller';

export async function GET() {
  try {
    await connectDB();

    const sellers = await Seller.find().select('-password'); // Exclude password

    return Response.json({
      success: true,
      count: sellers.length,
      sellers,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching sellers:', error);
    return Response.json({
      success: false,
      message: 'Failed to fetch sellers',
    }, { status: 500 });
  }
}
