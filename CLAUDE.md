<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan:
specs/001-phase1-launch/plan.md

Key artifacts:
- Spec: specs/001-phase1-launch/spec.md
- Data model: specs/001-phase1-launch/data-model.md
- API contracts: specs/001-phase1-launch/contracts/api.md
- Quickstart: specs/001-phase1-launch/quickstart.md
- Research: specs/001-phase1-launch/research.md
<!-- SPECKIT END -->

## Project Structure

The Next.js app now lives at the **repo root** (not inside `shadboard/full-kit/`).

- Run dev server: `pnpm dev` (from repo root)
- App entry: `src/app/`
- Database: `prisma/schema.prisma` + `prisma/dev.db`
- All source paths are relative to repo root (e.g., `src/lib/email/index.ts`)
