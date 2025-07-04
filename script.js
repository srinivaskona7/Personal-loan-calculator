document.getElementById('loan-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const loanAmountInput = parseFloat(document.getElementById('loan-amount').value);
    const annualInterest = parseFloat(document.getElementById('interest-rate').value);
    const years = parseInt(document.getElementById('loan-term').value);

    let principal = loanAmountInput * 100000;
    const r = (annualInterest / 100) / 12;
    const n = years * 12;
    const EMI = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalInterestForTenure = EMI * n - principal;

    // Amortization schedule calculation
    let balance = principal;
    let totalInterestPaid = 0;
    let remainingInterest = totalInterestForTenure;
    let totalPrincipalPaid = 0;
    let schedule = [];

    for (let month = 1; month <= n; month++) {
        const interestPayment = balance * r;
        const principalPayment = EMI - interestPayment;
        balance -= principalPayment;
        totalInterestPaid += interestPayment;
        remainingInterest = totalInterestForTenure - totalInterestPaid;
        totalPrincipalPaid += principalPayment;

        schedule.push({
            month,
            monthlyPayment: Math.ceil(EMI),
            interestPayment: Math.ceil(interestPayment),
            principalPayment: Math.ceil(principalPayment),
            totalPrincipalPaid: Math.ceil(totalPrincipalPaid),
            balance: Math.ceil(balance),
            totalInterestPaid: Math.ceil(totalInterestPaid),
            remainingInterest: Math.ceil(remainingInterest),
        });
    }

    // Show results
    document.getElementById('results').style.display = "block";
    document.getElementById('total-interest').innerText = Math.ceil(totalInterestForTenure);

    // Loan Details
    document.getElementById('loan-amount-display').innerText = principal.toLocaleString();
    document.getElementById('interest-rate-display').innerText = annualInterest;
    document.getElementById('loan-term-display').innerText = years;
    document.getElementById('loan-term-display-months').innerText = n;
    document.getElementById('total-payments-display').innerText = n;
    document.getElementById('emi-display').innerText = Math.ceil(EMI);

    // Monthly interest rate display with MathJax
    document.getElementById('monthly-interest-rate-mathjax').innerHTML =
      `\\[ r = \\frac{${annualInterest}}{12 \\times 100} = \\frac{${annualInterest}}{1200} = ${r.toFixed(7)} \\]`;
    if (window.MathJax && window.MathJax.typeset) MathJax.typeset();

    // Creative EMI formula with substitutions (MathJax)
    document.getElementById('formula-mathjax').innerHTML = `
      \\[
      EMI = P \\times r \\times \\frac{(1 + r)^n}{(1 + r)^n - 1}
      \\]
      <br>
      Where: \\( P = ₹${principal.toLocaleString()} \\), &nbsp;
      \\( r = ${r.toFixed(7)} \\), &nbsp; \\( n = ${n} \\)
      <br><br>
      Substituting values:<br>
      \\[
      EMI = ₹${principal.toLocaleString()} \\times ${r.toFixed(7)} \\times \\frac{(1 + ${r.toFixed(7)})^{${n}}}{(1 + ${r.toFixed(7)})^{${n}} - 1}
      \\]
    `;
    if (window.MathJax && window.MathJax.typeset) MathJax.typeset();

    // Amortization Table
    let scheduleHTML = '';
    schedule.forEach(payment => {
        scheduleHTML += `
            <tr>
                <td>${payment.month}</td>
                <td>${payment.monthlyPayment}</td>
                <td>${payment.interestPayment}</td>
                <td>${payment.principalPayment}</td>
                <td>${payment.totalPrincipalPaid}</td>
                <td>${payment.totalInterestPaid}</td>
                <td>${payment.remainingInterest}</td>
                <td>${payment.balance}</td>
            </tr>
        `;
    });
    document.querySelector('#amortization-table tbody').innerHTML = scheduleHTML;

    // Breakdown for first two months
    const firstMonth = schedule[0];
    const secondMonth = schedule[1];
    document.getElementById('breakdown-months').style.display = "block";
    document.getElementById('breakdown-months').innerHTML = `
        <h3>📆 First Two Months Detailed Calculation</h3>
        <div class="emi-breakdown">
            <strong>Month 1:</strong><br>
            Principal at start: ₹${principal.toLocaleString()}<br>
            Interest = ₹${principal.toLocaleString()} × ${r.toFixed(7)} = ₹${firstMonth.interestPayment}<br>
            Principal paid = EMI − Interest = ₹${firstMonth.monthlyPayment} − ₹${firstMonth.interestPayment} = ₹${firstMonth.principalPayment}<br>
            Remaining balance = ₹${principal.toLocaleString()} − ₹${firstMonth.principalPayment} = ₹${firstMonth.balance}<br>
            <br>
            <strong>Month 2:</strong><br>
            Principal at start: ₹${firstMonth.balance}<br>
            Interest = ₹${firstMonth.balance} × ${r.toFixed(7)} = ₹${secondMonth.interestPayment}<br>
            Principal paid = EMI − Interest = ₹${secondMonth.monthlyPayment} − ₹${secondMonth.interestPayment} = ₹${secondMonth.principalPayment}<br>
            Remaining balance = ₹${firstMonth.balance} − ₹${secondMonth.principalPayment} = ₹${secondMonth.balance}
        </div>
    `;

    // Loan Calculation Example at bottom
    document.getElementById('loan-amount-1').innerText = principal.toLocaleString();
    document.getElementById('interest-rate-1').innerText = annualInterest;
    document.getElementById('loan-term-1').innerText = years;
    document.getElementById('loan-term-1-months').innerText = n;
    document.getElementById('emi-1').innerText = Math.ceil(EMI);
    document.getElementById('r-1').innerText = r.toFixed(7);
    document.getElementById('formula-mathjax-1').innerHTML = `
        <div style="font-size:1.08em;margin:10px 0 14px 0;">
        \\[
        EMI = P \\times r \\times \\frac{(1 + r)^n}{(1 + r)^n - 1}
        \\]
        <br>
        Where:<br>
        \\( P = ₹${principal.toLocaleString()} \\), &nbsp;
        \\( r = ${r.toFixed(7)} \\), &nbsp;
        \\( n = ${n} \\)
        <br><br>
        Substituting values:<br>
        \\[
        EMI = ₹${principal.toLocaleString()} \\times ${r.toFixed(7)} \\times \\frac{(1 + ${r.toFixed(7)})^{${n}}}{(1 + ${r.toFixed(7)})^{${n}} - 1}
        \\]
        </div>
    `;
    if (window.MathJax && window.MathJax.typeset) MathJax.typeset();
});
