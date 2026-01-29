import { SupabaseRepository } from "../SupabaseRepository.js";

export class OrganizationRepository extends SupabaseRepository {
    constructor(client) {
        super(client, "organizations");
    }

    async getActive(type = null, college = null) {
        const filters = { is_active: true };
        if (type) filters.type = type;
        if (college) filters.college = college;

        return this.findAll({
            filters,
            orderBy: "order_index",
            orderDirection: "asc",
        });
    }

    async countActive() {
        return this.count({ is_active: true });
    }
}
