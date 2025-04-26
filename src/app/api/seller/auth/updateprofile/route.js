
import Seller from '../../../models/Seller';
import dbConnect from '../../../utils/dbConnect';
import { verifyToken } from '../../../utils/auth';

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect();

  if (method === 'PUT') {
    try {
      const { name, email, address, contactNumbers, bio, productTypes, profileImage } = req.body;
      const updatedProfile = await Seller.findByIdAndUpdate(
        req.userId,
        { name, email, address, contactNumbers, bio, productTypes, profileImage },
        { new: true }
      );
      if (!updatedProfile) {
        return res.status(404).json({ message: 'Seller not found' });
      }
      res.status(200).json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
