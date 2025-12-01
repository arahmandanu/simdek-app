# TypeScript, ESLint, and Prettier Setup

## Project Structure

This is a Laravel 10 + Vue 3 + Vuetify project with Docker support.

### Frontend Stack

- **Vue 3.2.37** with Composition API (`<script setup>`)
- **Vuetify 3.11.0** for Material Design components
- **Vite 5.0.0** as build tool
- **TypeScript 5.9.3** for type safety

### Code Quality Tools

- **ESLint 9.39.1** with flat config format
- **Prettier 3.7.3** for code formatting
- **vue-tsc** for Vue TypeScript type checking

## Configuration Files

### TypeScript (`tsconfig.json`)

- Target: ES2020
- Module: ESNext
- Path alias: `@/*` → `resources/js/*`
- Strict mode enabled
- Includes: `resources/js/**/*.{ts,tsx,vue}`

### ESLint (`eslint.config.js`)

- Flat config format (ESLint 9+)
- Plugins: vue, typescript-eslint
- Integration with Prettier
- Custom rules for Vue 3 and TypeScript
- Ignores: `vendor/`, `node_modules/`, `public/`, `bootstrap/`

### Prettier (`.prettierrc`)

- Single quotes: `true`
- Tab width: 2 spaces
- Print width: 100 characters
- Semicolons: `true`
- Trailing commas: ES5

## File Locations

### Source Files

- **Entry point**: `resources/js/app.ts`
- **Vite config**: `vite.config.ts`
- **Vue components**: `resources/js/components/*.vue`
- **Type definitions**: `resources/js/vite-env.d.ts`

### Config Files

- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration
- `.prettierrc` - Prettier configuration
- `.prettierignore` - Prettier ignore patterns

## NPM Scripts

```json
{
  "dev": "vite",
  "build": "vue-tsc && vite build",
  "type-check": "vue-tsc --noEmit",
  "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix",
  "lint:check": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts",
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
```

## Code Conventions

### Vue Components

- Use `<script setup lang="ts">` syntax
- Script tags come before template
- Use Composition API with imports from 'vue'
- Self-closing tags for all components

### TypeScript

- Explicit types for function parameters
- Avoid `any` type (ESLint warning)
- Use type inference when obvious
- Prefix unused variables with `_`

### Imports

- Use single quotes
- Path alias `@/` for `resources/js/`
- Group imports: external, internal, components

## Docker Integration

The project runs in Docker with:

- **App container**: PHP 8.2 FPM with Laravel
- **Node container**: Runs Vite dev server on port 5173
- **DB container**: MySQL 8.0

### HMR (Hot Module Replacement)

- Enabled through Vite
- Works across Docker network
- Configured in `vite.config.ts`

## Key Dependencies

```json
{
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^8.48.0",
    "@typescript-eslint/parser": "^8.48.0",
    "eslint": "^9.39.1",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-vue": "^10.6.2",
    "prettier": "^3.7.3",
    "typescript": "^5.9.3",
    "typescript-eslint": "^8.48.0",
    "vue-tsc": "^3.1.5"
  }
}
```

## Important Notes

1. **ESLint Config Format**: Using flat config (ESLint 9+), not legacy `.eslintrc`
2. **Vue Components**: All use TypeScript with `lang="ts"` attribute
3. **Type Checking**: Separate from build process, run with `npm run type-check`
4. **Prettier Integration**: ESLint rules that conflict with Prettier are disabled
5. **Path Aliases**: Use `@/` instead of relative paths for imports

## Common Tasks

### Adding a new Vue component

1. Create `.vue` file with `<script setup lang="ts">`
2. Import types from Vue if needed
3. Use TypeScript for all logic

### Checking code quality

```bash
npm run type-check  # TypeScript errors
npm run lint:check  # ESLint errors
npm run format:check  # Prettier formatting
```

### Before committing

```bash
npm run format  # Auto-format
npm run lint    # Auto-fix linting
npm run type-check  # Verify types
```
