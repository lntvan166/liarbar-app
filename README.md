# Liar's Bar Web Support

A web-based tool to support the Liar's Bar game mode from the Steam title "Liar's Bar". This offline-capable application provides a virtual "revolver" UI, card management, and game logic to play Liar's Deck, including Russian Roulette, with immersive sound and visual effects.

## Table of Contents

- [Features](#features)
- [Game Rules](#game-rules)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Current Configuration](#current-configuration)
- [License](#license)

## Features

- Full implementation of Liar's Deck rules (Basic, Devil, Chaos, Liar's Deck 2 variants)
- Virtual revolver with shot animations, sound effects, and blood splatter on lethal shots
- Offline gameplay—no external servers required once loaded
- Responsive React UI with intuitive controls and mobile support
- Extendable architecture for future enhancements and variants

## Game Rules

This project implements the rules as described in "How to Play Liar's Deck (From Liar's Bar)" by Guillaume Fortin-Debigaré:
https://www.debigare.com/how-to-play-liars-deck-from-liars-bar-full-rules-and-variants/

## Demo

Check out a live demo and reference implementation at:
https://fun.essaalfan.com/liars-bar-russian-roulette/

## Tech Stack

- React 18 + TypeScript
- Vite for fast builds and development server
- Tailwind CSS for styling
- Howler.js for sound effects
- Framer Motion for animations

## Getting Started

### Prerequisites

- Node.js >= 16.x
- npm or yarn

### Installation

```bash
git clone https://github.com/yourusername/liars-bar-web-support.git
cd liars-bar-web-support
npm install
```

### Running Locally

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Project Structure

```
liars-bar-web-support/
├── public/                # Static assets (sounds, images)
├── src/
│   ├── components/        # Reusable React components
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Page views and routes
│   ├── utils/             # Helpers and game logic
│   ├── App.tsx
│   └── main.tsx
├── tests/                 # Unit and integration tests
├── README.md
├── package.json
└── vite.config.ts
```

## Contributing

Contributions are welcome! As a backend engineer, your focus can be on game logic, API mocks, and integration, while frontend engineers can handle UI/UX design and component implementation.

1. Fork the repository (`git clone https://github.com/yourusername/liars-bar-web-support.git`)
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request and request a review

Please ensure code is well-documented, follows the existing style, and includes tests where applicable.

## Current Configuration

To refine implementation details, here are the chosen defaults:

- Supported variant: Basic (initial)
- Art assets & UI guidelines: placeholder assets; custom designs will be provided
- Deployment & CI/CD: Vercel planned; configuration will be added later
- Design focus: mobile-first responsive layout

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more details.
