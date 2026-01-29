import { SupabaseRepository } from "../SupabaseRepository.js";

export class FeedbackRepository extends SupabaseRepository {
    constructor(client) {
        super(client, "feedback");
    }

    async getAll() {
        return this.findAll({
            orderBy: "created_at",
            orderDirection: "desc",
        });
    }

    async createWithReference(feedbackData) {
        // Create feedback first
        const feedback = await this.create(feedbackData);

        // Generate reference number
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const random = String(Math.floor(Math.random() * 100)).padStart(2, "0");
        const referenceNumber = `TNG-${dateStr}-${hours}${minutes}${random}`;

        // Update with reference number
        return this.update(feedback.id, { reference_number: referenceNumber });
    }

    async findByReference(referenceNumber) {
        return this.findOne({ reference_number: referenceNumber });
    }

    async getNewFeedbackSince(timestamp) {
        return this.findByCondition("created_at", "gte", timestamp);
    }
}
