# Design System Quick Reference

## Color Palette

### Backgrounds
```css
/* Primary Gradient (all pages) */
bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950

/* Card Container */
bg-gradient-to-br from-gray-800/50 to-gray-900/50

/* Hover State */
hover:bg-gray-700/50 or hover:bg-gray-800

/* Input Fields */
bg-gray-700/30 border-gray-600/50
focus:ring-2 focus:ring-blue-500
```

### Text & Accents
```css
/* Primary Accent */
text-blue-400, from-blue-500 to-blue-600

/* Secondary Accent */
text-indigo-400

/* Headings */
text-white, font-bold, text-3xl/4xl/5xl

/* Body Text */
text-gray-300, text-gray-400

/* Labels */
text-gray-200, font-semibold, text-sm

/* Success/Warning/Error */
text-green-400, text-yellow-400, text-red-400
```

### Borders & Effects
```css
/* Card Border */
border border-white/10
hover:border-white/20

/* Divider */
border-gray-700/50

/* Glass Effect */
backdrop-blur-xl or backdrop-blur-sm
```

---

## Component Patterns

### Card Container
```jsx
<motion.div 
  whileHover={{ y: -5 }}
  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10 rounded-2xl shadow-2xl p-8 backdrop-blur-xl hover:border-white/20 transition-all"
>
  {/* Content */}
</motion.div>
```

### Form Input
```jsx
<div className="relative">
  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-blue-400 opacity-50" />
  <input
    className="w-full pl-11 pr-4 py-3 bg-gray-700/30 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
  />
</div>
```

### Button (Primary)
```jsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-blue-500/50"
>
  {/* Label */}
</motion.button>
```

### Button (Secondary)
```jsx
<motion.button
  whileHover={{ scale: 1.02 }}
  className="bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/50 text-gray-200 font-semibold py-3 rounded-lg transition-all"
>
  {/* Label */}
</motion.button>
```

### Animated Background Blob
```jsx
<motion.div 
  animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
  transition={{ duration: 8, repeat: Infinity }}
  className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-30"
/>
```

### Entry Animation
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
>
  {/* Content */}
</motion.div>
```

### List Item Animation (Staggered)
```jsx
{items.map((item, idx) => (
  <motion.div
    key={idx}
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: idx * 0.1 }}
  >
    {/* Item */}
  </motion.div>
))}
```

---

## Responsive Grid Patterns

### 3-Column Desktop, 1-Column Mobile
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Items */}
</div>
```

### 2-Column with Sidebar
```jsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div className="lg:col-span-1">{/* Sidebar */}</div>
  <div className="lg:col-span-2">{/* Content */}</div>
</div>
```

### Responsive Flex
```jsx
<div className="flex flex-col md:flex-row lg:flex-row gap-8">
  {/* Items */}
</div>
```

---

## Icon Usage (Lucide React)

### Import
```jsx
import { 
  Home, Menu, X, User, Zap, Mail, Lock, Eye, EyeOff, 
  AlertCircle, LogOut, Edit, FileText, Briefcase
} from 'lucide-react';
```

### Implementation
```jsx
<Mail className="w-4 h-4 text-blue-400 opacity-50" />
<User className="w-6 h-6 text-blue-400" />
<AlertCircle className="w-5 h-5" />
```

---

## Animation Presets

### Standard Entry
```jsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
```

### Staggered List
```jsx
transition={{ delay: index * 0.1, duration: 0.5 }}
```

### Hover Scale
```jsx
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
```

### Continuous Blob
```jsx
animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
transition={{ duration: 8, repeat: Infinity }}
```

---

## Typography Scale

| Element | Class | Usage |
|---------|-------|-------|
| XL Heading | `text-5xl md:text-7xl font-extrabold` | Page titles |
| L Heading | `text-3xl md:text-4xl font-bold` | Section titles |
| M Heading | `text-2xl font-bold` | Card titles |
| S Heading | `text-xl font-semibold` | Subsections |
| Body | `text-base text-gray-300` | Normal text |
| Small | `text-sm text-gray-400` | Labels |
| Tiny | `text-xs text-gray-500` | Timestamps |

---

## Spacing Scale

```css
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 2.5rem (40px)
```

---

## Shadow Patterns

```css
/* Card Shadow */
shadow-2xl

/* Button Hover */
shadow-lg hover:shadow-blue-500/50

/* No Shadow */
shadow-none
```

---

## Border Radius

```css
/* Cards & Buttons */
rounded-2xl

/* Inputs */
rounded-lg

/* Avatars */
rounded-full
```

---

## Backdrop & Blur

```css
/* Full Blur */
backdrop-blur-xl

/* Partial Blur */
backdrop-blur-sm

/* With Opacity */
bg-black/70
```

---

## State Colors

| State | Badge Class |
|-------|-------------|
| Success | `bg-green-500/20 text-green-300` |
| Warning | `bg-yellow-500/20 text-yellow-300` |
| Error | `bg-red-500/20 text-red-300` |
| Info | `bg-blue-500/20 text-blue-300` |

---

## Common Utilities

```jsx
/* Smooth Transitions */
transition-all duration-300

/* Hover Color Change */
hover:text-cyan-400

/* Focus Ring */
focus:ring-2 focus:ring-blue-500

/* Disabled State */
disabled:opacity-50 disabled:cursor-not-allowed

/* Responsive Display */
hidden md:flex, md:hidden lg:flex
```

---

**Last Updated**: December 2024  
**Design System Version**: 1.0  
**Framework**: TailwindCSS + Framer Motion + Lucide React
