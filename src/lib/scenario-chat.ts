export interface ScenarioContext {
    petrolPrice: number;
    electricityRate: number;
    chargingCost: number;
    gridCO2Factor: number;
    evSubsidy: number;
    evPriceReduction: number;
    showGreenGrid: boolean;
    evTCO?: number;
    iceTCO?: number;
    savings?: number;
    breakEven?: string;
    co2Savings?: number;
    evRecommended?: boolean;
}

export const generateScenarioResponse = (query: string, ctx: ScenarioContext): string => {
    const lowerQuery = query.toLowerCase();

    // 1. Economic / Decision Impact
    if (
        lowerQuery.includes("affect") ||
        lowerQuery.includes("decision") ||
        lowerQuery.includes("cost") ||
        lowerQuery.includes("money") ||
        lowerQuery.includes("save") ||
        lowerQuery.includes("worth")
    ) {
        const savings = ctx.savings || 0;
        const isPositive = savings > 0;

        return isPositive
            ? `✅ **Financial Winner: EV**\n\nYou will save **₹${Math.abs(savings).toLocaleString('en-IN')}** over the ownership period. The lower running costs (₹${ctx.electricityRate}/kWh) quickly offset the higher initial price.`
            : `⚠️ **Financial Winner: ICE**\n\nCurrently, the petrol vehicle is cheaper by **₹${Math.abs(savings).toLocaleString('en-IN')}**. You might need higher daily usage or subsidies to make the EV profitable.`;
    }

    // 2. Break-even / Economical Timing
    if (
        lowerQuery.includes("break") ||
        lowerQuery.includes("even") ||
        lowerQuery.includes("long") ||
        lowerQuery.includes("time") ||
        lowerQuery.includes("year")
    ) {
        return `⏱️ **Break-even Timeline**\n\nIt will take **${ctx.breakEven} years** to recover the extra cost of the EV.\n\n• Annual Savings: The EV is significantly cheaper to run per km.\n• Subsidy: ₹${ctx.evSubsidy.toLocaleString('en-IN')} included.`;
    }

    // 3. Environmental Impact
    if (
        lowerQuery.includes("environment") ||
        lowerQuery.includes("nature") ||
        lowerQuery.includes("green") ||
        lowerQuery.includes("co2") ||
        lowerQuery.includes("emission")
    ) {
        return `🌱 **Environmental Impact**\n\n• **CO₂ Saved:** ${ctx.co2Savings?.toLocaleString()} kg (Lifetime)\n• **Grid Cleanliness:** ${ctx.gridCO2Factor} gCO₂/kWh\n\nEven with the current grid, the EV is cleaner than a petrol car.`;
    }

    // 4. Fallback / General Summary
    return `📊 **Scenario Summary**\n\n• **Verdict:** ${ctx.evRecommended ? "Go Electric (EV) ⚡" : "Stick with Petrol (ICE) ⛽"}\n• **Net Savings:** ₹${(ctx.savings || 0).toLocaleString('en-IN')}\n• **Break-even:** ${ctx.breakEven} years\n\nI can answer specific questions about *savings*, *break-even point*, or *emissions*.`;
};
