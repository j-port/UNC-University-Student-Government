import { SupabaseRepository } from "../SupabaseRepository.js";

export class IssuanceRepository extends SupabaseRepository {
    constructor(client) {
        super(client, "issuances");
    }

    async findByStatus(status) {
        return this.findAll({
            filters: { status },
            orderBy: "created_at",
            orderDirection: "desc",
        });
    }
}
