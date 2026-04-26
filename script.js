document.addEventListener('DOMContentLoaded', () => {
    const ticketModal = new bootstrap.Modal(document.getElementById('ticketModal'));
    const bookingForm = document.getElementById('bookingForm');
    const bookingsList = document.getElementById('myBookingsList');
    let currentMatch = "";

    document.querySelectorAll('.btn-tickets').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.match-card');
            const team1 = card.querySelectorAll('.team span')[0].innerText;
            const team2 = card.querySelectorAll('.team span')[1].innerText;

            currentMatch = `${team1} vs ${team2}`;

            document.getElementById('modalMatchName').innerText = currentMatch;
            updateBookingsDisplay();
            ticketModal.show();
        });
    });

    const newsModalElement = document.getElementById('newsModal');
    const newsModal = new bootstrap.Modal(newsModalElement);

    document.querySelectorAll('.news-more').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const title = this.getAttribute('data-title');
            const text = this.getAttribute('data-text');
            const imgSrc = this.getAttribute('data-img');

            const titleEl = document.getElementById('newsModalTitle');
            const textEl = document.getElementById('newsModalText');
            const imgEl = document.getElementById('newsModalImg');

            titleEl.innerText = title;
            textEl.innerText = text;
            imgEl.src = imgSrc;

            titleEl.classList.remove('d-none');
            imgEl.classList.remove('d-none');

            newsModal.show();
        });
    });

    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const bookingData = {
                match: currentMatch,
                sector: document.getElementById('sectorSelect').value,
                count: document.getElementById('ticketCount').value,
                date: new Date().toLocaleString()
            };

            const allBookings = JSON.parse(localStorage.getItem('fcKyiv_bookings') || '[]');
            allBookings.push(bookingData);

            localStorage.setItem('fcKyiv_bookings', JSON.stringify(allBookings));

            alert('Квитки успішно заброньовано (дані збережено у вашому браузері)!');
            updateBookingsDisplay();
            this.reset();
        });
    }

    function updateBookingsDisplay() {
        const allBookings = JSON.parse(localStorage.getItem('fcKyiv_bookings') || '[]');
        const filtered = allBookings.filter(b => b.match === currentMatch);

        if (filtered.length === 0) {
            bookingsList.innerHTML = '<li class="list-group-item text-muted">У вас поки немає бронювань на цей матч.</li>';
        } else {
            bookingsList.innerHTML = filtered.map(b => `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${b.sector}</strong> — ${b.count} шт.
                        <br><small class="text-muted">${b.date}</small>
                    </div>
                    <span class="badge bg-success rounded-pill">Оплачено</span>
                </li>
            `).join('');
        }
    }

    const contactForm = document.querySelector('form[action^="https://formspree.io"]');

    if (contactForm) {
        contactForm.addEventListener('submit', function() {
            const btn = this.querySelector('button');
            btn.disabled = true;
            btn.innerText = "Відправляємо...";
        });
    }
});