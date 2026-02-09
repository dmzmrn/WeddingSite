// Color Range Slider for Wedding Dress Code
document.addEventListener('DOMContentLoaded', function() {
	const colorCircles = document.querySelectorAll('.color-circle');
	const popup = document.getElementById('colorRangePopup');
	const colorRangeBar = document.getElementById('colorRangeBar');
	const colorRangeTitle = document.getElementById('colorRangeTitle');
	const colorRangeClose = document.getElementById('colorRangeClose');
	const colorSlider = document.getElementById('colorSlider');
	const colorHexValue = document.getElementById('colorHexValue');
	
	// Track currently active circle and original color
	let activeCircle = null;
	let originalColor = null;
	
	// Maximum lightness factor (0.4 = 40% toward white, keeps it semi-light)
	const MAX_LIGHTNESS = 0.4;
	
	// Skip if elements don't exist
	if (!popup || !colorRangeBar || !colorSlider) return;
	
	// Function to convert hex to RGB
	function hexToRgb(hex) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	}
	
	// Function to convert RGB to hex
	function rgbToHex(r, g, b) {
		return "#" + [r, g, b].map(x => {
			const hex = Math.round(x).toString(16);
			return hex.length === 1 ? '0' + hex : hex;
		}).join('').toUpperCase();
	}
	
	// Function to calculate shade based on slider value (0-100)
	function calculateShade(hexColor, sliderValue) {
		const rgb = hexToRgb(hexColor);
		if (!rgb) return hexColor;
		
		// Convert slider value (0-100) to factor (0 to MAX_LIGHTNESS)
		const factor = (sliderValue / 100) * MAX_LIGHTNESS;
		
		const r = rgb.r + (255 - rgb.r) * factor;
		const g = rgb.g + (255 - rgb.g) * factor;
		const b = rgb.b + (255 - rgb.b) * factor;
		
		return rgbToHex(r, g, b);
	}
	
	// Function to generate gradient for the bar
	function generateGradient(hexColor) {
		const rgb = hexToRgb(hexColor);
		if (!rgb) return hexColor;
		
		// End color (semi-light, not white)
		const endR = rgb.r + (255 - rgb.r) * MAX_LIGHTNESS;
		const endG = rgb.g + (255 - rgb.g) * MAX_LIGHTNESS;
		const endB = rgb.b + (255 - rgb.b) * MAX_LIGHTNESS;
		const endColor = rgbToHex(endR, endG, endB);
		
		return `linear-gradient(to right, ${hexColor}, ${endColor})`;
	}
	
	// Function to show color range
	function showColorRange(color, name, circleElement) {
		// Store references
		activeCircle = circleElement;
		originalColor = color;
		
		// Set gradient background
		colorRangeBar.style.background = generateGradient(color);
		
		// Reset slider to 0
		colorSlider.value = 0;
		
		// Update hex display
		colorHexValue.textContent = color.toUpperCase();
		
		// Update title
		colorRangeTitle.textContent = name;
		
		// Show popup
		popup.classList.add('active');
		
		// Scroll to popup smoothly
		setTimeout(() => {
			popup.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		}, 100);
	}
	
	// Function to update color circle based on slider
	function updateColorFromSlider(value) {
		if (activeCircle && originalColor) {
			const newColor = calculateShade(originalColor, value);
			activeCircle.style.backgroundColor = newColor;
			colorHexValue.textContent = newColor;
		}
	}
	
	// Function to reset color circle to original
	function resetColorCircle() {
		if (activeCircle && originalColor) {
			activeCircle.style.backgroundColor = originalColor;
		}
	}
	
	// Slider input event
	colorSlider.addEventListener('input', function() {
		updateColorFromSlider(this.value);
	});
	
	// Add click event to color circles
	colorCircles.forEach(circle => {
		circle.addEventListener('click', function() {
			const color = this.getAttribute('data-color');
			const name = this.getAttribute('data-name');
			
			// Reset previous circle to original color
			resetColorCircle();
			
			// Remove active class from all circles
			colorCircles.forEach(c => c.classList.remove('active'));
			
			// Add active class to clicked circle
			this.classList.add('active');
			
			// Show color range
			showColorRange(color, name, this);
		});
	});
	
	// Close popup and reset
	function closePopup() {
		popup.classList.remove('active');
		resetColorCircle();
		colorCircles.forEach(c => c.classList.remove('active'));
		activeCircle = null;
		originalColor = null;
	}
	
	// Close popup
	if (colorRangeClose) {
		colorRangeClose.addEventListener('click', function(e) {
			e.stopPropagation();
			closePopup();
		});
	}
	
	// Close popup when clicking outside
	document.addEventListener('click', function(e) {
		if (!e.target.closest('.color-palette')) {
			closePopup();
		}
	});
});