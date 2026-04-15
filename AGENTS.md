<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Tech Stack
- TypeScript only — no plain `.js` files in `app/`
- Tailwind CSS for all styling
- Use pnpm as the package manager
## File Structure
- Components go in `app/components/`
- Utility/helper functions go in `lib/`
- API routes go in `app/api/`
## Coding Style
- No `any` types in TypeScript
- Always handle errors with try/catch in async functions
- Use named exports
## Do NOT
- Do not modify `pnpm-lock.yaml` manually
- Do not install packages without explaining why
- Do not remove existing comments or documentation
<!-- END:nextjs-agent-rules -->
