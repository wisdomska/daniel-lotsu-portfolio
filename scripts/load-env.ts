/** Load .env.local then .env for scripts run outside Next.js (which loads them itself). */
import { config } from 'dotenv';

config({ path: ['.env.local', '.env'], quiet: true });
