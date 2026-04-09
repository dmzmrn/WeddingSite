// ============================================
// E-TICKET FUNCTIONS
// ============================================

function generateTicketID() {
	const now = Date.now();
	const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

	// Convert timestamp to base36 for shorter string
	const encoded = now.toString(36).toUpperCase();

	return `DK-${encoded}${random}`;
}

function assignTableNumber(guestName) {
	let hash = 0;
	for (let i = 0; i < guestName.length; i++) {
		hash = guestName.charCodeAt(i) + ((hash << 5) - hash);
	}
	return Math.abs(hash % 10) + 1;
}

function generateQRCode(guestName, ticketID) {
	const qrContainer = document.getElementById('ticketQR');
	if (!qrContainer) return;
	qrContainer.innerHTML = '';

	const qrText = `${guestName}\nConfirmed Guest - Thank you for celebrating with us!\nTicket ID: ${ticketID}`;

	// Use QRServer API with larger size for better scanning
	const encodedText = encodeURIComponent(qrText);
	const qrImage = document.createElement('img');

	// Generate larger QR (300x300) then scale down with CSS
	qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedText}&margin=10`;
	qrImage.alt = 'QR Code';
	qrImage.style.width = '100%';
	qrImage.style.height = '100%';
	qrImage.style.objectFit = 'contain';

	// Handle loading error - try backup API
	qrImage.onerror = function() {
		console.log('Primary QR API failed, trying backup...');

		// Backup: QRCode.js library
		if (typeof QRCode !== 'undefined') {
			qrContainer.innerHTML = '';
			new QRCode(qrContainer, {
				text: qrText,
				width: 200,
				height: 200,
				colorDark: '#000000',
				colorLight: '#ffffff',
				correctLevel: QRCode.CorrectLevel.L
			});

			// Resize after creation
			setTimeout(function() {
				const canvas = qrContainer.querySelector('canvas');
				const img = qrContainer.querySelector('img');
				if (canvas) {
					canvas.style.width = '100%';
					canvas.style.height = '100%';
				}
				if (img) {
					img.style.width = '100%';
					img.style.height = '100%';
				}
			}, 100);
		} else {
			// Final fallback: different API
			qrImage.src = `https://quickchart.io/qr?text=${encodedText}&size=300&margin=2`;
		}
	};

	// Handle successful load
	qrImage.onload = function() {
		console.log('QR Code generated successfully');
	};

	qrContainer.appendChild(qrImage);
}

