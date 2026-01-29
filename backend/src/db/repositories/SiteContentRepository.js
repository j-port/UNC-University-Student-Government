import { SupabaseRepository } from "../SupabaseRepository.js";

export class SiteContentRepository extends SupabaseRepository {
    constructor(client) {
        super(client, "site_content");
    }

    async getAll(sectionType = null) {
        const filters = {};
        if (sectionType) filters.section_type = sectionType;

        return this.findAll({
            filters,
            orderBy: "display_order",
            orderDirection: "asc",
        });
    }

    async getActive(sectionType = null) {
        const filters = { active: true };
        if (sectionType) filters.section_type = sectionType;

        return this.findAll({
            filters,
            orderBy: "display_order",
            orderDirection: "asc",
        });
    }

    async upsert(contentData) {
        if (contentData.id) {
            return this.update(contentData.id, contentData);
        } else {
            return this.create(contentData);
        }
    }
}
