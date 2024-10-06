import express from 'express';
import cors from 'cors';
import { CONFIG } from './config/environment';
import kbRoutes from './routes/kbRoutes';

const app = express();
app.use(cors())
app.use(express.json());

// Routes
app.use('/api/kb', kbRoutes);

// Start the server
const PORT = CONFIG.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;






























































// import express from 'express';
// import { CONFIG } from './config/environment';
// import kbRoutes from './routes/kbRoutes';
// import cors from "cors";

// const app = express();

// app.use(express.json());

// // Configure CORS
// app.use(cors());

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