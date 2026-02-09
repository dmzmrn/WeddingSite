// Looping Typing Effect for Footer
document.addEventListener('DOMContentLoaded', function() {
	const typingElement = document.getElementById('typingFooter');
	
	if (!typingElement) return;
	
	// Multiple messages to cycle through
    const messages = [
    "Dominic & Karla",
    "Wedding • April 2025",
    "Celebrating love with family and friends",
    "We look forward to celebrating with you"
    ];
	
	let messageIndex = 0;
	let charIndex = 0;
	let isDeleting = false;
	
	const typingSpeed = 80;
	const deletingSpeed = 40;
	const pauseBeforeDelete = 2000;
	const pauseBeforeType = 500;
	
	function type() {
		const currentMessage = messages[messageIndex];
		
		if (isDeleting) {
			// Deleting characters
			typingElement.textContent = currentMessage.substring(0, charIndex - 1);
			charIndex--;
			
			if (charIndex === 0) {
				isDeleting = false;
				messageIndex = (messageIndex + 1) % messages.length;
				setTimeout(type, pauseBeforeType);
			} else {
				setTimeout(type, deletingSpeed);
			}
		} else {
			// Typing characters
			typingElement.textContent = currentMessage.substring(0, charIndex + 1);
			charIndex++;
			
			if (charIndex === currentMessage.length) {
				isDeleting = true;
				setTimeout(type, pauseBeforeDelete);
			} else {
				setTimeout(type, typingSpeed);
			}
		}
	}
	
	// Start typing
	setTimeout(type, 1000);
});