function runSimulation({
    numProducts = 1,
    echelons = [
        { name: "Retailer", leadTime: 2, reorderPoint: 50, orderQty: 100, smoothing: 0.4, enableSmoothing: true, enableFeedback: true },
        { name: "Wholesaler", leadTime: 3, reorderPoint: 120, orderQty: 200, smoothing: 0.4, enableSmoothing: true, enableFeedback: true },
        { name: "Manufacturer", leadTime: 4, reorderPoint: 200, orderQty: 300, smoothing: 0.4, enableSmoothing: true, enableFeedback: true },
    ],
    demandMean = 40,
    simDays = 30,
    comparison = false // for running both "with" and "without" feedback/smoothing
} = {}) {
    // Data structure: echelons[e][p][variable][day]
    const numEchelons = echelons.length;
    let products = Array(numProducts).fill(0).map((_, p) => ({
        name: `Product ${p + 1}`
    }));

    function singleRun(policyOverride = {}) {
        // [echelon][product]
        let inventories = Array(numEchelons).fill().map(() => Array(numProducts).fill(200));
        let backlogs = Array(numEchelons).fill().map(() => Array(numProducts).fill(0));
        let pipelines = Array(numEchelons).fill().map((_, e) =>
            Array(numProducts).fill().map(() =>
                Array(echelons[e].leadTime).fill(0)
            )
        );
        let ordersHistory = Array(numEchelons).fill().map(() => Array(numProducts).fill().map(() => []));
        let demandHistory = Array(numProducts).fill().map(() => []);
        let inventoryHistory = Array(numEchelons).fill().map(() => Array(numProducts).fill().map(() => []));
        let backlogHistory = Array(numEchelons).fill().map(() => Array(numProducts).fill().map(() => []));
        // Simulate days
        for (let day = 0; day < simDays; day++) {
            for (let p = 0; p < numProducts; p++) {
                // Customer demand at retailer
                let demand = Math.round(demandMean + (Math.random() - 0.5) * 8);
                demandHistory[p][day] = demand;
                // Loop echelons from retailer (0) up to manufacturer (2)
                for (let e = 0; e < numEchelons; e++) {
                    let inv = inventories[e][p];
                    let pipeline = pipelines[e][p];
                    let backlog = backlogs[e][p];
                    // 1. Receive shipment from upstream pipeline
                    let received = pipeline.shift();
                    inv += received;
                    // 2. Calculate current demand
                    let currentDemand;
                    if (e === 0) {
                        currentDemand = demand + backlog;
                    } else {
                        currentDemand = ordersHistory[e - 1][p][day - 1] || demand + backlog;
                    }
                    // 3. Satisfy as much as possible
                    let fulfilled = Math.min(inv, currentDemand);
                    backlog = backlog + demand - fulfilled;
                    inv -= fulfilled;
                    // 4. Place new order upstream
                    let params = { ...echelons[e], ...policyOverride[e] };
                    let order = 0;
                    if ((params.enableFeedback ?? true) && inv < params.reorderPoint) {
                        order = params.orderQty;
                        if (params.enableSmoothing ?? true) {
                            order = Math.round(order * params.smoothing + (1 - params.smoothing) * demand);
                        }
                    }
                    ordersHistory[e][p][day] = order;
                    pipeline.push(order);
                    // Save
                    inventories[e][p] = inv;
                    pipelines[e][p] = pipeline;
                    backlogs[e][p] = backlog;
                    inventoryHistory[e][p][day] = inv;
                    backlogHistory[e][p][day] = backlog;
                }
            }
        }
        return {
            inventoryHistory,
            backlogHistory,
            ordersHistory,
            demandHistory,
        };
    }

    // Main result: with feedback/smoothing
    const resultA = singleRun();
    // For comparison: feedback/smoothing disabled
    let resultB = null;
    if (comparison) {
        // Override all echelons to disable feedback/smoothing
        const override = echelons.map(_ => ({ enableFeedback: false, enableSmoothing: false }));
        resultB = singleRun(override);
    }
    return {
        products,
        echelons,
        simDays,
        resultA,
        resultB
    };
}

module.exports = { runSimulation };
