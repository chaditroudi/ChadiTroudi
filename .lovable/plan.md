

# Plan: Hero Enhancement, Typewriter Effect, Resume PDF Download, and Favicon Update

## 4 Changes

### 1. Enhanced Hero Section with Typewriter Effect
**File: `src/components/portfolio/HeroSection.tsx`**

- Replace the static "Full-Stack Engineer" subtitle with a **typewriter animation** that cycles through roles: "Full-Stack Developer", "Java & Spring Boot Expert", "React Specialist", "API Architect"
- Build a small `useTypewriter` hook using `useState`/`useEffect` with character-by-character typing and deleting animation
- Replace the current description paragraph ("Building retail tech at Bonial...") with the professional summary:
  > "Full-Stack Developer specializing in scalable web applications using Java (Spring Boot), React, and microservices. Experienced in building secure RESTful APIs, optimizing performance, and delivering reliable enterprise solutions in Agile environments. Focused on clean architecture and maintainable code."
- Update the page title tag from "Full-Stack Engineer" to "Full-Stack Developer"

### 2. Resume PDF Download
**Copy file:** `user-uploads://ChadiTroudiCv_1.pdf` → `public/ChadiTroudiCv.pdf`

**File: `src/components/portfolio/Navbar.tsx`**
- Update the Resume button `href` from `/resume.pdf` to `/ChadiTroudiCv.pdf` with `download` attribute so it triggers a direct PDF download

### 3. Replace Favicon with Profile Picture
**Copy file:** `src/assets/profile.jpg` → `public/favicon.jpg`

**File: `index.html`**
- Add `<link rel="icon" href="/favicon.jpg" type="image/jpeg">`
- Update `<title>` to "Chadi Troudi | Full-Stack Developer"
- Update meta tags (og:title, description, author) to reflect the portfolio

### 4. Update Meta Tags
**File: `index.html`**
- Title: "Chadi Troudi | Full-Stack Developer"
- Description: "Full-Stack Developer specializing in scalable web applications using Java, Spring Boot, React, and microservices."
- Remove Lovable branding from meta tags

