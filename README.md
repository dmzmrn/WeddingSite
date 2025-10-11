# 💍 Wedding Website

A simple, elegant **wedding website** built to share our special day with family and friends.  
The project features a **static front-end** built from an HTML5UP template and a **C# backend** to manage guest interactions such as RSVP submissions.

---

## 🏠 Table of Contents
1. [Introduction](#introduction)  
2. [Features](#features)  
3. [Tech Stack](#tech-stack)  
4. [Installation](#installation)  
5. [Configuration](#configuration)  
6. [Usage](#usage)  
7. [File Structure](#file-structure)  
8. [Deployment](#deployment)  
9. [Credits](#credits)  
10. [License](#license)

---

## 💌 Introduction

This website serves as our digital invitation — allowing guests to view wedding details, venue information, and RSVP online.  
It combines a **responsive static site** design with a lightweight **C# backend** for data handling.

---

## ✨ Features

- 📅 Event details and schedule  
- 📍 Venue information with map integration  
- 💑 Couple introduction and photo gallery  
- 📨 RSVP form powered by C# backend  
- 📱 Mobile-friendly responsive design  
- 💾 Lightweight and easily customizable  

---

## 🧰 Tech Stack

**Frontend:**  
- HTML5, CSS3, JavaScript  
- [HTML5 UP Template](https://html5up.net/)  

**Backend:**  
- C# (ASP.NET or .NET Core)  
- Optional: SQLite / JSON file for data storage  

---

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/wedding-website.git
   cd wedding-website
   ```

2. **Open the project**
   - Open the solution file (`.sln`) in **Visual Studio** or **VS Code**.  

3. **Run the backend**
   ```bash
   dotnet run
   ```

4. **Open in browser**
   Visit `http://localhost:5000` (or the port shown in your terminal).

---

## 🔧 Configuration

- Update your **wedding details** (names, date, venue, etc.) inside the main `index.html`.  
- Configure backend settings (e.g., email or storage options) in `appsettings.json`.  
- Replace placeholder images and text in `/assets/img` and `/content`.  

---

## 🚀 Usage

- **Development mode:** Edit HTML/CSS and C# files directly, then refresh your browser.  
- **Production build:** Publish using Visual Studio or `dotnet publish`.  
- Deploy to your preferred hosting provider (Azure, Netlify, or GitHub Pages for static parts).

---

## 📁 File Structure

```
wedding-website/
├── wwwroot/
│   ├── assets/
│   ├── css/
│   ├── js/
│   └── index.html
├── Controllers/
│   └── RsvpController.cs
├── Models/
│   └── Guest.cs
├── appsettings.json
├── Program.cs
├── Startup.cs
└── README.md
```

---

## 💖 Credits

- **Template:** [HTML5 UP](https://html5up.net/) — beautiful, free, and fully responsive templates.  
- **Backend:** Custom C# logic by *[Your Name]*  
- **Inspiration & Support:** Our amazing family and friends 💕

---

## 🪪 License

This project is for **personal use**.  
Template © [HTML5 UP](https://html5up.net/) — used under [Creative Commons Attribution 3.0 License](https://html5up.net/license).  
You may freely modify and host your version for personal wedding use.
