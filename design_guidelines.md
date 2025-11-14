# BizBudz Design Guidelines

## Design Approach
**System**: Material Design principles adapted for student-friendly educational platform
**Philosophy**: Clean, modern, and approachable - prioritizing clarity and engagement for student users

## Visual Identity

### Typography
- **Primary Font**: Clear sans-serif (Inter or similar)
- **Hierarchy**: 
  - Hero headings: text-4xl to text-5xl, font-bold
  - Section headings: text-2xl to text-3xl, font-semibold
  - Card titles: text-lg, font-medium
  - Body text: text-base, regular weight

### Color Palette
- **Background**: White/light gray (bg-white, bg-gray-50)
- **Primary**: Soft blue (e.g., blue-500 to blue-600)
- **Accent**: Orange/green for CTAs and highlights (orange-500, green-500)
- **Text**: Dark gray for readability (gray-900, gray-700)
- **Borders**: Light gray (gray-200, gray-300)

### Spacing System
Use Tailwind units: **4, 6, 8, 12, 16, 20** for consistent rhythm
- Component padding: p-6 to p-8
- Section spacing: py-12 to py-20
- Card gaps: gap-6 to gap-8

## Layout Patterns

### Navigation
- **Top navbar** (sticky): Logo left, links right (Home, Dashboard, Schedule, Resources, Explore, Join Now)
- Active state highlighted with primary color
- Mobile: Hamburger menu, full-width links

### Card System
- Rounded corners (rounded-lg to rounded-xl)
- Subtle shadows (shadow-sm to shadow-md)
- Hover: slight lift (shadow-lg)
- Consistent internal padding (p-6)

### Grid Layouts
- **Desktop**: 2-3 columns for cards (grid-cols-2 lg:grid-cols-3)
- **Mobile**: Single column (grid-cols-1)
- **Dashboard stats**: 3-column on desktop, stack on mobile

## Page-Specific Designs

### Home Page
- **Hero**: Two-column (text left, CTA buttons right on desktop; stack on mobile)
- **Success Story**: Full-width card with student photo placeholder, quote-style design
- **Business of Month**: Featured card with tags
- **Navigation Tiles**: 2x2 grid on desktop, large touch-friendly cards
- Include placeholder hero image suggestion: Students collaborating in modern workspace

### Dashboard
- **Stats Cards**: Icon + value + label, horizontal row on desktop
- **Learning Paths**: Progress bars with percentage, "Continue" buttons
- **Activity Feed**: Timeline-style with icons and timestamps
- **Achievements**: Badge grid with icons, titles, descriptions

### Schedule
- **Live Sessions**: List grouped by date, each with title/time/Join button
- **Map Section**: Placeholder box (border-2 border-dashed) with "Map Placeholder" text
- **Two-column** on desktop (sessions left, map/opportunities right)

### Resources
- **Video Gallery**: Grid of cards with thumbnail placeholders
- **Courses**: Cards with progress bars
- **Tabs or Sections**: Clear headings for Videos, Lessons, Courses, Quizzes, Downloads
- Each resource type in consistent card format with appropriate CTA

### Explore
- **Feed Layout**: Center feed (max-w-2xl), optional right sidebar for top contributors
- **Post Cards**: Avatar/initials, title, preview text, hashtags, interaction buttons
- **Like/Comment**: Icon buttons with counts
- **Upload Modal**: Form with title, textarea, hashtag input

### Signup
- **Centered card** (max-w-md mx-auto)
- Form fields with clear labels above inputs
- Primary "Create Account" button, secondary "Sign in" link below

## Component Library

### Buttons
- **Primary**: bg-blue-600 text-white, rounded-lg, px-6 py-3
- **Secondary**: border-2 border-blue-600 text-blue-600
- **Accent CTA**: bg-orange-500 or bg-green-500 for key actions
- All with hover brightness adjustment

### Form Inputs
- Border (border-gray-300), rounded-md, p-3
- Focus: ring-2 ring-blue-500
- Error state: border-red-500

### Stat Cards
- Icon (large, colored), value (text-3xl font-bold), label (text-sm text-gray-600)
- Vertical layout, centered content

### Progress Bars
- Background (bg-gray-200), fill (bg-blue-600), rounded-full, h-2

### Badges
- Small rounded-full pills for tags/achievements
- Various colors for different categories

## Images
- **Hero Section**: Use placeholder for collaborative student workspace or modern learning environment (1200x600)
- **Student Photos**: Circular avatars (w-12 h-12 rounded-full) for profiles
- **Video Thumbnails**: 16:9 aspect ratio placeholders (bg-gray-200)
- **Business Cards**: Optional small logos/imagery

## Responsive Behavior
- **Desktop**: Multi-column grids, horizontal stats, sidebar layouts
- **Tablet**: 2-column grids, simplified navigation
- **Mobile**: Single column, stacked sections, full-width cards, hamburger menu

## Interaction Patterns
- Hover states: Subtle shadow increase, slight scale
- Click feedback: Brief opacity change
- Form validation: Inline error messages below fields
- Modals: Centered overlay with backdrop blur
- Toasts: Top-right corner for success messages

## Accessibility
- Clear focus states (ring-2 ring-blue-500)
- Sufficient color contrast ratios
- Semantic HTML structure
- Icon buttons with aria-labels