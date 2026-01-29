import { SupabaseRepository } from "../SupabaseRepository.js";

export class FinancialTransactionRepository extends SupabaseRepository {
    constructor(client) {
        super(client, "financial_transactions");
    }

    async getTotalBudget() {
        return this.sum("amount");
    }
}
