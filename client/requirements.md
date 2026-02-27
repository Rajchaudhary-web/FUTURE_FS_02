## Packages
framer-motion | Page transitions and highly polished modal animations
date-fns | Human-readable date formatting for notes and leads
lucide-react | Premium iconography for the dashboard and details pages
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility for merging tailwind classes

## Notes
- Authentication uses a JWT stored in localStorage.
- All API calls must attach `Authorization: Bearer <token>`.
- Unauthenticated responses (401) will redirect to `/login`.
- Uses custom Fetch wrapper to ensure the Auth context is universally applied.
