
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const cartFilePath = path.join(process.cwd(), 'db.json');

const readCart = () => {
  const data = fs.readFileSync(cartFilePath, 'utf8');
  return JSON.parse(data).cart;
};

const writeCart = (cart: any) => {
  const data = { cart };
  fs.writeFileSync(cartFilePath, JSON.stringify(data, null, 2), 'utf8');
};

const updateUserInCart = (userId: string, newUserId: string) => {
  const cart = readCart();
  cart.forEach((item: any) => {
    if (item.userId === userId) {
      item.userId = newUserId; 
    }
  });
  writeCart(cart);
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const cart = readCart();
    const { userId } = req.query;

    if (userId) {
      const userCart = cart.filter((item: any) => item.userId === userId);
      res.status(200).json({ cart: userCart });
    } else {
      res.status(400).json({ error: "User ID is required" });
    }
  } else if (req.method === 'POST') {
    const cart = readCart();
    const { product, userId, count } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const newUserId = req.body.newUserId; 
    if (newUserId) {
      updateUserInCart(userId, newUserId); 
    }

    cart.push({ product, userId, count });
    writeCart(cart);
    res.status(201).json({ message: "Product added to cart" });
  } else if (req.method === 'DELETE') {
    const { productId, userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const cart = readCart().filter(
      (item: any) => item.product !== productId || item.userId !== userId
    );
    writeCart(cart);
    res.status(200).json({ message: "Product removed from cart" });
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
