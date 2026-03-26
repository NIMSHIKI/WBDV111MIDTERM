const clients = [
            {name: "John Doe", email: "john.doe@company.com", status: "Active client • $12,450 total"},
            {name: "Jane Smith", email: "jane.smith@company.com", status: "Pending payment • $8,760 total"},
            {name: "Michael Cruz", email: "michael.cruz@company.com", status: "Overdue invoice • $15,200 total"}
        ];

        function showSection(id) {
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            event.target.closest('.nav-btn').classList.add('active');
        }

        function selectClient(i) {
            const c = clients[i];
            document.getElementById('clientName').textContent = c.name;
            document.getElementById('clientEmail').textContent = c.email;
            document.getElementById('clientStatus').textContent = c.status;
            document.querySelectorAll('.client-item').forEach((item, idx) => 
                item.classList.toggle('active', idx === i)
            );
        }

        function payNow() {
            alert('🔐 2FA Required\nVerification code sent to device');
        }

        function viewDetails() {
            alert('🔐 2FA Required\nAccessing secure client portal');
        }