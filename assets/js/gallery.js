// ============================================
// GALLERY LIGHTBOX
// ============================================

let currentImageIndex = 0;
let galleryImages = [];

function openLightbox(img) {
	galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
	currentImageIndex = galleryImages.indexOf(img);

	const lightbox = document.getElementById('lightbox');
	const lightboxImg = document.getElementById('lightbox-img');

	lightboxImg.src = img.src;
	lightboxImg.alt = img.alt;
	lightbox.classList.add('active');

	document.body.style.overflow = 'hidden';
}

function closeLightbox() {
	const lightbox = document.getElementById('lightbox');
	lightbox.classList.remove('active');
	document.body.style.overflow = 'auto';
}

function changeImage(direction) {
	currentImageIndex += direction;

	if (currentImageIndex >= galleryImages.length) {
		currentImageIndex = 0;
	} else if (currentImageIndex < 0) {
		currentImageIndex = galleryImages.length - 1;
	}

	const lightboxImg = document.getElementById('lightbox-img');
	const currentImg = galleryImages[currentImageIndex];

	lightboxImg.src = currentImg.src;
	lightboxImg.alt = currentImg.alt;
}

document.addEventListener('DOMContentLoaded', function() {
	// Replace onclick handlers for gallery images
	document.querySelectorAll('.gallery-item img').forEach(function(img) {
		img.addEventListener('click', function() {
			openLightbox(this);
		});
	});

	// Lightbox close button
	const lightboxClose = document.querySelector('.lightbox-close');
	if (lightboxClose) {
		lightboxClose.addEventListener('click', closeLightbox);
	}

	// Lightbox nav buttons
	const lightboxPrev = document.querySelector('.lightbox-prev');
	if (lightboxPrev) {
		lightboxPrev.addEventListener('click', function() {
			changeImage(-1);
		});
	}

	const lightboxNext = document.querySelector('.lightbox-next');
	if (lightboxNext) {
		lightboxNext.addEventListener('click', function() {
			changeImage(1);
		});
	}

	// Close on background click
	document.getElementById('lightbox').addEventListener('click', function(e) {
		if (e.target === this) {
			closeLightbox();
		}
	});
});

document.addEventListener('keydown', function(e) {
	if (e.key === 'Escape') {
		closeLightbox();
		closeEticket();
	} else if (e.key === 'ArrowLeft') {
		if (document.getElementById('lightbox').classList.contains('active')) {
			changeImage(-1);
		}
	} else if (e.key === 'ArrowRight') {
		if (document.getElementById('lightbox').classList.contains('active')) {
			changeImage(1);
		}
	}
});
