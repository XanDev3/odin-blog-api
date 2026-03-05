# TypeScript Migration - Full Phase Details

## ✅ Phase 1: Foundation & Setup
- TypeScript installed, tsconfig.json created
- src/ directory structure, files moved
- package.json: `"type": "module"`, ESM scripts
- Scripts: `dev` (tsx watch), `build` (tsc), `typecheck` (tsc --noEmit), `start` (node dist/bin/www.js)

## ✅ Phase 2: Type Definitions
- src/types/express.d.ts — Express Request augmentation
- src/types/jwt.d.ts — JWT payload interface
- src/types/models.ts — IUserDocument, IPostDocument, ICommentDocument

## ✅ Phase 3: Models
- src/models/user.ts
- src/models/post.ts
- src/models/comment.ts

## ✅ Phase 4: Config Files
- src/config/allowedOrigins.ts
- src/config/corsOptions.ts
- src/config/passport.ts (Passport strategies extracted from app.js)
- src/config/swagger.ts

## ✅ Phase 5: Controllers
- src/controllers/authController.ts — exports: user_signup, user_login, user_logout
- src/controllers/postController.ts — exports: posts_list, post_get, post_create, post_update, post_delete
- src/controllers/commentController.ts — exports: comments_list, comment_get, comment_create, comment_update, comment_delete

## ✅ Phase 6: Routes
- src/routes/index.ts — simple redirect to /api
- src/routes/api.ts — named imports from all controllers, direct function references in routes
- Fixed: removed conflicting @types/express-validator (express-validator v7 has its own types)
- `npm run typecheck` passes clean ✓

## ✅ Phase 7: Application Entry Points
- src/app.ts — fully converted
  - All require() → ESM import with .js extensions
  - Dropped unused imports: createError, express-session, Schema, bcrypt, LocalStrategy, JwtStrategy, User
  - ESM __dirname shim: fileURLToPath(import.meta.url) + path.dirname()
  - Replaced 3 inline Passport strategy blocks with configurePassport() call
  - Error handler typed as ErrorRequestHandler, unused next → _next
  - module.exports → export default app
  - Installed @types/express-ejs-layouts and @types/swagger-ui-express
- src/bin/www.ts — new file created
  - All require() → ESM import
  - normalizePort: (val: string): number | string | false
  - onError: (error: NodeJS.ErrnoException): void
  - onListening: (): void
  - Safe null handling: addr?.port
- tsc --noEmit passes clean ✓

## ✅ Phase 8: Build Verification
- `npm run build` (tsc) — zero errors ✓
- dist/ output confirmed: app.js, bin/www.js, config/, controllers/, models/, routes/, types/ all compiled with .js.map source maps
- Note: dist/app copy.js present due to backup file in src/ — cleans up in Phase 10

## ⏳ Phase 9: Strict Mode
- Enable in tsconfig.json:
  - `"strict": true`
  - `"noImplicitAny": true`
  - `"strictNullChecks": true`
- Fix resulting type errors file by file

## ⏳ Phase 10: Final Cleanup & Testing
- Delete all backup .js files (see MEMORY.md)
- Set up Vitest for testing
- Update Vercel config if needed