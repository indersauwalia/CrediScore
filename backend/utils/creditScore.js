let calculateCreditScore = (userForm, bankUser) => {
  let score = 300;

  const ratio = userForm.requestedAmount / userForm.salary;
  if (ratio <= 2) score += 80;
  else if (ratio <= 3) score += 40;
  else score -= 20;

  if (userForm.maritalStatus === "Married") score += 30;

  if (userForm.nationality !== "Indian") return 0;
  else score += 20;

  if (bankUser.existing_loans && bankUser.existing_loans.length > 0)
    score -= 50;
  else 
    score += 30;

  if (userForm.age >= 25 && userForm.age <= 40) score += 50;
  else if (userForm.age < 25) score += 20;
  else score -= 10;

  if (userForm.dependents <= 2) score += 20;
  else if (userForm.dependents <= 4) score += 10;
  else score -= 10;

  if (score > 900) score = 900;
  if (score < 300) score = 300;

  return score;
};

module.exports = calculateCreditScore;
