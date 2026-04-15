import app from './src/app.js';
import { config } from './src/config.js';

app.listen(config.port, () => {
  console.log(`API listening on :${config.port}`);
});
