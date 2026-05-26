# Suggested Commit Messages

Date: 2026-05-26

> Guidance: each section below is a single logical commit. Use `git add` to stage the listed files (or patterns), then `git commit -m "<short message>" -m "<details>"` with the detailed body.

---

1. feat(barrels): normalize feature barrels and export APIs

Short: feat(barrels): normalize feature barrels and export APIs

Details:

- Add consistent `index.ts` barrels for features and export their api/hooks/types/components.
- Ensures each feature exposes a single entrypoint for imports.

Files / patterns (examples):

- `features/*/index.ts` (many features — created/updated)
- `features/labtest/index.ts`
- `features/laboratory/index.ts`
- `features/doctors/index.ts`
- `features/room-schedule/index.ts`
- `features/medications/index.ts`

---

2. refactor(imports): switch deep feature imports to feature barrels

Short: refactor(imports): replace deep imports with feature barrels

Details:

- Replace imports like `@/features/X/api/...`, `@/features/X/components/...`, `@/features/X/types/...` with `@/features/X` where appropriate.
- Reduces long paths and centralizes exports.

Files / patterns (examples):

- `app/**` and `features/**` files updated to import from `@/features/*` barrels (many files changed).

---

3. feat(auth): consolidate auth actions and schemas into feature

Short: feat(auth): move auth actions and validation schemas into feature

Details:

- Moved server actions and Zod schemas into `features/auth/actions` and `features/auth/schemas`.
- Updated components/pages to import from the `auth` barrel.

Files:

- `features/auth/actions/auth.actions.ts`
- `features/auth/schemas/auth.schema.ts`
- `features/auth/index.ts`
- components using auth (e.g. `features/auth/components/*`, `app/auth/*`)

---

4. feat(prescriptions): move prescription types into feature

Short: feat(prescriptions): move prescription types into feature types

Details:

- Removed global `types/prescription-types.ts` and introduced `features/prescriptions/types/prescription.types.ts`.
- Updated all imports to use `@/features/prescriptions`.

Files:

- `features/prescriptions/types/prescription.types.ts` (new)
- `features/prescriptions/index.ts` (updated)
- updated imports across `features/*` and `app/*`

---

5. feat(room): extract room APIs into `features/room` feature

Short: feat(room): move room APIs to `features/room` and update imports

Details:

- Created `features/room/api/room.api.ts` and `features/room/*` barrel.
- Updated pages/components to import room APIs/types from `@/features/room` instead of `room-schedule`.
- Removed the duplicated `features/room-schedule/api/room.api.ts`.

Files:

- `features/room/api/room.api.ts` (new)
- `features/room/index.ts` (updated)
- `app/admin/rooms/page.tsx`, `app/admin/room-schedule/page.tsx` (imports updated)
- removed: `features/room-schedule/api/room.api.ts`

---

6. fix(medications): type-safety for apiRequest & revalidateTag

Short: fix(medications): cast apiRequest return types and adjust revalidateTag call

Details:

- Cast `apiRequest` results to expected `Medication` types.
- Adjusted `revalidateTag` call signature to satisfy TypeScript.

Files:

- `features/medications/api/medication.api.ts` (modified)

---

7. feat(staff): add `StaffDashboard` component and export

Short: feat(staff): add StaffDashboard component and barrel export

Details:

- Added a minimal `StaffDashboard` at `features/staff/components/dashboard.tsx` and exported it from the staff barrel.

Files:

- `features/staff/components/dashboard.tsx` (new)
- `features/staff/index.ts` (updated)

---

8. chore(hooks): add hooks index for `features/room`

Short: chore(room): add hooks index

Details:

- Added `features/room/hooks/index.ts` to resolve barrel exports.

Files:

- `features/room/hooks/index.ts` (new)

---

9. chore(cleanup): remove now-obsolete files

Short: chore(cleanup): delete old centralized and duplicate files

Details:

- Deleted the old `types/prescription-types.ts` and room API duplicate in `room-schedule`.

Files:

- `types/prescription-types.ts` (deleted)
- `features/room-schedule/api/room.api.ts` (deleted)

---

10. docs: add commit message file

Short: docs: add suggested commit messages file

Files:

- `.commit-messages/COMMIT_MESSAGES.md`

---

Tips for committing:

- Stage related changes together as per the groups above.
- Use the short subject line and the longer details body when running `git commit`.
- Run `pnpm build` / `npm run build` locally after committing to verify.

Example commands:

```bash
git add features/prescriptions/types/prescription.types.ts features/prescriptions/index.ts
git commit -m "feat(prescriptions): move types into feature" -m "Move prescription types from global types to feature-local types and update imports across the app."
```

---

If you want, I can now:

- Stage & run the actual `git commit` commands (I cannot run git here unless you ask and allow running commands), or
- Split the current workspace changes into multiple patch files that you can commit separately.
