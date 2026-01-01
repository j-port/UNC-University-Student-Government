import {
    createDatabaseClient,
    getRepositoryClass,
} from "../config/databaseFactory.js";
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
 *
 * To switch databases, simply change DB_TYPE in your .env file:
 * - DB_TYPE=supabase (default)
 * - DB_TYPE=postgres
 *
 * No code changes required!
 */
class Database {
    constructor() {
        // Get database client based on environment configuration
        const { type, client } = createDatabaseClient();
        this.dbType = type;
        this.client = client;

        // Initialize all repositories with the appropriate client
        this.feedback = new FeedbackRepository(client);
        this.announcements = new AnnouncementRepository(client);
        this.officers = new OfficerRepository(client);
        this.organizations = new OrganizationRepository(client);
        this.committees = new CommitteeRepository(client);
        this.governanceDocuments = new GovernanceDocumentRepository(client);
        this.siteContent = new SiteContentRepository(client);
        this.pageContent = new PageContentRepository(client);
        this.financialTransactions = new FinancialTransactionRepository(client);
        this.issuances = new IssuanceRepository(client);
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
