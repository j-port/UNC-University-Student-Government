import { SupabaseRepository } from "../SupabaseRepository.js";

export class PageContentRepository extends SupabaseRepository {
    constructor(client) {
        super(client, "page_content");
    }

    async getAll() {
        return this.findAll({
            filters: {},
            orderBy: "page",
            orderDirection: "asc",
        });
    }

    async getAllActive() {
        return this.findAll({
            filters: { active: true },
            orderBy: "page",
            orderDirection: "asc",
        });
    }

    async getBySlug(slug) {
        return this.findOne({ section_key: slug });
    }

    async upsert(contentData) {
        if (contentData.id) {
            return this.update(contentData.id, contentData);
        } else {
            return this.create(contentData);
        }
    }
}
