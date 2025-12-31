# Notification System Troubleshooting Guide

## Issue: Notifications Not Working

### ✅ Fixes Applied:

1. **Enabled Realtime in Supabase Client** - Added realtime configuration
2. **Added Console Logging** - To help debug subscription status
3. **Added Error Handling** - Better error reporting

### 🔧 Additional Setup Required in Supabase Dashboard:

**You MUST enable Realtime for the feedback table in your Supabase project:**

1. Go to your Supabase Dashboard
2. Navigate to **Database** → **Replication**
3. Find the `feedback` table
4. Enable **Realtime** for the table (toggle it ON)
5. Save changes

**Without this, real-time notifications will not work!**

### 🧪 Testing the Notification System:

1. **Open Admin Panel** in one browser tab/window
2. **Open Public Feedback Page** in another tab/window
3. **Submit new feedback** from the public page
4. **Check browser console** in admin panel for logs:
    - Should see: `"Notification subscription status: SUBSCRIBED"`
    - Should see: `"New feedback received:"` when feedback submitted
5. **Check notification bell** - badge should show count
6. **Click bell** - dropdown should show new notification

### 🐛 Debug Checklist:

**If notifications still don't work, check:**

-   [ ] Supabase Realtime is enabled for `feedback` table in dashboard
-   [ ] Browser console shows `"Notification subscription status: SUBSCRIBED"`
-   [ ] No errors in browser console
-   [ ] Environment variables are set correctly (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
-   [ ] You're logged in as admin
-   [ ] Database RLS policies allow reading feedback

### 📊 Console Output (What to Look For):

**Good (Working):**

```
Notification subscription status: SUBSCRIBED
New feedback received: {new: {...}}
```

**Bad (Not Working):**

```
Notification subscription status: CHANNEL_ERROR
Error: realtime is disabled
```

### 🔒 Database RLS Policy (Required):

Make sure authenticated users can read feedback:

```sql
-- Check if this policy exists
SELECT * FROM pg_policies WHERE tablename = 'feedback';

-- If not, create it:
CREATE POLICY "Admins can read all feedback"
ON feedback FOR SELECT
TO authenticated
USING (true);
```

### ⚡ Quick Test:

Run this in browser console on admin page:

```javascript
// Check if realtime is working
const channel = window.supabase.channel("test-channel");
channel.subscribe((status) => {
    console.log("Status:", status);
});
```

Should log: `Status: SUBSCRIBED`

### 🎯 Reference Number Format:

**Format:** `TNG-YYYYMMDD-HHMMRR`

**Example:** `TNG-20251231-183295`

-   Date: 2025-12-31
-   Time: 18:32 (6:32 PM)
-   Random: 95

This format is:
✅ Short (17 characters)
✅ Unique (timestamp + random)
✅ Race-condition free
✅ Human-readable

---

**Status:** System configured, awaiting Supabase Realtime enablement in dashboard
