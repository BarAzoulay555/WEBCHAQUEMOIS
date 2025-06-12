const express = require('express');
const cors = require('cors');
const inventoryRoutes = require('../routes/inventory');

const app = express();
app.use(cors());
app.use(express.json());

// רישום נתיבי מלאי
app.use('/api', inventoryRoutes);

app.listen(5000, () => {
  console.log('✅ Server is running on http://localhost:5000');
});
