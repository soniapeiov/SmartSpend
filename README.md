# SmartSpend

**Offline-first expense tracking app** — React Native · TypeScript

Final project for the Mobile Device Programming course (ISLA — Instituto Politécnico de Gestão e Tecnologia). Built by a team of 3 to help university students capture and understand their spending without friction.

SmartSpend runs fully offline for all financial data: expenses are stored on-device with SQLite, and receipts are scanned and parsed entirely on-device with Google ML Kit — no network call, no cloud OCR. Firebase Auth is the only feature that requires connectivity.

## Features

- **Receipt scanning (camera or gallery)** — on-device OCR via Google ML Kit extracts the total and date from a photographed receipt
- **Review before save** — extracted values are pre-filled into an editable form; nothing saves without user confirmation
- **Manual entry fallback** — if OCR fails or the receipt is unreadable, the same form accepts manual input
- **Full expense CRUD** — add, edit, delete, categorized into 5 types (Food, Transportation, Shopping, Home, Other)
- **Budget limits & alerts** — configurable daily/weekly/monthly limits, checked in priority order (monthly → weekly → daily) with duplicate-alert suppression
- **Weekly & monthly spending summaries** — automatic in-app notifications comparing the current period to the previous one
- **Spending analysis** — pie chart by category with daily/weekly/monthly/yearly filters
- **Notification center** — in-app history with unread badge

## Tech stack

| Category | Technology |
|---|---|
| Framework | React Native CLI |
| Language | TypeScript |
| Auth | Firebase Auth |
| Local storage | `@op-engineering/op-sqlite` |
| OCR | `@react-native-ml-kit/text-recognition` (on-device) |
| Camera | `react-native-camera-kit` |
| Navigation | React Navigation (Native Stack + Bottom Tabs) |
| Charts | `react-native-chart-kit` |
| Lists | `react-native-swipe-list-view` |
| Design | Figma |

## Architecture

- **UI layer** — screens for auth (Launch/Welcome/Login/SignUp/ForgotPassword), main tabs (Home, Analysis, Receipt, Profile), the receipt flow (AddReceipt → Scan/Gallery → ReviewExpense), and settings (Settings, SetLimit, EditProfile, Notifications)
- **Processing layer** — `AuthContext` (Firebase UID, auth state), `NotificationContext` (unread count, toast display), an OCR service (`scanReceipt()`), and a database service wrapping all CRUD calls
- **Data layer** — 4 SQLite tables: `users`, `expenses`, `spending_limits`, `notifications`, with `ON DELETE CASCADE` foreign keys back to `users`

### OCR pipeline

`ScanScreen` (live camera) and `GalleryScreen` (image picker) both feed into `scanReceipt()`, which runs ML Kit text recognition on-device and extracts:
- **Total** — tried in priority order: currency-symbol pattern → labeled field (e.g. "TOTAL") → largest decimal number found as fallback
- **Date** — regex-matched across common formats, normalized to `DD/MM/YYYY`

Results route to `ReviewExpenseScreen` for confirmation/editing; a failed extraction routes straight to manual entry. Future dates are rejected at validation.

## My contributions

I owned the OCR pipeline and the receipt-capture screens:

- Built the **OCR service** (`scanReceipt()`), integrating Google ML Kit and implementing the total/date extraction logic described above
- Implemented the **manual review and fallback entry** flow
- Built/modified **ScanScreen**, **GalleryScreen**, and **ReviewExpenseScreen**

## Known limitations

- Currency is fixed to EUR — a planned ExchangeRate-API integration wasn't completed in the project timeline
- OCR accuracy drops on low-quality, handwritten, or non-standard receipt formats
- Testing was manual only; no automated test suite

## Getting started

```bash
# Install dependencies
npm install

# Start Metro
npm start

# Run on Android
npm run android

# Run on iOS (first install CocoaPods dependencies)
bundle install
bundle exec pod install
npm run ios
```

## Team

Built by Sukran Kurt (design, architecture, screens, SQLite, Firebase), Sonia Peiov (OCR service, ML Kit integration, ScanScreen/GalleryScreen/ReviewExpenseScreen), and Daria Mincan (budget alerts, spending summaries).
