import app from './app';
import 'dotenv/config';
import { dbConnect } from './config/db.config';

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  await dbConnect();
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
