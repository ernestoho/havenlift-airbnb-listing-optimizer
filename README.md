# HavenLift — Airbnb Listing Optimizer

HavenLift is a single-page SaaS landing page with an interactive demo for an AI-powered Airbnb listing optimizer. It helps property hosts optimize their listings by accepting an Airbnb URL and generating a mock optimization report, including before/after metrics, AI-generated recommendations for titles, summaries, pricing, and visual improvements. Built with a focus on visual excellence and user delight, the application features a polished marketing interface inspired by Stripe, Linear, and Airbnb.

[cloudflarebutton]

## Key Features

- **Stunning Landing Page**: A responsive single-page layout with 7 sections (Hero, Social Proof, Features Grid, How It Works, Results Showcase, Trust & Security, Final CTA) plus footer, using modern typography, gradients, and micro-interactions.
- **Interactive Demo**: Paste an Airbnb listing URL to trigger a client-side mock optimization pipeline, displaying loading states, before/after metrics (occupancy, ADR, bookings, revenue), prioritized suggestions, and a Recharts visualization.
- **Visual Excellence**: Clean minimalism with bold headings, warm accents (#4F46E5, #F97316, #06B6D4), generous spacing, hover effects, and Framer Motion animations for smooth interactions.
- **Responsive Design**: Mobile-first approach with flawless layouts across devices, using Tailwind CSS and shadcn/ui components.
- **Mock-Driven Pipeline**: Deterministic client-side simulation of AI audits, pricing analysis, and SEO recommendations—no backend required for the demo.
- **Production-Ready**: Error handling, accessibility (ARIA labels, focus states), and performance optimizations for immediate deployment.

## Technology Stack

- **Frontend**: React 18, React Router, Tailwind CSS v3, shadcn/ui (primitives for buttons, cards, inputs, sheets, etc.), Lucide React (icons)
- **Animations & Interactions**: Framer Motion (micro-interactions, fade-ins), React Intersection Observer (scroll-triggered animations)
- **Charts & Data**: Recharts (line charts for metrics), Zod (URL validation), date-fns (formatting)
- **State Management**: Zustand (lightweight global state, e.g., for toasts and reports)
- **UI Utilities**: clsx, tailwind-merge, Sonner (toasts for feedback)
- **Backend/Deployment**: Cloudflare Workers (edge serving), Hono (routing), Vite (build tool)
- **Development Tools**: TypeScript, ESLint, Bun (package manager), Wrangler (Cloudflare CLI)

The project follows best practices for maintainability, with a component-based architecture and strict adherence to accessibility standards (WCAG contrast ratios, keyboard navigation).

## Quick Start

To get started immediately, deploy to Cloudflare Workers with one click:

[cloudflarebutton]

## Installation

This project uses Bun as the package manager for faster performance. Ensure Bun is installed on your system ([installation guide](https://bun.sh/docs/installation)).

1. Clone the repository:
   ```
   git clone <your-repo-url>
   cd havenlift
   ```

2. Install dependencies:
   ```
   bun install
   ```

3. Run the development server:
   ```
   bun run dev
   ```
   The app will be available at `http://localhost:3000` (or the port specified in your environment).

## Development

### Running Locally

- **Development Mode**: Use `bun run dev` to start the Vite dev server with hot reloading. Changes to React components or styles will update in real-time.
- **Linting**: Run `bun run lint` to check code quality. Fix issues automatically where possible.
- **Type Checking**: TypeScript is configured strictly; use your IDE's built-in checker or `tsc --noEmit` for manual verification.
- **Testing the Demo**: Navigate to the hero section, paste a sample Airbnb URL (e.g., `https://www.airbnb.com/rooms/123`), and click "Optimizar" to see the mock report.

### Project Structure

- `src/pages/HomePage.tsx`: Main landing page implementation with all sections and demo logic.
- `src/components/ui/*`: shadcn/ui primitives (do not modify; compose with Tailwind).
- `src/components/layout/AppLayout.tsx`: Responsive wrapper with sidebar (optional for admin views).
- `worker/userRoutes.ts`: Add custom API routes here (e.g., for future backend integration).
- `src/lib/utils.ts`: Utility functions like `cn()` for class merging.

### Customization

- **Colors & Themes**: Edit `tailwind.config.js` for custom palettes (primary: #4F46E5, accent: #F97316).
- **Mock Data**: Modify the optimization pipeline in `HomePage.tsx` (search for `mockPipeline`) to adjust metrics or add real API calls.
- **Adding Features**: Extend the demo with Zustand stores for persistent reports or integrate with `/api/optimize` endpoint in future phases.

### Common Commands

- Build for production: `bun run build`
- Preview production build: `bun run preview`
- Generate Cloudflare types: `bun run cf-typegen`
- Deploy: `bun run deploy` (requires Cloudflare login via `wrangler auth login`)

## Usage

### User Flow

1. **Landing**: Users arrive at the hero section with an input for Airbnb URLs.
2. **Optimization Demo**:
   - Enter a valid URL (validated with Zod).
   - Click "Optimizar" to simulate the audit (2-2.5s delay with skeleton loaders).
   - View the results panel: Metrics comparison, suggestions (e.g., "Improve title for +15% bookings"), and a trend chart.
3. **Navigation**: Scroll through sections for features, testimonials, and trust signals. Repeat the demo or proceed to the final CTA.
4. **Feedback**: Toasts (via Sonner) provide success/error messages; all interactions include hover/focus states.

### Example: Mock Optimization Report

The demo generates deterministic data based on URL hash:
- **Before**: Occupancy 65%, ADR $120, Monthly Bookings 20.
- **After**: Occupancy 82% (+26%), ADR $138 (+15%), Monthly Bookings 28 (+40%).
- **Suggestions**: AI title rewrite, photo enhancements, dynamic pricing tips.
- **Chart**: Line series showing booking trends over 6 months.

For production, replace the mock with a POST to Cloudflare Worker endpoint `/api/optimize`.

## Deployment

Deploy to Cloudflare Workers for global edge delivery (free tier available). The project is pre-configured with Wrangler.

### Prerequisites

- Install Wrangler CLI: `bun add -g wrangler`
- Authenticate: `wrangler auth login`

### Steps

1. Build the project: `bun run build`
2. Deploy: `bun run deploy`
   - This uploads assets to Cloudflare Pages and deploys the Worker.
   - Environment variables (if any) are set via `wrangler secret put <KEY>`.

3. Custom Domain (Optional): Update `wrangler.toml` or dashboard for your domain.

For one-click deployment from this repo:

[cloudflarebutton]

### Production Notes

- **Assets**: Static files (JS/CSS) are served from Cloudflare's edge cache.
- **API Routes**: Handled by the Worker at `/api/*` (e.g., `/api/test` for health checks).
- **Monitoring**: Enable Cloudflare Observability in `wrangler.jsonc` for logs and metrics.
- **CI/CD**: Integrate with GitHub Actions using Wrangler actions for automated deploys.

## Contributing

Contributions are welcome! Please:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

Adhere to the code style (ESLint) and ensure no breaking changes to the demo flow.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues, open a GitHub issue. For commercial use or custom integrations, contact the development team. Built with ❤️ at Cloudflare.