document.getElementById('loan-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const loanAmountInput = parseFloat(document.getElementById('loan-amount').value);
    const annualInterest = parseFloat(document.getElementById('interest-rate').value);
    const years = parseInt(document.getElementById('loan-term').value);

    let principal = loanAmountInput * 100000;
    const r = (annualInterest / 100) / 12;  // Monthly interest rate
    const n = years * 12;  // Total number of months
    const EMI = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalInterestForTenure = EMI * n - principal;

    // Amortization schedule calculation
    let balance = principal;
    let totalInterestPaid = 0;
    let remainingInterest = totalInterestForTenure;
    let totalPrincipalPaid = 0;
    let schedule = [];

    // --- FIX 1: Perform calculations with raw numbers for accuracy ---
    for (let month = 1; month <= n; month++) {
        const interestPayment = balance * r;
        const principalPayment = EMI - interestPayment;
        balance -= principalPayment;
        totalInterestPaid += interestPayment;
        remainingInterest = totalInterestForTenure - totalInterestPaid;
        totalPrincipalPaid += principalPayment;

        // Push raw, unrounded values to the schedule
        schedule.push({
            month,
            monthlyPayment: EMI,
            interestPayment,
            principalPayment,
            totalPrincipalPaid,
            balance: balance < 0 ? 0 : balance, // Prevent negative balance on the last month
            totalInterestPaid,
            remainingInterest,
        });
    }

    // Show results
    document.getElementById('results').style.display = "block";
    document.getElementById('total-interest').innerText = "₹" + Math.ceil(totalInterestForTenure).toLocaleString();

    // Loan Details
    document.getElementById('loan-amount-display').innerText = principal.toLocaleString();
    document.getElementById('interest-rate-display').innerText = annualInterest;
    document.getElementById('loan-term-display').innerText = years;
    document.getElementById('loan-term-display-months').innerText = n;
    document.getElementById('total-payments-display').innerText = n;
    document.getElementById('emi-display').innerText = Math.ceil(EMI).toLocaleString();

    // Monthly interest rate display with MathJax
    document.getElementById('monthly-interest-rate-mathjax').innerHTML =
      `\\[ r = \\frac{${annualInterest}}{12 \\times 100} = \\frac{${annualInterest}}{1200} = ${r.toFixed(7)} \\]`;
    if (window.MathJax && window.MathJax.typeset) MathJax.typeset();

    // --- FIX 2: Correct the MathJax formula rendering ---
    // Moved currency symbols and commas outside of the MathJax delimiters.
    document.getElementById('formula-mathjax').innerHTML = `
      \\[
      EMI = P \\times r \\times \\frac{(1 + r)^n}{(1 + r)^n - 1}
      \\]
      <br>
      Where: \\( P \\) = ₹${principal.toLocaleString()}, &nbsp;
      \\( r \\) = ${r.toFixed(7)}, &nbsp; \\( n \\) = ${n}
      <br><br>
      Substituting values:<br>
      \\[
      EMI = ${principal.toLocaleString()} \\times ${r.toFixed(7)} \\times \\frac{(1 + ${r.toFixed(7)})^{${n}}}{(1 + ${r.toFixed(7)})^{${n}} - 1}
      \\]
    `;
    if (window.MathJax && window.MathJax.typeset) MathJax.typeset();

    // --- FIX 3: Format numbers for display, not during calculation ---
    // Amortization Table
    let scheduleHTML = '';
    schedule.forEach(payment => {
        scheduleHTML += `
            <tr>
                <td>${payment.month}</td>
                <td>${Math.ceil(payment.monthlyPayment).toLocaleString()}</td>
                <td>${Math.ceil(payment.interestPayment).toLocaleString()}</td>
                <td>${Math.ceil(payment.principalPayment).toLocaleString()}</td>
                <td>${Math.ceil(payment.totalPrincipalPaid).toLocaleString()}</td>
                <td>${Math.ceil(payment.totalInterestPaid).toLocaleString()}</td>
                <td>${Math.ceil(payment.remainingInterest).toLocaleString()}</td>
                <td>${Math.ceil(payment.balance).toLocaleString()}</td>
            </tr>
        `;
    });
    document.querySelector('#amortization-table tbody').innerHTML = scheduleHTML;

    // Breakdown for the first three months
    const firstMonth = schedule[0];
    const secondMonth = schedule[1];
    const thirdMonth = schedule[2];

    // Get the starting balance for month 2 and 3 for display
    const balanceAfterMonth1 = firstMonth.balance;
    const balanceAfterMonth2 = secondMonth.balance;

    document.getElementById('breakdown-months').style.display = "block";
    document.getElementById('breakdown-months').innerHTML = `
        <h3 style="margin-bottom:7px;">📆 Month-wise EMI Calculation Breakdown</h3>
        <div class="emi-breakdown">
            <strong>Month 1:</strong><br>
            Principal at start: ₹${principal.toLocaleString()}<br>
            Interest = ₹${principal.toLocaleString()} × ${r.toFixed(7)} = <b>₹${Math.ceil(firstMonth.interestPayment).toLocaleString()}</b><br>
            Principal paid = EMI − Interest = ₹${Math.ceil(firstMonth.monthlyPayment).toLocaleString()} − ₹${Math.ceil(firstMonth.interestPayment).toLocaleString()} = <b>₹${Math.ceil(firstMonth.principalPayment).toLocaleString()}</b><br>
            Remaining balance = ₹${principal.toLocaleString()} − ₹${Math.ceil(firstMonth.principalPayment).toLocaleString()} = <b>₹${Math.ceil(firstMonth.balance).toLocaleString()}</b><br>
            <br>
            <strong>Month 2:</strong><br>
            Principal at start: ₹${Math.ceil(balanceAfterMonth1).toLocaleString()}<br>
            Interest = ₹${Math.ceil(balanceAfterMonth1).toLocaleString()} × ${r.toFixed(7)} = <b>₹${Math.ceil(secondMonth.interestPayment).toLocaleString()}</b><br>
            Principal paid = EMI − Interest = ₹${Math.ceil(secondMonth.monthlyPayment).toLocaleString()} − ₹${Math.ceil(secondMonth.interestPayment).toLocaleString()} = <b>₹${Math.ceil(secondMonth.principalPayment).toLocaleString()}</b><br>
            Remaining balance = ₹${Math.ceil(balanceAfterMonth1).toLocaleString()} − ₹${Math.ceil(secondMonth.principalPayment).toLocaleString()} = <b>₹${Math.ceil(secondMonth.balance).toLocaleString()}</b><br>
            <br>
            <strong>Month 3:</strong><br>
            Principal at start: ₹${Math.ceil(balanceAfterMonth2).toLocaleString()}<br>
            Interest = ₹${Math.ceil(balanceAfterMonth2).toLocaleString()} × ${r.toFixed(7)} = <b>₹${Math.ceil(thirdMonth.interestPayment).toLocaleString()}</b><br>
            Principal paid = EMI − Interest = ₹${Math.ceil(thirdMonth.monthlyPayment).toLocaleString()} − ₹${Math.ceil(thirdMonth.interestPayment).toLocaleString()} = <b>₹${Math.ceil(thirdMonth.principalPayment).toLocaleString()}</b><br>
            Remaining balance = ₹${Math.ceil(balanceAfterMonth2).toLocaleString()} − ₹${Math.ceil(thirdMonth.principalPayment).toLocaleString()} = <b>₹${Math.ceil(thirdMonth.balance).toLocaleString()}</b>
        </div>
    `;
});