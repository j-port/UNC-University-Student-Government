import { SupabaseRepository } from "../SupabaseRepository.js";

export class GovernanceDocumentRepository extends SupabaseRepository {
    constructor(client) {
        super(client, "governance_documents");
    }

    async getActive(type = null) {
        const filters = { is_active: true };
        if (type) filters.type = type;

        return this.findAll({
            filters,
            orderBy: "order_index",
            orderDirection: "asc",
        });
    }
}