function toProperCase(str) {
	return str
		.toLowerCase()
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

function getPhilippineDateTime() {
	return new Date().toLocaleString('sv-SE', {
		timeZone: 'Asia/Manila'
	}).replace('T', ' ');
}

function showEticketWithID(firstname, surname, ticketID) {
	const guestName = `${toProperCase(firstname)} ${toProperCase(surname)}`;

	document.getElementById('ticketGuestName').textContent = guestName;
	document.getElementById('ticketStatus').textContent = '✗ Rejected';
	document.getElementById('ticketID').textContent = ticketID;

	generateQRCode(guestName, ticketID);

	document.getElementById('eticketModal').classList.add('active');
	document.body.style.overflow = 'hidden';
}

function closeEticket() {
	const eticketModal = document.getElementById('eticketModal');
	if (eticketModal) {
		eticketModal.classList.remove('active');
		document.body.style.overflow = '';
	}
}

// ============================================
// RSVP FORM SUBMISSION WITH SHEETDB
// ============================================

const TEST_MODE = true;

document.getElementById('contactForm').addEventListener('submit', async function(e) {
	e.preventDefault();

	const submitBtn = this.querySelector('input[type="submit"]');
	const messageDiv = document.getElementById('form-message');

	if (submitBtn.disabled) {
		return;
	}

	const surname = document.getElementById('surname').value.toLowerCase().trim();
	const firstname = document.getElementById('firstname').value.toLowerCase().trim();
	const attendanceElement = document.querySelector('input[name="attendance"]:checked');

	if (!surname || !firstname || !attendanceElement) {
		showMessage('Please fill in all required fields.', 'error');
		return;
	}

	const attendance = attendanceElement.value;

	// Generate ticket ID for all submissions
	const ticketID = generateTicketID();
	// ============================================
	//  TEST MODE - BYPASS SHEETDB
	// ============================================
	if (TEST_MODE) {
		console.log('⚠️ TEST MODE: Bypassing SheetDB');
		console.log('Name:', firstname, surname);
		console.log('Attendance:', attendance);

		if (attendance === 'Yes') {
			showEticketWithID(firstname, surname, ticketID);
			showMessage('Sorry RSVP Is Closed: No Response recorded!', 'success');
		} else if (attendance === 'Maybe') {
			showMessage('Sorry RSVP Is Closed: No Response recorded.', 'success');
		} else {
			showMessage('Sorry RSVP Is Closed: No Response recorded.', 'success');
		}

		document.getElementById('contactForm').reset();
		return; // Skip SheetDB call
	}
	// ============================================
	// END TEST MODE
	// ============================================

	const originalText = submitBtn.value;
	submitBtn.disabled = true;
	submitBtn.value = 'Submitting...';
	showMessage('Submitting your RSVP...', 'info');

	// Main guest list SheetDB
	const sheetDBBaseURL = 'https://sheetdb.io/api/v1/y1tkdjo83b104';

	// SheetDB for unknown guests
	const unknownGuestSheetDB = 'https://sheetdb.io/api/v1/qomxxfhll5ofw';

	const base = (4180 * 1000) + (20 * 100) + (13 * 2);
	const generatedId = base + surname + firstname;
	const patchURL = sheetDBBaseURL + '/id/' + encodeURIComponent(generatedId);

	const payload = {
		data: {
			'Attendance': attendance,
			'TicketID': ticketID,
			'Date': getPhilippineDateTime()
		}
	};

	console.log('Sending to SheetDB:', payload);

	try {
		const response = await fetch(patchURL, {
			method: 'PATCH',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		if (response.ok) {
			const result = await response.json();
			console.log('SheetDB response:', result);

			if (attendance === 'Yes') {
				showEticketWithID(firstname, surname, ticketID);
				showMessage('Thank you for your RSVP! Your e-ticket is ready.', 'success');
			} else if (attendance === 'Maybe') {
				showMessage('Thank you! We hope to see you there. Please confirm when you can.', 'success');
			} else {
				showMessage('We\'re sorry you can\'t make it. Thank you for letting us know!', 'success');
			}

			document.getElementById('contactForm').reset();

		} else if (response.status === 404) {
			// Guest not found - save to separate sheet
			console.log('Guest not on list, saving to request sheet...');

			await saveUnknownGuest(unknownGuestSheetDB, firstname, surname, attendance, ticketID, generatedId);
			showEticketWithID(firstname, surname, ticketID);
			showMessage('Thank you for your interest! We have received your request and will get back to you soon.', 'success');
			document.getElementById('contactForm').reset();

		} else {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}
	} catch (error) {
		console.error('RSVP submission error:', error);
		showMessage('There was an error submitting your RSVP. Please try again or contact us directly.', 'error');
	} finally {
		submitBtn.disabled = false;
		submitBtn.value = originalText;
	}

	function showMessage(text, type) {
		const colors = {
			error: '#e74c3c',
			success: '#27ae60',
			info: '#3498db'
		};
		messageDiv.textContent = text;
		messageDiv.style.display = 'block';
		messageDiv.style.color = colors[type] || '#333';
		messageDiv.style.fontWeight = '500';
	}
});

async function saveUnknownGuest(sheetURL, firstname, surname, attendance, ticketID, generatedId) {
	const payload = {
		data: {
			'id': generatedId,
			'Surname': toProperCase(surname),
			'Firstname': toProperCase(firstname),
			'Attendance': attendance,
			'TicketID': ticketID,
			'Date': getPhilippineDateTime()
		}
	};

	try {
		const response = await fetch(sheetURL, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		if (response.ok) {
			console.log('Unknown guest saved successfully');
		} else {
			console.error('Failed to save unknown guest');
		}
	} catch (error) {
		console.error('Error saving unknown guest:', error);
	}
}

// ============================================
// E-TICKET MODAL CONTROLS (on DOM ready)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
	const eticketModal = document.getElementById('eticketModal');
	const eticketClose = document.getElementById('eticketClose');
	const modalContent = document.querySelector('.eticket-modal-content');

	// Close button
	if (eticketClose) {
		eticketClose.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			closeEticket();
		});
	}

	// Close on background click
	if (eticketModal) {
		eticketModal.addEventListener('click', function(e) {
			if (e.target === eticketModal) {
				closeEticket();
			}
		});
	}

	// Prevent content clicks from closing
	if (modalContent) {
		modalContent.addEventListener('click', function(e) {
			e.stopPropagation();
		});
	}

	// Close on Escape key
	document.addEventListener('keydown', function(e) {
		if (e.key === 'Escape') {
			if (eticketModal && eticketModal.classList.contains('active')) {
				closeEticket();
			}
		}
	});

	// Download JPG
	const downloadJPG = document.getElementById('downloadJPG');
	if (downloadJPG) {
		downloadJPG.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();

			const eticketCard = document.getElementById('eticketCard');

			if (typeof html2canvas !== 'undefined') {
				html2canvas(eticketCard, {
					scale: 2,
					backgroundColor: '#ffffff',
					useCORS: true
				}).then(canvas => {
					const link = document.createElement('a');
					link.download = `wedding-eticket-${document.getElementById('ticketID').textContent}.jpg`;
					link.href = canvas.toDataURL('image/jpeg', 0.95);
					link.click();
				});
			}
		});
	}

	// Download PDF
	const downloadPDF = document.getElementById('downloadPDF');
	if (downloadPDF) {
		downloadPDF.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();

			const eticketCard = document.getElementById('eticketCard');

			if (typeof html2canvas !== 'undefined' && typeof jspdf !== 'undefined') {
				html2canvas(eticketCard, {
					scale: 2,
					backgroundColor: '#ffffff',
					useCORS: true
				}).then(canvas => {
					const { jsPDF } = jspdf;
					const pdf = new jsPDF('p', 'mm', 'a4');

					const imgData = canvas.toDataURL('image/jpeg', 0.95);
					const imgWidth = 150;
					const imgHeight = (canvas.height * imgWidth) / canvas.width;
					const x = (210 - imgWidth) / 2;
					const y = 30;

					pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
					pdf.save(`wedding-eticket-${document.getElementById('ticketID').textContent}.pdf`);
				});
			}
		});
	}
});
