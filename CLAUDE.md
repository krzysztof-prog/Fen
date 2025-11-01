# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Fentrix** is a React Native mobile application (using Expo) for documenting window measurements. Built for window installers, contractors, and property owners, it enables offline measurement recording with photos, dimensions, and PDF export capabilities.

**Tech Stack:**
- React Native (0.81.5) with Expo SDK 54
- TypeScript (5.9.2) in strict mode
- Expo Router (file-based routing)
- SQLite (expo-sqlite) for offline storage
- Polish language UI/UX

## Development Commands

### Starting Development Server
```bash
# Standard start
npm start

# Start with cache clearing (use if you encounter asset/bundle issues)
npx expo start --clear

# Platform-specific
npm run android  # Launch on Android device/emulator
npm run ios      # Launch on iOS simulator (macOS only)
npm run web      # Launch web version (limited functionality)
```

### Testing
- Use Expo Go app on physical device (scan QR code)
- Or use platform emulators (Android Studio/Xcode)
- Note: Camera features require physical device or dev client build

### Cache Issues
If encountering "Unable to resolve asset" or similar errors:
```bash
rm -rf .expo
rm -rf node_modules/.cache
npx expo start --clear
```

### Database Reset (Development Only)
To reset SQLite database, call `resetDatabase()` from `database/db.ts` in code.

## Architecture

### File-Based Routing (Expo Router)
Navigation structure:
- `app/_layout.tsx` - Root layout with database initialization
- `app/index.tsx` - Home screen (measurement list)
- `app/measurement/new.tsx` - New measurement form (modal)
- `app/measurement/[id].tsx` - Measurement details screen

### Data Flow
```
User Input → Validation (utils/validation.ts)
          → SQLite Database (database/)
          → UI Update (components/)
          ↓
Photos → Compression (utils/imageCompression.ts)
      → FileSystem Storage
      ↓
Export → PDF Generation (utils/pdfExport.ts) → Share
```

### Database Schema (SQLite)

**measurements table:**
- `id` (PK), `name`, `width` (400-6000mm), `height` (400-2600mm)
- `handle_position` ('left'|'right'), `opening_type` ('tilt'|'swing'|'fixed')
- `notes`, `created_at`, `updated_at`
- CHECK constraints enforce validation at DB level

**photos table:**
- `id` (PK), `measurement_id` (FK), `uri`, `order_index` (0-7)
- CASCADE DELETE on measurement deletion
- Max 8 photos per measurement via UNIQUE constraint

### Component Architecture

**Separation of Concerns:**
- `app/` - Screens (routing, data fetching, state management)
- `components/` - Reusable UI components (presentation)
- `database/` - Data layer (queries, models, schema)
- `utils/` - Business logic (validation, compression, PDF)
- `constants/` - Theme, colors, typography, spacing

**Key Components:**
- `SafeScreen.tsx` - Wrapper for safe area handling (notch, status bar)
- `MeasurementCard.tsx` - List item with color-coded icons
- `MeasurementForm.tsx` - Form with real-time validation
- `PhotoGallery.tsx` - Camera access + compression (max 8 photos)

## Critical Implementation Details

### Image Compression
- All photos compressed to max 1920px dimension, 80% JPEG quality
- Target: reduce 6MB+ photos to ~800KB
- Function: `compressImage()` in `utils/imageCompression.ts`
- Always compress before saving to prevent storage bloat

### Validation Rules
Defined in `utils/validation.ts` and enforced at both UI and DB layers:
- Width: 400-6000mm
- Height: 400-2600mm
- Name: 1-100 chars, required
- Notes: max 500 chars
- Photos: max 8 per measurement

### PDF Export
- Uses expo-print (HTML → PDF via WebView)
- Template in `utils/pdfExport.ts`
- Includes: gradient header, dimensions table, photos grid (2x2), notes
- Function: `exportMeasurementToPDF()` generates PDF, `sharePDF()` triggers share sheet

