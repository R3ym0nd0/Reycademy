# Reycademy v0.4.0

Welcome to version 0.4.0 of my Reycademy!  
Reycademy is a free cybersecurity learning site made for Filipinos. It offers Tagalog video lessons and hands-on training, designed to help beginners understand cybersecurity.

### Live Site: [reycademy.netlify.app](https://reycademy.netlify.app/)
---

## Screenshots

### DESKTOP

<img width="1263" height="517" alt="Desktop_Reycademy" src="https://github.com/user-attachments/assets/58f14e65-4ce1-4d3a-b077-0bda502a1baf" />

### TABLET

<img width="763" height="769" alt="Tablet_Reycademy" src="https://github.com/user-attachments/assets/93c2a6f1-9265-4dca-be39-db8116b43218" />

### MOBILE

<img width="370" height="662" alt="Mobile_Reycademy" src="https://github.com/user-attachments/assets/16095bfa-807c-4926-ba67-dd0ba4426aa8" />

---

## What's New

- Reycademy is now a full-stack
- Added security headers and rate limiting to improve security
- First login tracking popup implemented(no design)
- Login/Logout is now working
- added sidebar after login
- Hero section redesigned, colors tweaked
- Videos section background color updated

---

## Built With

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Express.js](https://img.shields.io/badge/Express.js-339933?style=for-the-badge&logo=express&logoColor=000000)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

## Reycademy Security

![Security Headers](https://img.shields.io/badge/Security%20Headers-A%2B-00FF00?style=for-the-badge)

The Reycademy **backend is secured with best practices**:
- Implemented **helmet(customized)** with CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permission-Policy, CORP, COOP, COEP
- Custom **Cache-Control** per page (depends of the page if sensitive)
- **Secure Cookies**: HttpOnly, Secure; SameSite=None (required for separate frontend origin)
- Secure **CORS** configuration (frontend and backend origins separated)
- Implemented **Rate Limiting** to prevent brute force attacks
- Rated **A+ on [securityheaders.com](https://securityheaders.com)**

> Note: While Reycademy implements security best practices, no system is 100% secure. If you find any vulnerabilities, please report it responsibly by contacting me, thank you!
---

## Limitations

- No actual video, quiz, challenges yet
- Some of navigation sections are placeholders
- Certain features are still under development

---

## Why I'm Building This

I'm building this because I saw that there are not many Tagalog cybersecurity lessons here in the Philippines. Most topics here are about web development or programming only. So I made Reycademy to help my fellow Filipinos who also want to learn cybersecurity in a simple and free way.

At the same time, this site also serves as my personal lab for studying **web security**, practicing **OWASP Top 10** vulnerabilities, and testing secure backend configurations in a controlled and legal environment.  

---

Thanks for checking it out!
