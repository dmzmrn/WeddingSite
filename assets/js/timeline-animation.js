// Timeline Scroll Zoom Animation
document.addEventListener('DOMContentLoaded', function() {
	const timelineItems = document.querySelectorAll('.timeline-item, .timeline-start, .timeline-end');
	
	// Skip if no timeline items found
	if (timelineItems.length === 0) return;

	function checkInView() {
		const windowHeight = window.innerHeight;
		const centerY = windowHeight / 2;
		const tolerance = windowHeight * 0.4; // Increased tolerance to 40% for better detection

		timelineItems.forEach((item, index) => {
			const rect = item.getBoundingClientRect();
			const itemCenterY = rect.top + (rect.height / 2);
			
			// Check if item center is near viewport center
			const distanceFromCenter = Math.abs(itemCenterY - centerY);
			
			// Special handling for last items - trigger earlier
			const isLastItems = index >= timelineItems.length - 2;
			const itemTolerance = isLastItems ? windowHeight * 0.6 : tolerance;
			
			// Also trigger if item is in the bottom portion of viewport (for last items)
			const isInBottomView = rect.top < windowHeight * 0.85 && rect.bottom > 0;
			
			if (distanceFromCenter < itemTolerance || (isLastItems && isInBottomView)) {
				item.classList.add('in-view');
			} else {
				item.classList.remove('in-view');
			}
		});
	}

	// Check on scroll with throttling for performance
	let ticking = false;
	window.addEventListener('scroll', function() {
		if (!ticking) {
			window.requestAnimationFrame(function() {
				checkInView();
				ticking = false;
			});
			ticking = true;
		}
	});

	// Initial check
	checkInView();
	
	// Also check when window is resized
	window.addEventListener('resize', checkInView);
	
	// Check again after a short delay (for dynamic content)
	setTimeout(checkInView, 500);
});