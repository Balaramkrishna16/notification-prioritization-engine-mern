class BasePriorityStrategy {
  async execute(notification, context) {
    const score = context.priorityScore;
    let finalDecision = "LATER";
    let finalReason = "Standard priority processing";

    if (score >= 10) {
      finalDecision = "NOW";
      finalReason = "High priority score threshold reached";
    } else if (score < 0) {
      finalDecision = "NEVER";
      finalReason = "Priority score below minimum threshold";
    }

    return {
      decision: finalDecision,
      reason: finalReason,
      stopProcessing: true
    };
  }
}

export default BasePriorityStrategy;