# Project Summary
The project is a web application that facilitates the creation and management of smartlinks, enhancing digital marketing strategies. Users can personalize links with visuals and text, track performance through Google Tag Manager (GTM) and Google Analytics 4 (GA4), and utilize a "Magic Link Generator" that integrates with the Odesli API to create links for various music platforms from a single input. Built with React, TypeScript, and Tailwind CSS, the application provides a user-friendly interface for managing digital marketing links and offers advanced analytics to improve user engagement.

# Project Module Description
- **Dashboard**: Central interface for managing and analyzing all smartlinks.
- **Create Smartlink**: Form to create new smartlinks with customization options.
- **Edit Smartlink**: Interface for updating existing smartlinks.
- **Smartlink Page**: Display page for individual smartlinks with tracking capabilities; now includes improved platform icon display.
- **Analytics Configuration**: Setup for GTM and GA4 for each smartlink.
- **Image Upload**: Functionality for uploading visuals for smartlinks.
- **Smartlink Card**: Displays information and actions related to a smartlink.
- **Platform Analytics**: Insights into click performance across platforms.
- **Magic Link Generator**: Generates links for multiple platforms using the Odesli API, now with CORS proxy support.
- **Platform Icons**: Displays real logos for music platforms instead of emojis.
- **Background Visual Enhancements**: Recent updates include a blurred background image on the Smartlink page and a footer text change.

# Directory Tree
```
shadcn-ui/
├── README.md                       # Project documentation
├── components.json                 # Component definitions
├── eslint.config.js                # ESLint configuration
├── index.html                      # Main HTML file
├── package.json                    # Project dependencies and scripts
├── postcss.config.js               # PostCSS configuration
├── public/                         # Static assets
│   ├── favicon.svg                 # Favicon for the app
│   ├── robots.txt                  # Robots.txt for SEO
│   └── assets/                     # Contains static assets like images
│       └── background-sample.png    # Sample background image for Smartlink page
├── src/                            # Source code
│   ├── App.css                     # Global styles
│   ├── App.tsx                     # Main application component
│   ├── components/                 # Reusable UI components
│   ├── hooks/                      # Custom hooks
│   ├── lib/                        # Utility functions
│   ├── pages/                      # Page components
│   ├── types/                      # Type definitions
│   ├── vite-env.d.ts               # Vite environment definitions
│   ├── index.css                   # Entry CSS file
│   └── main.tsx                    # Entry point for React
├── tailwind.config.ts              # Tailwind CSS configuration
├── template_config.json            # Template configuration
├── tsconfig.app.json               # TypeScript configuration for app
├── tsconfig.json                   # Base TypeScript configuration
├── tsconfig.node.json              # TypeScript configuration for Node
└── vite.config.ts                  # Vite configuration
```

# File Description Inventory
- **README.md**: Overview of the project, setup instructions, and usage.
- **package.json**: Lists project dependencies and scripts for building and running the application.
- **src/App.tsx**: Main component that sets up routing and application layout.
- **src/pages/**: Contains individual page components for the smartlink application.
- **src/components/**: Reusable UI components like SmartlinkCard, MagicLinkGenerator, and PlatformIcons.
- **src/lib/**: Utility functions including the Odesli API service with CORS proxy integration.
- **src/types/**: TypeScript type definitions for smartlink data structures.

# Technology Stack
- **React**: Frontend library for building user interfaces.
- **TypeScript**: Superset of JavaScript that adds static typing.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Vite**: Build tool for frontend projects.
- **pnpm**: Package manager for managing dependencies.
- **@iconify/react**: Library for rendering platform icons.

# Usage
1. Install dependencies:
   ```
   pnpm install
   ```
2. Run linting:
   ```
   pnpm run lint
   ```
3. Build the application and start the development server.
