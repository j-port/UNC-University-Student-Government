# Dynamic Content Implementation Guide

## Overview

This guide documents the transformation of static content to dynamic, database-driven content for the UNC USG Website.

## 📁 Files Created

### 1. Database Schema

-   **File**: `supabase_schema_setup.sql`
-   **Purpose**: Creates all necessary tables for dynamic content
-   **Tables Created**:
    -   `officers` - USG officers (executive, legislative, committee)
    -   `organizations` - Student organizations, FSOs, fraternities
    -   `committees` - Committee information
    -   `governance_documents` - Constitution and bylaws
    -   `site_content` - Dynamic page content (stats, values, etc.)
    -   `page_content` - Full page content management

### 2. Sample Data

-   **File**: `supabase_seed_data.sql`
-   **Purpose**: Populates tables with initial data
-   **Includes**: Sample officers, organizations, governance documents, and site content

### 3. Backend API Updates

-   **File**: `backend/src/index.js`
-   **New Endpoints**:
    -   `GET/POST/PUT/DELETE /api/officers` - Officer management
    -   `GET/POST/PUT /api/organizations` - Organization management
    -   `GET/POST/PUT /api/committees` - Committee management
    -   `GET/POST/PUT /api/governance-documents` - Document management
    -   `GET/POST /api/site-content` - Site content management
    -   `GET/POST /api/page-content/:slug` - Page content management

### 4. Frontend Helper Functions

-   **File**: `frontend/src/lib/supabaseClient.js`
-   **New Functions**:
    -   `fetchOfficers(branch)` - Get officers by branch
    -   `fetchOrganizations(type, college)` - Get organizations
    -   `fetchCommittees()` - Get committees
    -   `fetchGovernanceDocuments(type)` - Get constitution/bylaws
    -   `fetchSiteContent(section)` - Get site content
    -   `fetchPageContent(slug)` - Get page content
    -   Admin CRUD functions for all entities

### 5. Dynamic Page Components

-   **File**: `frontend/src/pages/OrgChartDynamic.jsx`
-   **Purpose**: Fully dynamic organizational chart
-   **Features**:
    -   Loads all data from Supabase
    -   Displays officers, committees, organizations
    -   Loading states and error handling

## 🚀 Implementation Steps

### Step 1: Set Up Database

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Run `supabase_schema_setup.sql` to create tables
4. Run `supabase_seed_data.sql` to populate with sample data

### Step 2: Update Backend

-   Backend has been updated with all necessary API endpoints
-   No additional changes needed

### Step 3: Update Frontend

#### Replace OrgChart.jsx

Copy the contents of `OrgChartDynamic.jsx` and replace the entire contents of `frontend/src/pages/OrgChart.jsx`

#### Update Constitution.jsx

The Constitution page needs to fetch from `governance_documents` table where `type='constitution'`:

```javascript
import { fetchGovernanceDocuments } from "../lib/supabaseClient";

// In component:
const [articles, setArticles] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const loadArticles = async () => {
        const { data, error } = await fetchGovernanceDocuments("constitution");
        if (data) setArticles(data);
        setLoading(false);
    };
    loadArticles();
}, []);

// Then map through articles instead of hardcoded data
```

#### Update Bylaws.jsx

Similar to Constitution, fetch where `type='bylaw'` and use the `sections` JSONB field.

#### Update Home.jsx

Fetch stats from `site_content` where `section='home_stats'`:

```javascript
const [stats, setStats] = useState([]);

useEffect(() => {
    const loadStats = async () => {
        const { data } = await fetchSiteContent("home_stats");
        setStats(data || []);
    };
    loadStats();
}, []);
```

#### Update Hero.jsx

Fetch from `site_content` where `section='hero_stats'` and `section='hero_features'`.

#### Update About.jsx

Fetch core values from `site_content` where `section='core_values'` and achievements from `section='achievements'`.

#### Update Bulletins.jsx

Remove the fallback sample data arrays. Handle empty data gracefully:

```javascript
// Remove sampleAnnouncements and sampleIssuances arrays
// Update to:
setAnnouncements(announcementsResult.data || []);
setIssuances(issuancesResult.data || []);

// Add empty state display if no data
```

