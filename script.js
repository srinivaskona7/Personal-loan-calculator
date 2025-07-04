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
    let schedule = [];

    for (let month = 1; month <= n; month++) {
        const interestPayment = balance * r;
        const principalPayment = EMI - interestPayment;
        balance -= principalPayment;
        totalInterestPaid += interestPayment;
        remainingInterest = totalInterestForTenure - totalInterestPaid;

        schedule.push({
            month,
            monthlyPayment: EMI.toFixed(2),
            interestPayment: interestPayment.toFixed(2),
            principalPayment: principalPayment.toFixed(2),
            balance: balance.toFixed(2),
            totalInterestPaid: totalInterestPaid.toFixed(2),
            remainingInterest: remainingInterest.toFixed(2),
        });
    }

    // Display total interest
    document.getElementById('total-interest').innerText = totalInterestForTenure.toFixed(2);

    // Generate table for amortization schedule
    let scheduleHTML = '';
    schedule.forEach(payment => {
        scheduleHTML += `
            <tr>
                <td>${payment.month}</td>
                <td>${payment.monthlyPayment}</td>
                <td>${payment.interestPayment}</td>
                <td>${payment.principalPayment}</td>
                <td>${payment.balance}</td>
                <td>${payment.totalInterestPaid}</td>
                <td>${payment.remainingInterest}</td>
            </tr>
        `;
    });

    // Update table body
    document.querySelector('#amortization-table tbody').innerHTML = scheduleHTML;
});
