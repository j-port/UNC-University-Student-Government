import { SupabaseRepository } from "../SupabaseRepository.js";

export class AnnouncementRepository extends SupabaseRepository {
    constructor(client) {
        super(client, "announcements");
    }

    async getAll() {
        return this.findAll({
            orderBy: "created_at",
            orderDirection: "desc",
        });
    }

    async getByCategory(category, status = "published") {
        return this.findAll({
            filters: { category, status },
        });
    }

    async countByCategory(category, status = "published") {
        return this.count({ category, status });
    }
}
