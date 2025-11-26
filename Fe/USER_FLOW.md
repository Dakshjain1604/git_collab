# Dashboard User Flow - Restructured

## Navigation Flow

### User Journey:

```
1. LANDING PAGE: Upload Form (Input View)
   ↓
   User uploads resume + job description
   ↓
   
2. ANALYSIS REPORT (Analysis View)
   ↓ (with buttons to navigate)
   - "View Dashboard" → shows metrics & analytics
   - "Back" → return to upload form to analyze another resume
   ↓

3. DASHBOARD VIEW (Metrics & Analytics)
   - Shows aggregated statistics
   - Recent activity
   - Score distributions
   - Can click "View All" → History
   ↓

4. HISTORY VIEW
   - All previous analyses
   - Click any to view detailed report
   - Back button → to upload form
```

## Updated Navigation Structure

### Navigation Bar Items (in order):
1. **Upload** (icon: Upload) - Primary entry point
2. **Dashboard** (icon: LayoutDashboard) - View metrics  
3. **Last Report** (icon: FileText) - View last analysis report
4. **History** (icon: Clock) - View all analyses

### Default View State
- App starts with **Upload View** (Input View)
- This is the primary user interaction point

## Flow Details

### Upload View
- **Purpose**: Primary interaction - get resume and job description
- **Navigation**:
  - Submit form → Auto-navigates to Analysis View
  - Navigation bar can access Dashboard, History, etc.

### Analysis View  
- **Purpose**: Display detailed analysis report
- **Navigation**:
  - "View Dashboard" button → Dashboard View
  - "Back" button → Return to Upload View (start new analysis)

### Dashboard View
- **Purpose**: View aggregated metrics and recent activity
- **Navigation**:
  - "View All" link → History View
  - "New Analysis" link → Upload View
  - Can click recent analysis cards → Analysis View

### History View
- **Purpose**: Browse all past analyses
- **Navigation**:
  - Click analysis card → Analysis View
  - "Back" button → Upload View

## Key Benefits of This Flow

1. **User-Centric**: Users see upload form first, which is their primary need
2. **Intuitive**: After analysis, users can immediately view results
3. **Easy Navigation**: "View Dashboard" button makes metrics easily accessible
4. **Loop Support**: Users can quickly upload new resumes without leaving the app
5. **Modern UX**: Smooth transitions between states with clear navigation paths

## Button Actions

### Primary Actions
- **"Analyze Resume"** - Submit form (Upload → Analysis)
- **"View Dashboard"** - Show metrics (Analysis → Dashboard)
- **"View All"** - Show all histories (Dashboard → History)

### Secondary Actions
- **"Back"** - Return to Upload View
- **Navigation Bar** - Quick access to all views

## Loading States
- Dashboard metrics load on-demand (only when Dashboard view is accessed)
- Analysis history loads on-demand
- Smooth loading indicators with animations

## Mobile Responsive
- Sticky navigation header
- Touch-friendly button sizes
- Responsive grid layouts
- Mobile-optimized form inputs

---

**Updated**: November 25, 2025
**Dashboard Version**: 2.0 (Restructured Flow)