#### Update Transparency.jsx

Remove `sampleTransactions` array and handle empty state.

## 📊 Data Structure Examples

### Officers Table

```sql
{
  id: uuid,
  name: 'Juan Dela Cruz',
  position: 'USG President',
  branch: 'executive', -- or 'legislative', 'committee'
  email: 'president@unc.edu.ph',
  image_url: 'https://...',
  order_index: 1
}
```

### Organizations Table

```sql
{
  id: uuid,
  name: 'Computer Science Society',
  abbreviation: 'CSS',
  type: 'academic', -- or 'non-academic', 'fraternity', 'sorority', 'co-ed', 'college-council'
  college: 'CCS',
  color: 'bg-blue-500',
  icon: 'Code'
}
```

### Site Content Table

```sql
{
  section: 'home_stats',
  key: 'students_represented',
  value: '15,000+',
  metadata: {
    "label": "Students Represented",
    "icon": "Users"
  }
}
```

## 🔐 Admin Functionality

### Creating Admin Pages

You'll need to create admin pages for managing:

1. **AdminOrgChart** - Already exists, needs to connect to API
2. **AdminGovernance** - Manage Constitution and Bylaws
3. **AdminSiteContent** - Manage stats, values, hero content

Example admin component structure:

```javascript
import {
    createOfficer,
    updateOfficer,
    deleteOfficer,
} from "../lib/supabaseClient";

// CRUD operations
const handleCreate = async (data) => {
    const { data: newOfficer, error } = await createOfficer(data);
    // Handle response
};

const handleUpdate = async (id, updates) => {
    const { data, error } = await updateOfficer(id, updates);
    // Handle response
};

const handleDelete = async (id) => {
    const { error } = await deleteOfficer(id);
    // Handle response
};
```

## ✅ Testing Checklist

-   [ ] Run SQL schema setup in Supabase
-   [ ] Run seed data SQL
-   [ ] Verify tables created in Supabase dashboard
-   [ ] Test backend API endpoints (use Postman/Thunder Client)
-   [ ] Replace OrgChart.jsx with dynamic version
-   [ ] Test OrgChart page loads data
-   [ ] Update Constitution.jsx to be dynamic
-   [ ] Update Bylaws.jsx to be dynamic
-   [ ] Update Home.jsx stats
-   [ ] Update Hero.jsx content
-   [ ] Update About.jsx content
-   [ ] Remove fallback data from Bulletins
-   [ ] Remove fallback data from Transparency
-   [ ] Test all pages load correctly
-   [ ] Implement admin pages for content management

## 🎯 Benefits of This Implementation

1. **No More Hardcoded Data**: All content comes from database
2. **Easy Updates**: Admins can update content without code changes
3. **Centralized Management**: One place to manage all content
4. **Scalability**: Easy to add new officers, organizations, etc.
5. **Consistency**: Same data source for all pages
6. **Version Control**: Database tracks when content was updated
7. **Role-Based Access**: Supabase RLS policies control who can edit

## 🛠️ Next Steps

1. **Priority 1**: Set up database (run SQL files)
2. **Priority 2**: Replace OrgChart.jsx
3. **Priority 3**: Update Constitution and Bylaws pages
4. **Priority 4**: Update Home, Hero, About pages
5. **Priority 5**: Remove fallback data
6. **Priority 6**: Build admin interface for content management

## 📝 Notes

-   All API endpoints support filtering (by type, branch, college, etc.)
-   Images can be stored in Supabase Storage or use external URLs
-   The `order_index` field controls display order
-   The `is_active` field allows soft deletes
-   Metadata JSONB fields allow flexible data storage

## 🐛 Troubleshooting

### Data Not Loading

-   Check Supabase URL and keys in `.env` files
-   Verify RLS policies are set correctly
-   Check browser console for errors

### Icons Not Displaying

-   Ensure icon names in database match Lucide React icon names
-   Check the `iconMap` object includes all used icons

### Images Not Loading

-   Verify image URLs are accessible
-   Consider using Supabase Storage for hosting images
-   Add fallback UI for missing images (already implemented in OrgChart)

##Contact
For questions or issues, contact the development team.
