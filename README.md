# Medical Appointment System Frontend

A responsive web application for managing the daily operations of a clinic or hospital. It provides dedicated portals for patients, doctors, staff, and administrators and connects to the Medical Appointment System backend to bring appointments, clinical records, laboratory work, room allocation, billing, payments, and feedback into one centralized interface.

## Features

- Public clinic website with service, review, and contact sections
- Patient registration, email verification, login, and password recovery
- Secure JWT-based authentication and role-based portal access
- Separate dashboards for patients, doctors, staff, and administrators
- User profile viewing and management
- Doctor directory and appointment availability
- Appointment booking, rescheduling, status tracking, and cancellation
- Prescription and medication viewing and management
- Laboratory test, order, and result management
- Room allocation and schedule management
- Billing and payment tracking
- Patient feedback submission
- Responsive layouts, dark mode support, form validation, notifications, search, tables, and pagination

## Technology Stack

| Area            | Technology                        |
| --------------- | --------------------------------- |
| Language        | TypeScript                        |
| Framework       | Next.js 16 (App Router)           |
| UI              | React 19, Tailwind CSS 4          |
| Dates           | date-fns, React DayPicker         |
| Notifications   | Sonner                            |
| Authentication  | JWT stored in an HTTP-only cookie |
| Code Quality    | ESLint, TypeScript                |
| Package Manager | npm                               |

## Prerequisites

- Node.js 20.9 or later
- npm
- The Medical Appointment System backend running locally or on an accessible server

## Running Locally

Clone the repository and enter the project directory.

```bash
git clone https://github.com/it25101958/medical-appointment-frontend.git
cd medical-appointment-frontend
```

Install the dependencies.

```bash
npm install
```

Create a `.env.local` file in the project root and configure the backend API URL.

```env
INTERNAL_BACKEND_URL=http://localhost:8080/api/v1
```

Ensure that the backend application is running, then start the frontend development server.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build and Code Quality

Run ESLint:

```bash
npm run lint
```

Create an optimized production build:

```bash
npm run build
```

Start the production server after building:

```bash
npm run start
```

## Group Members

- IT25101952 – Lekamwasam N. L. P. M.
- IT25101953 – Nanayakkara Y. S.
- IT25101955 – Wijesekara M. G. N. L.
- IT25101958 – Chamila A. L. G.
- IT25101973 – Patabendi M. K. K.
- IT25101986 – Thashmina P. G. D.

## License

This project is available under the [MIT License](LICENSE).
