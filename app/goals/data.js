export const groupGoalsByType = (goals) => {
  return goals.reduce((groups, goal) => {
    // Handle column names with spaces
    const type = goal.Type || goal[' Type '] || goal['Type '] || goal[' Type'];
    if (type && type.trim() !== '') {
      if (!groups[type.trim()]) {
        groups[type.trim()] = [];
      }
      groups[type.trim()].push(goal);
    }
    return groups;
  }, {});
};