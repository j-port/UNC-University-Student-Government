import { supabase } from "../config/database.js";
import { FeedbackRepository } from "./repositories/FeedbackRepository.js";
import { AnnouncementRepository } from "./repositories/AnnouncementRepository.js";
import { OfficerRepository } from "./repositories/OfficerRepository.js";
import { OrganizationRepository } from "./repositories/OrganizationRepository.js";
import { CommitteeRepository } from "./repositories/CommitteeRepository.js";
import { GovernanceDocumentRepository } from "./repositories/GovernanceDocumentRepository.js";
import { SiteContentRepository } from "./repositories/SiteContentRepository.js";
import { PageContentRepository } from "./repositories/PageContentRepository.js";
import { FinancialTransactionRepository } from "./repositories/FinancialTransactionRepository.js";
import { IssuanceRepository } from "./repositories/IssuanceRepository.js";

/**
 * Database abstraction layer
 * This provides a single interface to all repositories
 * To switch from Supabase to PostgreSQL:
 * 1. Create PostgresRepository.js extending BaseRepository
 * 2. Update this file to use PostgresRepository instead of SupabaseRepository
 * 3. Routes remain unchanged!
 */
class Database {
    constructor() {
        // Initialize all repositories with Supabase client
        // To switch to PostgreSQL, pass a different client here
        this.feedback = new FeedbackRepository(supabase);
        this.announcements = new AnnouncementRepository(supabase);
        this.officers = new OfficerRepository(supabase);
        this.organizations = new OrganizationRepository(supabase);
        this.committees = new CommitteeRepository(supabase);
        this.governanceDocuments = new GovernanceDocumentRepository(supabase);
        this.siteContent = new SiteContentRepository(supabase);
        this.pageContent = new PageContentRepository(supabase);
        this.financialTransactions = new FinancialTransactionRepository(
            supabase
        );
        this.issuances = new IssuanceRepository(supabase);
    }

    /**
     * Get automated statistics
     * This is a composite operation that uses multiple repositories
     */
    async getAutomatedStats() {
        const [
            eventsCount,
            accomplishmentsCount,
            totalBudget,
            organizationsCount,
        ] = await Promise.all([
            this.announcements.countByCategory("Event", "published"),
            this.announcements.countByCategory("Accomplishment", "published"),
            this.financialTransactions.getTotalBudget(),
            this.organizations.countActive(),
        ]);

        return {
            eventsCount: eventsCount || 0,
            accomplishmentsCount: accomplishmentsCount || 0,
            totalBudget,
            organizationsCount: organizationsCount || 0,
        };
    }
}

// Export singleton instance
export const db = new Database();
