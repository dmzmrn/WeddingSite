// ============================================
// FAQ ACCORDION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
	const faqItems = document.querySelectorAll('.faq-item');

	faqItems.forEach(item => {
		const question = item.querySelector('.faq-question');

		question.addEventListener('click', function() {
			const isActive = item.classList.contains('active');

			faqItems.forEach(otherItem => {
				if (otherItem !== item) {
					otherItem.classList.remove('active');
					otherItem.querySelector('.faq-answer').classList.remove('active');
				}
			});

			if (isActive) {
				item.classList.remove('active');
				item.querySelector('.faq-answer').classList.remove('active');
			} else {
				item.classList.add('active');
				item.querySelector('.faq-answer').classList.add('active');
			}
		});
	});
});
