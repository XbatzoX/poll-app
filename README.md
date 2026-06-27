# 📊 PollApp – Modern Dynamic Survey Tool built with Angular

A high-performance, real-time web application designed for creating, managing, and participating in dynamic surveys. This project showcases a robust frontend implementation powered by **Angular (v18+)** integrated with **Supabase** as a cloud database backend. 

The core architecture completely bypasses traditional enterprise patterns in favor of Angular's latest reactive primitives, ensuring lightning-fast performance and seamless state synchronization.

---

## 🎯 Core Framework Focus: Why Angular?

This application is built from the ground up to leverage the full power of the modern **Angular** ecosystem. Rather than relying on heavy third-party libraries or outdated architecture, the project serves as a showcase for high-performance frontend engineering using Angular's native tools:

### 1. Next-Gen Reactive Architecture (Angular Signals)
* **Zoneless Readiness**: Traditional change detection was skipped entirely. The application architecture is built exclusively around **Angular Signals** (`signal`, `computed`), preparing the application for future zoneless rendering.
* **Declarative Side-Effects**: Leveraged `computed()` signals to handle complex, derived state synchronously before the DOM renders. This guarantees an absolute crash-free user experience during asynchronous operations.
* **Precise DOM Re-rendering**: Solved severe UI synchronization bugs within dynamic arrays by mapping the native modern `@for` loop to direct memory object tracking (`track item`) instead of simple index tracking.

### 2. High-Performance HTML Template Engine (Modern Control Flow)
* Replaced legacy structural directives (`*ngIf`, `*ngFor`) with Angular’s new, built-in **Control Flow blocks** (`@if`, `@for`, `@empty`, `@switch`).
* This optimization significantly reduces JavaScript overhead in the compiled bundle and enables precise, local DOM modifications.
* Utilized the elegant `@empty` placeholder syntax to handle asynchronous loading delays and empty database filter categories natively without extra boolean variables.

### 3. Enterprise Component & Style Encapsulation
* Applied strict Angular **Scoped Component Styling** using the architectural `:host` selector paired with `display: block` to turn custom Angular tags into stable layout containers.
* Decoupled framework logic from presentation by enforcing strict data-binding mechanisms (`[disabled]`, `[class.selected]`, and `(click)` event handlers) natively managed by Angular’s framework core.

---

## 🛠️ Technical Highlights & Implementation Details

Beyond the Angular framework core, the following advanced software engineering practices were implemented to bridge the frontend with the database layer:

### ⚡ Robust Asynchronous Data Pipeline (Supabase Integration)
* Designed a relational data schema linking multiple dynamic questions to a single survey via an auto-generated, strictly typed `survey_id`.
* **Sequential Promise Chaining (`.then()`)**: Mastered asynchronous race conditions by locking UI routing actions inside database confirmation blocks. The app securely fetches the freshly generated server IDs before spawning dependent relational tables.
* **F5-Refresh Resilience**: Implemented a localized state fallback caching mechanism via `localStorage` combined with precise Javascript date sanitization (`.setHours(0,0,0,0)`) to maintain state integrity across hard browser refreshes.

### 🎨 Modular SCSS (7-to-1 Architecture)
* Structured the global application styles according to the clean **7-to-1 Architecture Pattern** (segregating `abstracts/`, `base/`, and `components/`).
* Created a highly reusable responsive environment by passing layout variable maps into a centralized, custom SCSS framework mixin (`@mixin respond-to()`).
* Developed a pixel-perfect dashboard card grid utilizing calculated heights (`calc()`), automatic row limits (`grid-auto-rows`), and layout preservation barriers (`scrollbar-gutter: stable`).

### ♿ Accessible Web Semantics
* Eradicated traditional "div soup" structures. 
* Refactored layout segments into semantic HTML5 tags (`<main>`, `<section>`, `<article>`, `<nav>`, `<time>`) to maximize SEO readability and ensure full compatibility with screen-reader accessibility trees.

---

## 📦 Getting Started & Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com
   cd poll-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

 Open your browser and navigate to `http://localhost:4200/`.

---

## 🗄️ Database Architecture Preview (Supabase)

* **`surveys` table**: `id` (PK, auto-generated number), `name`, `description`, `category`, `end_date`, `created_at`.
* **`questions` table**: `id` (PK), `survey_id` (FK -> surveys.id), `question_number`, `question`, `answer1` to `answer6`, `counter1` to `counter6`, `is_multiple`.

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
