import Rule from "../../../models/Rule.js";

class RuleStrategy {
  async execute(notification) {
    const rule = await Rule.findOne({ 
      condition_json: { event_type: notification.event_type },
      deleted_at: null 
    });

    if (rule) {
      return {
        decision: rule.action === "FORCE_NOW" ? "NOW" : "LATER",
        reason: `Admin Rule: ${rule.name}`,
        rule_name: rule.name,
        stopProcessing: true 
      };
    }
    return null;
  }
}
export default RuleStrategy;