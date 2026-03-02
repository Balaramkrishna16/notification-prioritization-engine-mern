import RuleStrategy from "./strategies/RuleStrategy.js";
import ExactDedupeStrategy from "./strategies/ExactDedupeStrategy.js";

class DecisionEngine {
  constructor() {
    this.strategies = [
      new ExactDedupeStrategy(),
      new RuleStrategy()
    ];
  }

  async evaluate(notification) {
    // 🛡️ Guaranteed Defaults
    let context = {
      decision: "NOW",
      reason: "Standard engine processing",
      rule_triggered: null
    };

    for (let strategy of this.strategies) {
      try {
        const result = await strategy.execute(notification);
        
        if (result) {
          // Update context only if strategy returned a value
          context.decision = result.decision ?? context.decision;
          context.reason = result.reason ?? context.reason;
          context.rule_triggered = result.rule_name ?? context.rule_triggered;
          
          // Stop if the strategy says we're done (like a duplicate)
          if (result.stopProcessing) break;
        }
      } catch (error) {
        console.error(`Strategy Error:`, error);
      }
    }
    return context;
  }
}

export default new DecisionEngine();