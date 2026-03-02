import Rule from "../models/Rule.js";

// Fetch all active rules (Excludes soft-deleted rules)
export const getRules = async (req, res) => {
  try {
    // Only return rules that haven't been soft-deleted
    const rules = await Rule.find({ deleted_at: null }).sort({ createdAt: -1 }); 
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new rule to be used by the Decision Engine
export const createRule = async (req, res) => {
  try {
    const { name, description, condition_json, action, priority_adjustment } = req.body;

    const newRule = new Rule({
      name,
      description, // 🆕 Included for better explainability
      condition_json,
      action,
      priority_adjustment: priority_adjustment || 0
    });

    await newRule.save();
    res.status(201).json(newRule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🆕 Update an existing rule
export const updateRule = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRule = await Rule.findByIdAndUpdate(
      id, 
      { ...req.body }, 
      { new: true }
    );
    res.json(updatedRule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Soft Delete a rule instead of a hard delete
export const deleteRule = async (req, res) => {
  try {
    const { id } = req.params;
    // We update the timestamp instead of removing the document
    await Rule.findByIdAndUpdate(id, { deleted_at: new Date(), is_active: false });
    res.json({ message: "Rule deactivated (soft deleted)" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};