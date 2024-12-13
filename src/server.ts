import app from './app';
import 'dotenv/config';
import { dbConnect } from './config/db.config';
import logger from './utils/logger';

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  await dbConnect();
  logger.info(`Server is running on http://localhost:${PORT}`);
});
