import express from 'express';
import { CONFIG } from './config/environment';
import kbRoutes from './routes/kbRoutes';
import cors from "cors";

const app = express();

app.use(express.json());

// Configure CORS
app.use(cors({
  origin: 'https://view.ishimwe.rw', // Replace with your frontend domain
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true // If you're using credentials (e.g., cookies)
}));

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

// app.use(express.json());
// app.use(cors({
//   origin: '*'
// }))
// app.use('/api/kb', kbRoutes);

// async function startServer() {
//   app.listen(CONFIG.PORT, () => {
//     console.log(`Server is running on port ${CONFIG.PORT}`);
//   });
// }

// startServer().catch(console.error);

// export default app;

















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