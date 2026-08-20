# LifeProof - Unified Web Platform

LifeProof is a single, unified web application designed for secure digital proof verification and identity management.

## 📁 Project Directory Structure

```text
LifeProof/
│
├── index.html                  # Main landing / starter homepage
├── login.html                  # Authentication portal (Sign In & Sign Up)
│
├── pages/                      # Application views & role portals
│   ├── dashboard-user.html     # User personal proof dashboard
│   ├── dashboard-partner.html  # Partner & enterprise dashboard
│   ├── dashboard-admin.html    # Admin management portal
│   └── about.html              # About LifeProof page
│
├── css/                        # Modular stylesheet system
│   ├── variables.css           # Design tokens, color palette, gradients & themes
│   ├── style.css               # Core layout, global styles, components, responsive grid
│   └── auth.css                # Authentication page & form component styles
│
├── js/                         # Modular JavaScript scripts
│   ├── config.js               # Global configuration, routes, and role mappings
│   ├── main.js                 # Global UI interactions (nav toggle, header scroll, animations)
│   └── auth.js                 # Authentication UI logic & tab controller
│
├── components/                 # Reusable HTML component templates
│   ├── navbar.html             # Navigation bar component reference
│   └── footer.html             # Footer component reference
│
├── assets/                     # Media & graphic assets
│   ├── images/                 # Photo and banner assets
│   ├── icons/                  # SVG and icon assets
│   └── logo/                   # Vector logo files (logo.svg)
│
├── firebase/                   # Firebase configuration & security files
│   ├── firebase-config.js      # Firebase SDK initialization boilerplate (Auth, Firestore)
│   ├── firestore.rules         # Security rules for Users, Partners, and Admins
│   └── README.md               # Firebase setup guidelines
│
└── README.md                   # Project overview and documentation
```

---

## 🚀 Key Design & Architecture Highlights

1. **Single Unified Codebase**: All views, styles, and assets reside in one unified workspace.
2. **Rich Dark Aesthetics**: Curated color palette (Deep Slate, Indigo `#6366f1`, Cyan `#06b6d4`), glassmorphism, responsive typography (`Outfit` and `Plus Jakarta Sans`), and subtle micro-interactions.
3. **Modular & Scalable**:
   - Clean separation of CSS variables, base styles, and view-specific styles.
   - Modular JavaScript logic with frozen configurations.
   - Component templates for reusable UI elements.
4. **Ready for Future Integrations**:
   - **Firebase Authentication & Google Sign-In**: UI structures in `login.html` and hooks in `firebase/firebase-config.js`.
   - **Cloud Firestore**: Rules schema defined in `firebase/firestore.rules`.
   - **3 Dedicated Dashboards**: User (`dashboard-user.html`), Partner (`dashboard-partner.html`), and Admin (`dashboard-admin.html`).
