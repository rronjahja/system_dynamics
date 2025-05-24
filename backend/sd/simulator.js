function runSimulation({
    leadTime = 2,
    reorderPoint = 50,
    orderQty = 100,
    demandMean = 40,
    delay = 2,
    smoothing = 0.4,
    simDays = 30
} = {}) {
    // Classic supply chain System Dynamics simulation (Beer Game style)
    let inventory = 200;
    let backlog = 0;
    let pipeline = Array(leadTime).fill(0);
    let orders = [];
    let deliveries = [];
    let inventoryHistory = [];
    let backlogHistory = [];
    let demandHistory = [];
    let orderPlacedHistory = [];

    for (let day = 0; day < simDays; day++) {
        const demand = Math.round(demandMean + (Math.random() - 0.5) * 8); // small variation
        demandHistory.push(demand);

        // Receive shipment from pipeline
        const received = pipeline.shift();
        deliveries.push(received);
        inventory += received;

        // Satisfy demand or add to backlog
        let fulfilled = Math.min(inventory, demand + backlog);
        backlog = backlog + demand - fulfilled;
        inventory -= fulfilled;

        inventoryHistory.push(inventory);
        backlogHistory.push(backlog);

        // Simple ordering policy: if inventory falls below reorder point, order fixed qty
        let order = 0;
        if (inventory < reorderPoint) order = orderQty;

        // Feedback loop: smoothing demand signal
        if (order > 0) order = Math.round(order * smoothing + (1 - smoothing) * demand);

        orderPlacedHistory.push(order);
        pipeline.push(order);
    }

    return {
        inventory: inventoryHistory,
        backlog: backlogHistory,
        demand: demandHistory,
        orders: orderPlacedHistory,
        deliveries
    };
}
module.exports = { runSimulation };