### Database Initialization
- App checks for DB existence in `app/_layout.tsx` on startup
- Shows loading screen during initialization
- Error screen if DB init fails
- Foreign keys MUST be enabled: `PRAGMA foreign_keys = ON;`

## Common Tasks

### Adding a New Field to Measurements
1. Update TypeScript interface in `database/models.ts`
2. Modify schema in `database/db.ts` (ALTER TABLE or recreate)
3. Update CRUD queries in `database/queries.ts`
4. Add form input in `components/MeasurementForm.tsx`
5. Update validation in `utils/validation.ts` if needed
6. Display in `app/measurement/[id].tsx`
7. Include in PDF template in `utils/pdfExport.ts`

### Adding a New Screen
1. Create file in `app/` directory (e.g., `app/settings.tsx`)
2. Expo Router automatically creates route
3. Add navigation link using `router.push()` from `expo-router`
4. Configure screen options in `app/_layout.tsx` Stack.Screen

### Modifying Theme/Colors
- Edit `constants/theme.ts`
- Exports: `COLORS`, `SPACING`, `TYPOGRAPHY`, `SHADOWS`
- Color-coded window types: tilt=blue, swing=green, fixed=gray
- Handle positions: left=orange, right=purple

## Platform-Specific Notes

### Android
- Min SDK: API 23 (Android 6.0)
- Permissions defined in `app.json`: CAMERA, READ_MEDIA_IMAGES
- Test on real device for camera features

### iOS
- Min version: iOS 13.0
- Camera/photo permissions in `app.json` infoPlist
- Expo Go has camera limitations; use dev client for full testing

### Web
- Limited functionality (no camera, no SQLite persistence)
- Use metro bundler (configured in `app.json`)

## Code Style & Patterns

### TypeScript
- Strict mode enabled (`tsconfig.json`)
- All functions should have proper type annotations
- Interfaces defined in `database/models.ts` for data models

### Functional Components
- Use React Hooks (useState, useEffect, useCallback)
- No class components
- Async/await for database operations

### Error Handling
- Always wrap database calls in try/catch
- Log errors with console.error
- Show user-friendly Polish error messages
- Example: `console.error('❌ Błąd podczas...', error);`

### Comments
- Use JSDoc-style comments for functions
- Polish comments in implementation code
- Emoji prefixes in logs (✅ ❌ 📦 🚀) for readability

## Testing & Quality Assurance

### Manual Testing Checklist
- Create measurement with all fields → verify saves to DB
- Take 8 photos → verify 9th photo blocked
- Search measurements → verify filtering works
- Export PDF → verify all data appears correctly
- Delete measurement → verify cascade deletes photos
- Test on device with notch → verify SafeArea works

### Validation Testing
- Submit form with invalid dimensions (e.g., height=300) → verify error shown
- Submit with empty name → verify error shown
- Add 9th photo → verify blocked with message

### Performance
- Photos compress automatically (verify file sizes < 1MB)
- List renders efficiently with FlatList (index screen)
- DB queries use indexes for performance

## Troubleshooting

### "Unable to resolve asset" errors
Run: `npx expo start --clear` and restart Expo Go completely

### SQLite data not persisting
Check logs for DB initialization errors. Verify `isDatabaseInitialized()` returns true.

### Camera not working on iOS in Expo Go
Use development build instead: `npx expo install expo-dev-client && npx expo run:ios`

### PDF generation fails
Requires internet connection (expo-print limitation). Check network.

## Important Constraints

- App is Polish-language only (UI text, validation messages, PDF)
- Offline-first architecture (SQLite, no cloud sync)
- Portrait orientation only (`app.json`)
- Max 8 photos per measurement (enforced at DB + UI)
- Measurement dimensions have realistic window size limits (400-6000mm width, 400-2600mm height)

## Documentation References

- Expo SDK 54: https://docs.expo.dev/
- Expo Router: https://docs.expo.dev/router/introduction/
- expo-sqlite: https://docs.expo.dev/versions/latest/sdk/sqlite/
- React Native: https://reactnative.dev/

---

**Last Updated:** 2025-11-01
**App Version:** 1.0.0
