// Central API exports - import from here instead of individual files
export { supabase } from "./supabase";

// Officers API
export {
    fetchOfficers,
    updateOfficer,
    createOfficer,
    deleteOfficer,
    updateOfficersOrder,
} from "./officers";

// Committees API
export {
    fetchCommittees,
    updateCommittee,
    createCommittee,
    deleteCommittee,
} from "./committees";

// Announcements & Issuances API
export { fetchAnnouncements, fetchIssuances } from "./announcements";

// Governance Documents API
export {
    fetchGovernanceDocuments,
    updateGovernanceDocument,
    createGovernanceDocument,
} from "./governance";

// Organizations API
export {
    fetchOrganizations,
    updateOrganization,
    createOrganization,
} from "./organizations";

// Feedback API
export { submitFeedback } from "./feedback";

// Financial Reports API
export { fetchFinancialTransactions } from "./reports";

// Site & Page Content API
export {
    fetchSiteContent,
    updateSiteContent,
    fetchPageContent,
    updatePageContent,
} from "./content";
