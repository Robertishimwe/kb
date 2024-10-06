// src/app.ts

import express from 'express';
import { CONFIG } from './config/environment';
import kbRoutes from './routes/kbRoutes';
import cors from "cors";

const app = express();

// Apply CORS middleware before any other middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use(express.json());
app.use(cors({
  origin: '*'
}))
app.use('/api/kb', kbRoutes);

async function startServer() {
  app.listen(CONFIG.PORT, () => {
    console.log(`Server is running on port ${CONFIG.PORT}`);
  });
}

startServer().catch(console.error);

export default app;

















// import express from 'express';
// import { CONFIG } from './config/environment';
// import kbRoutes from './routes/kbRoutes';
// import cors from "cors";

// const app = express();
// app.use(cors({ origin: "*" }));
// app.use(express.json());
// app.use('/api/kb', kbRoutes);

// async function startServer() {
//   app.listen(CONFIG.PORT, () => {
//     console.log(`Server is running on port ${CONFIG.PORT}`);
//   });
// }

// startServer().catch(console.error);

// export default app;