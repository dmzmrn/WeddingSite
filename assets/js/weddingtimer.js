// Wedding Countdown Timer
function updateCountdown() {
	const weddingDate = new Date('April 18, 2026 00:00:00').getTime();
	const now = new Date().getTime();
	const distance = weddingDate - now;
	
	// Wedding day or after
	if (distance < 0) {
		document.getElementById('weddingCountdown').innerHTML = `
			<div class="big-day-message">
				<i class="fa-solid fa-church"></i>
				<span>The big day is here!</span>
			</div>
		`;
		document.querySelector('.countdown-until').style.display = 'none';
		return;
	}
	
	const days = Math.floor(distance / (1000 * 60 * 60 * 24));
	const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((distance % (1000 * 60)) / 1000);
	
	document.getElementById('countDays').textContent = String(days).padStart(2, '0');
	document.getElementById('countHours').textContent = String(hours).padStart(2, '0');
	document.getElementById('countMinutes').textContent = String(minutes).padStart(2, '0');
	document.getElementById('countSeconds').textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();