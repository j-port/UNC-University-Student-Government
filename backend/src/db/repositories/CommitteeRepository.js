import { SupabaseRepository } from "../SupabaseRepository.js";

export class CommitteeRepository extends SupabaseRepository {
    constructor(client) {
        super(client, "committees");
    }

    async getActive() {
        return this.findAll({
            filters: { is_active: true },
            orderBy: "order_index",
            orderDirection: "asc",
        });
    }
}
