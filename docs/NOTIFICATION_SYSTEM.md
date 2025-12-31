# Admin Notification System

## 🔔 Overview

The notification bell in the admin header is now fully functional with real-time updates for new feedback submissions.

## ✨ Features

### Real-Time Notifications

-   **Live Updates**: Automatically detects new feedback via Supabase real-time subscriptions
-   **Instant Alerts**: New feedback appears immediately without page refresh
-   **Browser Notifications**: Desktop notifications when new feedback arrives (with permission)

### Smart Badge System

-   **Unread Counter**: Shows number of unread notifications (1-9, then "9+")
-   **Visual Indicator**: Red badge pulses when new notifications arrive
-   **Auto-Update**: Counter updates in real-time

### Interactive Notification Panel

-   **Dropdown Panel**: Click bell icon to open notification center
-   **Rich Information**: Shows feedback details, category, status, reference number
-   **Time Stamps**: Relative time display (e.g., "5m ago", "2h ago")
-   **Color-Coded**: Different colors for status and categories

### Actions

-   **Click Notification**: Opens feedback page and marks as read
-   **Mark All Read**: Button to mark all notifications as read
-   **Clear Individual**: X button on each notification
-   **Clear All**: Button to clear all notifications at once

## 🎨 Visual Design

### Notification Types

-   **New Feedback**: Shows when student submits feedback
-   **Status Icons**:
    -   ⏰ Pending
    -   👁️ In Progress
    -   💬 Responded
    -   ✅ Resolved

### Color Coding

-   **Unread**: Blue background highlight
-   **Read**: White/grey background
-   **Categories**: Color-coded badges (Academic=Blue, Facilities=Green, etc.)
-   **Status**: Color-coded status icons matching feedback status

### Responsive Design

-   **Desktop**: Panel appears as dropdown from bell icon
-   **Mobile**: Full-screen overlay with backdrop
-   **Max Height**: 600px with scrolling for many notifications

## 🔄 How It Works

### Data Flow

1. Student submits feedback → Supabase database
2. Real-time subscription detects INSERT event
3. Notification created and added to list
4. Badge counter increments
5. Browser notification shows (if enabled)

### Persistence

-   **Last Checked**: Stored in localStorage
-   **On Page Load**: Fetches feedback submitted since last check
-   **Real-Time**: Listens for new submissions continuously

### Marking as Read

-   **Manual**: Click "Mark all as read" button
-   **Automatic**: Clicking a notification marks it as read
-   **Timestamp Update**: Updates "last checked" timestamp

## 📱 Usage

### For Admins

1. **Bell Icon**: Click to open notification panel
2. **View Details**: Each notification shows:
    - Sender name (or "Anonymous")
    - Feedback subject
    - Category badge
    - Reference number
    - Time ago
3. **Take Action**:
    - Click notification → Opens feedback page
    - Click X → Removes notification
    - Click check mark → Mark all as read
    - Click trash → Clear all

### Browser Notifications

-   **First Time**: Browser asks for notification permission
-   **Allow**: Receive desktop notifications even when tab is inactive
-   **Deny**: Only see in-app notifications

## 🎯 Notification Data Structure

```javascript
{
  id: 'feedback-123',
  type: 'new_feedback',
  title: 'New Feedback Received',
  message: 'John Doe submitted feedback: Library Hours',
  category: 'Facilities',
  status: 'pending',
  referenceNumber: 'TNG-20251231-123',
  feedbackId: 123,
  timestamp: '2025-12-31T10:30:00Z',
  read: false
}
```

## 🚀 Technical Implementation

### Files Created

1. **`hooks/useNotifications.js`**: Custom hook for notification logic
2. **`components/admin/NotificationPanel.jsx`**: UI component

### Files Modified

1. **`layouts/AdminLayout.jsx`**: Integrated notification system

### Dependencies

-   **Supabase Real-time**: For live feedback updates
-   **Framer Motion**: For smooth animations
-   **localStorage**: For persistence
-   **Browser Notification API**: For desktop alerts

## ⚡ Performance

-   **Real-time Subscription**: Minimal overhead, single channel
-   **Smart Filtering**: Only fetches new feedback since last check
-   **Lazy Loading**: Panel only renders when opened
-   **Optimized Animations**: 60 FPS spring physics

## 🎨 Animations

-   **Badge Pulse**: Scale animation when new notification arrives
-   **Panel Slide**: Smooth slide-in from right
-   **Notification Pop**: Individual items fade and slide in
-   **Hover Effects**: Subtle scale and color transitions

## 🔒 Privacy & Security

-   **Admin Only**: Notifications only visible to authenticated admins
-   **Row-Level Security**: Uses Supabase RLS policies
-   **No Sensitive Data**: Only displays information admins can already access
-   **Local Storage**: Only stores timestamp, not sensitive data

## 🧪 Testing

### Manual Testing

-   [x] Bell icon displays unread count
-   [x] Click opens notification panel
-   [x] Submit new feedback → Notification appears
-   [x] Click notification → Opens feedback page
-   [x] Mark as read → Counter decrements
-   [x] Clear notification → Removes from list
-   [x] Browser notification works (with permission)
-   [x] Dark mode compatible
-   [x] Mobile responsive

## 🎯 Future Enhancements (Optional)

-   [ ] Notification categories (feedback, status changes, mentions)
-   [ ] Notification sound toggle
-   [ ] Do Not Disturb mode
-   [ ] Notification history/archive
-   [ ] Email digest of notifications
-   [ ] Filter notifications by type
-   [ ] Search within notifications

---

**Status**: ✅ Complete and Production Ready  
**Last Updated**: December 31, 2025
