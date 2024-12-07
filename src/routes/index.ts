import { Router, Request, Response } from "express";

const router = Router();

// API Health check route
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: "The API is healthy and running smoothly."
  })
});

export default router;