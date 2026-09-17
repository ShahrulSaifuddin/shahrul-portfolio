# ORIGINAL USER BRIEF — verbatim, unedited

This is the user's own request, preserved word-for-word so that verification can be graded against
what was actually asked rather than against the foreman's interpretation of it. Nothing here has
been softened, narrowed, or "clarified."

---

# Claude Code Prompt: Build Professional Portfolio for Shahrul Saifuddin

## Project Overview
Build a high-performance, production-grade professional portfolio website for **Shahrul Saifuddin**, a full-stack engineer with 5+ years of experience shipping mobile and web systems. The portfolio must showcase expertise across React Native, Laravel, Node.js, and modern web technologies with a focus on performance optimization and accessibility.

## Tech Stack & Requirements
- **Framework**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS with dark mode support
- **UI Components**: shadcn/ui + Radix UI for accessibility
- **Animation**: Framer Motion for smooth transitions
- **Database**: PostgreSQL or MongoDB (optional for analytics)
- **Deployment**: Vercel or self-hosted (consider CloudPanel/Nginx like Shahrul's projects)
- **Package Manager**: pnpm or npm

## Design & Skills to Apply
1. **emilkowalski/skills** - Apply interaction patterns and micro-interactions
2. **impeccable** - Follow code quality standards and linting
3. **taste skill** - Ensure visual hierarchy, spacing, typography consistency
4. **web-design-guidelines** - Follow best practices for user experience
5. **awesome-design-skills** - Modern, minimalist, professional aesthetic
6. **image-to-code-skill** - Convert profile picture and project visuals to responsive layouts
7. **playwright-cli** - Set up E2E testing for critical user flows
8. **fable-foreman** - Orchestrate the build with cost-effective Claude models for code generation

## Core Pages & Content Structure

### 1. Hero Section
- Full-width hero with animated gradient background
- Tagline: "Full-Stack Engineer · React Native · Laravel · Node.js"
- Call-to-action buttons: "View Projects" | "Download Resume" | "Get in Touch"
- Animated profile picture (Shahrul to provide later)
- Smooth scroll indicator

### 2. About Section
- Professional summary from resume
- Key highlights: 5+ years experience, 2 App Store/Google Play products shipped
- Tech stack overview (organized by category: Mobile, Web, Backend, Integrations, DevOps)
- Timeline or visual representation of career progression

### 3. Featured Projects Section
Showcase 4 main projects with case studies: FastEV (EV charging network, karunaventure.co/platforms/fastev,
450+ commits, 42 screens, 5 Redux slices, 90 API routes, OCPP 1.6/2.0, 4 payment/fiscal integrations,
3x push-notification latency reduction, Android 16 KB page-size migration); SD Engage (event ticketing,
15-developer platform, Stripe PaymentIntents, S-Pay Global, QR check-in, 1:1 messaging, 413 commits,
~26 of 38 mobile API controllers); Karuna Growth Suite (karunaventure.co, Lighthouse 100 A11y / 100 BP /
100 SEO / 90+ Perf, headless WordPress WPGraphQL + React 19/Vite, 35 routes prerendered, sole developer);
CTApps Digital (ctappsdigital.com, 8-product catalogue, gated lead capture, LLM product assistant,
full auth — email, Google OAuth, OTP — responsive images, sole developer).

### 4. Technical Skills Section
Organized by category with proficiency indicators: Mobile Development; Web Development; Backend & APIs;
Database & Data; Integrations & Protocols; DevOps & Infrastructure.

### 5. Performance Optimizations Section
Implement and document the following optimizations with interactive demos:
API Response Caching; Load Balancer; Database Indexing; Image Compression; Loading Skeletons;
Cache Expensive Queries; Fix N+1 Database Queries; Debounce Input Handlers; Code Splitting;
CDN Integration; Server-Side Caching; Paginate Large Lists; Lighthouse Audit; API Payload Compression;
Reduce Unnecessary Re-Renders; Minify JS & CSS; Lazy Load Images; Defer Non-Critical Scripts;
Remove Unused Dependencies.
Create an interactive "Performance Checklist" page showing real metrics.

### 6. Experience Timeline Section
Karuna Sarawak Enterprise (Aug 2024 – Present); Thunder Software (M) Sdn Bhd (Jul 2022 – Jul 2024);
Skymind CNS Sdn Bhd (Sep 2021 – May 2022).

### 7. Education & Certifications Section
B.Eng (Hons) Electrical & Electronic Engineering - UTM (CGPA 3.70/4.00); Certified Engineer in
Computer Vision (Skymind); Full Stack Web Development Bootcamp.

### 8. Contact & CTA Section
Contact form (with validation, email integration via nodemailer/SendGrid); social links: GitHub
(github.com/ShahrulSaifuddin), Email, Phone; call-to-action for hiring/collaboration.

### 9. Blog/Insights Section (Optional)

## Responsive Design Requirements
Mobile-first (320px, 640px); tablet (768px, 1024px); desktop+ (1440px, 1920px); touch-friendly targets
(min 48x48px); accessible navigation patterns; reduced motion support.

## Accessibility Requirements (WCAG 2.1 AA)
Semantic HTML; ARIA labels/roles; contrast >= 4.5:1 text and >= 3:1 graphics; keyboard navigation;
screen reader friendly; visible focus indicators; alt text; proper heading hierarchy (h1 > h2 > h3).

## SEO Requirements
Meta tags (title, description, og:image, twitter:card); structured data (JSON-LD Person schema);
sitemap.xml; robots.txt; Open Graph tags; mobile-friendly viewport.

## Additional Features
1. Dark Mode Toggle (localStorage persisted)  2. Smooth Scroll  3. Scroll Progress Indicator
4. Mobile Menu (Framer Motion)  5. Back-to-Top Button  6. Email Validation  7. Project Filtering
8. Search Functionality  9. Newsletter Signup (Optional)  10. Analytics (privacy-first, no Google Analytics)

## Deployment & DevOps
Vercel, or self-hosted CloudPanel/Nginx/PM2, or AWS/DigitalOcean; GitHub Actions CI/CD;
.env.local for secrets; optional database.

## Code Quality & Best Practices
ESLint with Next.js config; Prettier; TypeScript strict mode; Playwright E2E for critical flows
(contact form, project navigation); Lighthouse CI; React Testing Library (optional).

## Profile Picture Requirements
JPG/PNG, 500x500px minimum; hero center-top and about sidebar; circular crop with subtle shadow,
optional border; compress to <100KB, convert to WebP/AVIF.

## Testing Checklist Before Deployment
- [ ] Lighthouse score 90+ (all metrics)
- [ ] Mobile responsiveness (iOS Safari, Chrome Android)
- [ ] Dark mode toggle works
- [ ] Contact form submission works
- [ ] All external links (App Store, Google Play, project URLs) are functional
- [ ] Images load correctly and are compressed
- [ ] Keyboard navigation works
- [ ] Screen reader compatible (axe DevTools audit)
- [ ] Performance profile under 3s FCP, 1.5s LCP
- [ ] Bundle size < 200KB (gzipped)
- [ ] E2E tests pass (Playwright)
- [ ] Meta tags are correct (Open Graph preview check)

## Success Metrics
1. Performance: Lighthouse score 95+, LCP < 1.5s, CLS < 0.1
2. User Engagement  3. SEO  4. Accessibility: WCAG 2.1 AA  5. Conversion

## Additional Notes
- Keep the design clean, professional, and modern (avoid over-engineering)
- Prioritize fast load times and accessibility (core to Shahrul's brand)
- Showcase real project metrics and achievements (not placeholder content)
- Implement gradual adoption of features (MVP -> polish -> extras)
- Profile picture will be provided separately - create placeholder/template for it

---

**Closing instruction from the user:**

> use fable-foreman, delegate the implementation work to sonnet/haiku workers, keep yourself on
> review and verification." Multi-file, multi-stage work is exactly what triggers the crew.
