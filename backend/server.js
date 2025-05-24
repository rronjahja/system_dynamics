const express = require('express');
const cors = require('cors');
const { runSimulation } = require('./sd/simulator.js');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/default-params', (req, res) => {
    res.json({
        numProducts: 2,
        simDays: 30,
        demandMean: 40,
        comparison: false,
        echelons: [
            { name: "Retailer", leadTime: 2, reorderPoint: 50, orderQty: 100, smoothing: 0.4, enableSmoothing: true, enableFeedback: true },
            { name: "Wholesaler", leadTime: 3, reorderPoint: 120, orderQty: 200, smoothing: 0.4, enableSmoothing: true, enableFeedback: true },
            { name: "Manufacturer", leadTime: 4, reorderPoint: 200, orderQty: 300, smoothing: 0.4, enableSmoothing: true, enableFeedback: true },
        ]
    });
});

app.post('/api/simulate', (req, res) => {
    const params = req.body;
    const result = runSimulation(params);
    res.json(result);
});

app.listen(3001, () => console.log('Backend running on http://localhost:3001'));
