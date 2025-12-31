import { SupabaseRepository } from "../SupabaseRepository.js";

export class OfficerRepository extends SupabaseRepository {
    constructor(client) {
        super(client, "officers");
    }

    async getActive(branch = null) {
        const filters = { is_active: true };
        if (branch) filters.branch = branch;

        return this.findAll({
            filters,
            orderBy: "order_index",
            orderDirection: "asc",
        });
    }
}
