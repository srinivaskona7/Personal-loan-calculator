document.getElementById('loan-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const principal = parseFloat(document.getElementById('loan-amount').value);
    const annualInterest = parseFloat(document.getElementById('interest-rate').value);
    const years = parseInt(document.getElementById('loan-term').value);

    const calculateAmortization = (P, r, n) => {
        const x = Math.pow(1 + r, n);
        const monthlyPayment = (P * r * x) / (x - 1);
        let balance = P;
        let schedule = [];

        for (let month = 1; month <= n; month++) {
            const interestPayment = balance * r;
            const principalPayment = monthlyPayment - interestPayment;
            balance -= principalPayment;
            schedule.push({
                month,
                monthlyPayment: monthlyPayment.toFixed(2),
                principalPayment: principalPayment.toFixed(2),
                interestPayment: interestPayment.toFixed(2),
                balance: balance.toFixed(2)
            });
        }

        return schedule;
    };

    const monthlyInterest = annualInterest / 100 / 12;
    const totalMonths = years * 12;
    const amortizationSchedule = calculateAmortization(principal, monthlyInterest, totalMonths);

    let scheduleHTML = `
        <table>
            <thead>
                <tr>
                    <th>Month</th>
                    <th>Monthly Payment (₹)</th>
                    <th>Principal Payment (₹)</th>
                    <th>Interest Payment (₹)</th>
                    <th>Remaining Balance (₹)</th>
                </tr>
            </thead>
            <tbody>
    `;

    amortizationSchedule.forEach(payment => {
        scheduleHTML += `
            <tr>
                <td>${payment.month}</td>
                <td>${payment.monthlyPayment}</td>
                <td>${payment.principalPayment}</td>
                <td>${payment.interestPayment}</td>
                <td>${payment.balance}</td>
            </tr>
        `;
    });

    scheduleHTML += `
            </tbody>
        </table>
    `;

    document.getElementById('schedule').innerHTML = scheduleHTML;
});
