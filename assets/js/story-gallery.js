// Infinite Scroll Story Gallery
document.addEventListener('DOMContentLoaded', function() {
	const galleries = document.querySelectorAll('.story-gallery');
	
	if (galleries.length === 0) return;
	
	galleries.forEach(gallery => {
		const track = gallery.querySelector('.gallery-track');
		const folder = gallery.getAttribute('data-folder');
		const images = gallery.getAttribute('data-images');
		
		if (!track || !folder || !images) return;
		
		// Parse image list
		const imageList = images.split(',').map(img => img.trim());
		
		// Store full image paths for this gallery
		const imagePaths = imageList.map(img => folder + img);
		gallery.setAttribute('data-image-paths', JSON.stringify(imagePaths));
		
		// Create slides
		imageList.forEach((img, index) => {
			const slide = document.createElement('div');
			slide.className = 'gallery-slide';
			slide.setAttribute('data-index', index);
			slide.innerHTML = `<img src="${folder}${img}" alt="" loading="lazy">`;
			track.appendChild(slide);
		});
		
		// Clone slides for infinite scroll effect
		const slides = track.querySelectorAll('.gallery-slide');
		slides.forEach((slide, index) => {
			const clone = slide.cloneNode(true);
			clone.setAttribute('data-index', slide.getAttribute('data-index'));
			track.appendChild(clone);
		});
		
		// Randomize animation duration for variety
		const duration = 15 + Math.random() * 10;
		track.style.animationDuration = `${duration}s`;
		
		// Click to open preview
		const allSlides = track.querySelectorAll('.gallery-slide');
		allSlides.forEach(slide => {
			slide.addEventListener('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				const index = parseInt(this.getAttribute('data-index'));
				openGalleryPreview(imagePaths, index);
			});
		});
	});
	
	// Gallery Preview Function
	function openGalleryPreview(images, startIndex) {
		let currentIndex = startIndex;
		
		// Create overlay
		const overlay = document.createElement('div');
		overlay.className = 'gallery-preview-overlay';
		overlay.innerHTML = `
			<div class="gallery-preview-content">
				<div class="gallery-preview-close">&times;</div>
				<button class="gallery-preview-nav gallery-preview-prev">
					<i class="fa-solid fa-chevron-left"></i>
				</button>
				<div class="gallery-preview-image-container">
					<img src="${images[currentIndex]}" alt="">
					<div class="gallery-preview-counter">${currentIndex + 1} / ${images.length}</div>
				</div>
				<button class="gallery-preview-nav gallery-preview-next">
					<i class="fa-solid fa-chevron-right"></i>
				</button>
			</div>
		`;
		document.body.appendChild(overlay);
		document.body.style.overflow = 'hidden';
		
		const imgElement = overlay.querySelector('.gallery-preview-image-container img');
		const counter = overlay.querySelector('.gallery-preview-counter');
		const prevBtn = overlay.querySelector('.gallery-preview-prev');
		const nextBtn = overlay.querySelector('.gallery-preview-next');
		const closeBtn = overlay.querySelector('.gallery-preview-close');
		
		// Update image function
		function updateImage() {
			imgElement.style.opacity = '0';
			setTimeout(() => {
				imgElement.src = images[currentIndex];
				counter.textContent = `${currentIndex + 1} / ${images.length}`;
				imgElement.style.opacity = '1';
			}, 150);
		}
		
		// Previous image
		prevBtn.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			currentIndex = (currentIndex - 1 + images.length) % images.length;
			updateImage();
		});
		
		// Next image
		nextBtn.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			currentIndex = (currentIndex + 1) % images.length;
			updateImage();
		});
		
		// Close button
		closeBtn.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			overlay.remove();
			document.body.style.overflow = '';
		});
		
		// Close on background click
		overlay.addEventListener('click', function(e) {
			if (e.target === overlay || e.target.classList.contains('gallery-preview-content')) {
				e.preventDefault();
				e.stopPropagation();
				overlay.remove();
				document.body.style.overflow = '';
			}
		});
		
		// Prevent clicks on image container from closing
		overlay.querySelector('.gallery-preview-image-container').addEventListener('click', function(e) {
			e.stopPropagation();
		});
		
		// Keyboard navigation
		const keyHandler = function(e) {
			e.stopPropagation();
			if (e.key === 'Escape') {
				overlay.remove();
				document.body.style.overflow = '';
				document.removeEventListener('keydown', keyHandler);
			} else if (e.key === 'ArrowLeft') {
				currentIndex = (currentIndex - 1 + images.length) % images.length;
				updateImage();
			} else if (e.key === 'ArrowRight') {
				currentIndex = (currentIndex + 1) % images.length;
				updateImage();
			}
		};
		document.addEventListener('keydown', keyHandler);
		
		// Touch swipe support for mobile
		let touchStartX = 0;
		let touchEndX = 0;
		
		overlay.addEventListener('touchstart', function(e) {
			touchStartX = e.changedTouches[0].screenX;
		}, { passive: true });
		
		overlay.addEventListener('touchend', function(e) {
			touchEndX = e.changedTouches[0].screenX;
			handleSwipe();
		}, { passive: true });
		
		function handleSwipe() {
			const swipeThreshold = 50;
			const diff = touchStartX - touchEndX;
			
			if (Math.abs(diff) > swipeThreshold) {
				if (diff > 0) {
					// Swipe left - next image
					currentIndex = (currentIndex + 1) % images.length;
				} else {
					// Swipe right - previous image
					currentIndex = (currentIndex - 1 + images.length) % images.length;
				}
				updateImage();
			}
		}
	}
});