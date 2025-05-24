const express = require('express');
const cors = require('cors');
const { runSimulation } = require('./sd/simulator.js');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/default-params', (req, res) => {
    res.json({
        leadTime: 2,
        reorderPoint: 50,
        orderQty: 100,
        demandMean: 40,
        delay: 2,
        smoothing: 0.4,
        simDays: 30
    });
});

app.post('/api/simulate', (req, res) => {
    const params = req.body;
    const result = runSimulation(params);
    res.json(result);
});

app.listen(3001, () => console.log('Backend running on http://localhost:3001'));
