// Background Music Player with Vertical Volume Control
document.addEventListener('DOMContentLoaded', function() {
	const musicPlayer = document.getElementById('musicPlayer');
	const musicBtn = document.getElementById('musicBtn');
	const musicIcon = document.getElementById('musicIcon');
	const bgMusic = document.getElementById('bgMusic');
	const volumeSlider = document.getElementById('volumeSlider');
	const volumeValue = document.getElementById('volumeValue');
	const volumeContainer = document.getElementById('volumeContainer');
	
	if (!musicBtn || !bgMusic) return;
	
	let isPlaying = false;
	let hasStarted = false;
	let volumeTimeout = null;
	let idleTimeout = null;
	
	// Set initial volume to 100%
	bgMusic.volume = 1.0;
	
	// Prevent clicks from bubbling up to article/body
	musicPlayer.addEventListener('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
	});
	
	musicPlayer.addEventListener('mousedown', function(e) {
		e.stopPropagation();
	});
	
	musicPlayer.addEventListener('touchstart', function(e) {
		e.stopPropagation();
	});
	
	// Function to update volume slider background (vertical)
	function updateSliderBackground(value) {
		const percentage = value;
		volumeSlider.style.background = `linear-gradient(to top, #9b8aa5 ${percentage}%, #e0e0e0 ${percentage}%)`;
	}
	
	// Initialize slider background at 100%
	updateSliderBackground(100);
	
	// Function to update icon based on volume and play state
	function updateVolumeIcon() {
		const volume = parseInt(volumeSlider.value);
		
		if (!isPlaying) {
			musicIcon.className = 'fa-solid fa-volume-xmark';
		} else if (volume === 0) {
			musicIcon.className = 'fa-solid fa-volume-off';
		} else if (volume < 50) {
			musicIcon.className = 'fa-solid fa-volume-low';
		} else {
			musicIcon.className = 'fa-solid fa-volume-high';
		}
	}
	
	// Function to reset idle timer
	function resetIdleTimer() {
		musicPlayer.classList.remove('idle');
		clearTimeout(idleTimeout);
		
		if (isPlaying) {
			idleTimeout = setTimeout(function() {
				musicPlayer.classList.add('idle');
			}, 5000);
		}
	}
	
	// Function to show volume slider
	function showVolumeSlider() {
		musicPlayer.classList.add('volume-open');
		clearTimeout(volumeTimeout);
		resetIdleTimer();
	}
	
	// Function to hide volume slider
	function hideVolumeSlider() {
		volumeTimeout = setTimeout(function() {
			musicPlayer.classList.remove('volume-open');
		}, 2000);
	}
	
	// Function to play music
	function playMusic() {
		bgMusic.play().then(() => {
			isPlaying = true;
			hasStarted = true;
			musicPlayer.classList.add('playing');
			musicPlayer.classList.remove('idle');
			musicBtn.title = 'Pause Music';
			updateVolumeIcon();
			resetIdleTimer();
		}).catch(error => {
			console.log('Audio play failed:', error);
		});
	}
	
	// Function to pause music
	function pauseMusic() {
		bgMusic.pause();
		isPlaying = false;
		musicPlayer.classList.remove('playing');
		musicPlayer.classList.remove('idle');
		musicBtn.title = 'Play Music';
		updateVolumeIcon();
		clearTimeout(idleTimeout);
	}
	
	// Function to toggle music
	function toggleMusic() {
		if (isPlaying) {
			pauseMusic();
		} else {
			playMusic();
		}
	}
	
	// Function to toggle volume slider
	function toggleVolumeSlider() {
		if (musicPlayer.classList.contains('volume-open')) {
			clearTimeout(volumeTimeout);
			musicPlayer.classList.remove('volume-open');
		} else {
			showVolumeSlider();
			hideVolumeSlider();
		}
	}
	
	// Volume slider events
	if (volumeSlider) {
		volumeSlider.addEventListener('input', function(e) {
			e.preventDefault();
			e.stopPropagation();
			
			const volume = this.value / 100;
			bgMusic.volume = volume;
			volumeValue.textContent = this.value + '%';
			updateSliderBackground(this.value);
			updateVolumeIcon();
			resetIdleTimer();
			
			clearTimeout(volumeTimeout);
			hideVolumeSlider();
		});
		
		volumeSlider.addEventListener('mousedown', function(e) {
			e.stopPropagation();
			clearTimeout(volumeTimeout);
			resetIdleTimer();
		});
		
		volumeSlider.addEventListener('touchstart', function(e) {
			e.stopPropagation();
			clearTimeout(volumeTimeout);
			resetIdleTimer();
		});
		
		volumeSlider.addEventListener('mouseup', function(e) {
			e.stopPropagation();
			hideVolumeSlider();
		});
		
		volumeSlider.addEventListener('touchend', function(e) {
			e.stopPropagation();
			hideVolumeSlider();
		});
		
		volumeSlider.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
		});
	}
	
	// Volume container events
	if (volumeContainer) {
		volumeContainer.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
		});
		
		volumeContainer.addEventListener('mouseenter', function() {
			clearTimeout(volumeTimeout);
			resetIdleTimer();
		});
		
		volumeContainer.addEventListener('mouseleave', function() {
			hideVolumeSlider();
		});
	}
	
	// Music button events
	musicBtn.addEventListener('mouseenter', function() {
		resetIdleTimer();
	});
	
	musicBtn.addEventListener('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		toggleMusic();
		toggleVolumeSlider();
		resetIdleTimer();
	});
	
	// Trigger music on article nav link click (first time only)
	const navLinks = document.querySelectorAll('#header nav a');
	navLinks.forEach(link => {
		link.addEventListener('click', function() {
			if (!hasStarted) {
				playMusic();
			}
		});
	});
	
	// Also trigger on any article open (backup)
	const observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if (mutation.target.classList.contains('is-article-visible') && !hasStarted) {
				playMusic();
			}
		});
	});
	
	observer.observe(document.body, {
		attributes: true,
		attributeFilter: ['class']
	});
	
	// Pause when tab is hidden
	document.addEventListener('visibilitychange', function() {
		if (document.hidden && isPlaying) {
			pauseMusic();
		}
	});
	
	// Close volume slider when clicking outside
	document.addEventListener('click', function(e) {
		if (!e.target.closest('.music-player')) {
			clearTimeout(volumeTimeout);
			musicPlayer.classList.remove('volume-open');
		}
	});
});