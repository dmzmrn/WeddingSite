# Wedding Website - Dominic & Karla

A beautiful, elegant wedding website for announcing our special day on **April 18, 2026**.

## 📸 Preview

The website features:
- Elegant hero section with save-the-date announcement
- Interactive navigation to different wedding information sections
- Romantic design with infinity symbol branding
- Responsive layout for all devices

---

## 🎨 Features

#### 1. **Our Story / How We Met**
- Personal narrative about the couple
- Timeline of relationship milestones
- First date memories
- Proposal story
- Romantic quotes and messages

#### 2. **Wedding Details**
- **Date & Time:** Complete ceremony and reception schedule
- **Venue Information:** 
  - Ceremony and reception locations
  - Interactive Google Maps buttons for easy navigation
  - Sample coordinates: `14.6760,121.0437` (customizable)
- **Dress Code:** 
  - Visual color palette guide
  - 8 elegant color circles showing recommended colors
  - Gradient from dark blue → purple → teal
  - Colors: Navy (#1a237e), Indigo (#3949ab), Deep Purple (#5e35b1), Purple (#7b1fa2), Royal Purple (#6a1b9a), Purple Violet (#4a148c), Teal (#00897b), Cyan Teal (#00acc1)
- **Accommodations:** Hotel recommendations and booking info
- **Transportation & Parking:** Logistics for guests
- **Schedule of Events:** Detailed timeline of the wedding day

#### 3. **FAQ (Frequently Asked Questions)**
- Interactive collapsible accordion format
- Click question to reveal answer
- Smooth animations
- Sample questions include:
  - Dress code details
  - Plus one policy
  - Parking information
  - Accessibility info
  - Dietary restrictions
  - Photo policy
  - Gift registry
  - Weather expectations

#### 4. **Gallery / Memories**
- Photo gallery of couple's memories
- Interactive lightbox functionality
- Click to open images in full-screen view
- Navigation arrows for browsing
- ESC key or X button to close
- Smooth transitions and animations
- Grid layout (responsive: 3-4 columns desktop, 2 tablet, 1 mobile)

---

## 🛠️ Technical Details

### Technologies Used
- HTML5
- CSS3 (with modern features like backdrop-filter, flexbox, grid)
- JavaScript (for interactive elements)
- Responsive design principles

### Key Design Patterns

#### Interactive Elements
- Color circles with hover effects (scale and shadow)
- Google Maps buttons with gradient styling
- FAQ accordion with smooth expand/collapse
- Gallery lightbox with keyboard navigation
- Responsive navigation buttons

## 📝 Customization Guide

### Update Wedding Details

1. **Date & Time:**
   ```html
   <p>Saturday, April 18, 2026</p>
   <p>Ceremony: [Your Time]</p>
   ```

2. **Venue Addresses:**
   ```html
   <p class="venue-name">[Your Venue Name]</p>
   <p class="venue-address">[Your Full Address]</p>
   ```

3. **Google Maps Coordinates:**
   ```html
   <a href="https://www.google.com/maps?q=[LATITUDE],[LONGITUDE]">
   ```
   Replace with your actual venue coordinates

4. **Dress Code Colors:**
   Modify the color circles in CSS:
   ```html
   <div class="color-circle" style="background-color: #YOUR_COLOR;"></div>
   ```

### Update Content

- **Our Story:** Replace placeholder text with your actual love story
- **FAQ Answers:** Customize all FAQ responses to match your wedding details
- **Gallery Images:** Replace sample images with your own photos in `/assets` folder

---

## 🚀 Setup & Deployment

### Local Development
1. Clone the repository
2. Go to docs and open `index.html` in a web browser or you can also run this in visual studio.(files in docs folder is copy of wwwroot/assets and View/Home/Index.cshtml)
3. No build process required - pure HTML/CSS/JS

### File Structure
```
weddingsite/
├── docs
│   ├── assets/
│   │   ├── css/
│   │   └── js/
│   │   └── sass/
│   │   └── webfonts/
│   │   └──index.html
├── wwwroot
│   ├── assets/
│   │   ├── css/
│   │   └── js/
│   │   └── sass/
│   │   └── webfonts/
├── View
│   ├── Home/
│   │   ├── Index.cshtml/
└── README.md
```

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🎨 Design Philosophy

- **Elegance:** Clean, sophisticated design with romantic elements
- **Simplicity:** Easy navigation and clear information hierarchy
- **Responsiveness:** Beautiful experience on all devices
- **Performance:** Optimized images and smooth animations
- **Accessibility:** Semantic HTML and keyboard navigation support

---

## 📱 Responsive Design

- **Desktop:** Full layout with 3-4 column gallery grid
- **Tablet:** 2 column gallery grid, optimized spacing
- **Mobile:** Single column layout, full-width buttons, touch-friendly interactions

---

## 🔧 Maintenance Notes

### Known Limitations
- No localStorage/sessionStorage (not supported in artifact environment)
- All state management uses in-memory JavaScript variables
- Images should be optimized for web before upload

### Future Enhancements (Optional)
- [ ] Add RSVP form with backend integration
- [ ] Integrate with wedding registry APIs
- [ ] Add countdown timer to wedding date
- [ ] Implement guest photo upload feature
- [ ] Add music player for ceremony songs
- [ ] Create admin panel for managing RSVPs

---

## 👥 Credits

**Couple:** Dominic & Karla  
**Wedding Date:** April 18, 2026  
**Design:** Custom elegant wedding theme  
**Development:** Built with love and attention to detail

---

## 📄 License

This is a personal wedding website. All rights reserved.

---

## 💝 Special Thanks

To all our family and friends who will join us on our special day. Your love and support mean the world to us!

---

**"JOIN US AS WE SAY 'I DO'"**  
*April 18, 2026*