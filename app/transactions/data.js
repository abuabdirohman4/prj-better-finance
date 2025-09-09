export const groupTransactionsByDate = (transactions) => {
  return transactions.reduce((groups, transaction) => {
    const date = transaction.Date;
    if (date) {
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
    }
    return groups;
  }, {});
};