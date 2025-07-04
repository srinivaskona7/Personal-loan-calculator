document.getElementById('loan-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const principal = parseFloat(document.getElementById('loan-amount').value);
    const annualInterest = parseFloat(document.getElementById('interest-rate').value);
    const years = parseInt(document.getElementById('loan-term').value);

    // Monthly interest rate
    const r = (annualInterest / 100) / 12;
    const n = years * 12;  // Total number of payments

    // EMI calculation
    const EMI = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);

    // Total interest for the tenure
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

    // Show loan details and amortization schedule
    document.getElementById('total-interest').innerText = Math.ceil(totalInterestForTenure);

    // Display loan details
    document.getElementById('loan-amount-display').innerText = principal;
    document.getElementById('interest-rate-display').innerText = annualInterest;
    document.getElementById('loan-term-display').innerText = years;
    document.getElementById('monthly-interest-rate-display').innerText = r.toFixed(7);
    document.getElementById('total-payments-display').innerText = n;
    document.getElementById('emi-display').innerText = Math.ceil(EMI);

    // Hide the form and show the results
    document.getElementById('loan-form').style.display = "none";
    document.getElementById('schedule').style.display = "block";
    document.getElementById('loan-details').style.display = "block";

    // Generate table for amortization schedule
    let scheduleHTML = '';
    schedule.forEach(payment => {
        scheduleHTML += `
            <tr>
                <td>${payment.month}</td>
                <td>${payment.monthlyPayment}</td>
                <td>${payment.interestPayment}</td>
                <td>${payment.principalPayment}</td>
                <td>${payment.totalPrincipalPaid}</td>
                <td>${payment.balance}</td>
                <td>${payment.totalInterestPaid}</td>
                <td>${payment.remainingInterest}</td>
            </tr>
        `;
    });

    // Update table body
    document.querySelector('#amortization-table tbody').innerHTML = scheduleHTML;
});
