import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "USG API is running" });
});

// Feedback endpoints
app.get("/api/feedback", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("feedback")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/api/feedback", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("feedback")
            .insert([req.body])
            .select();

        if (error) throw error;

        // Generate reference number
        if (data && data[0]) {
            const now = new Date();
            const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            const random = String(Math.floor(Math.random() * 100)).padStart(
                2,
                "0"
            );
            const referenceNumber = `TNG-${dateStr}-${hours}${minutes}${random}`;

            // Update with reference number
            const { data: updatedData, error: updateError } = await supabase
                .from("feedback")
                .update({ reference_number: referenceNumber })
                .eq("id", data[0].id)
                .select();

            if (updateError) throw updateError;
            res.json({ success: true, data: updatedData });
        } else {
            res.json({ success: true, data });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put("/api/feedback/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from("feedback")
            .update(req.body)
            .eq("id", id)
            .select();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete("/api/feedback/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from("feedback").delete().eq("id", id);

        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get("/api/feedback/track/:referenceNumber", async (req, res) => {
    try {
        const { referenceNumber } = req.params;
        const { data, error } = await supabase
            .from("feedback")
            .select("*")
            .eq("reference_number", referenceNumber)
            .single();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Announcements endpoints
app.get("/api/announcements", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("announcements")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/api/announcements", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("announcements")
            .insert([req.body])
            .select();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Officers endpoints
app.get("/api/officers", async (req, res) => {
    try {
        const { branch } = req.query;
        let query = supabase
            .from("officers")
            .select("*")
            .eq("is_active", true)
            .order("order_index", { ascending: true });

        if (branch) {
            query = query.eq("branch", branch);
        }

        const { data, error } = await query;
        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/api/officers", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("officers")
            .insert([req.body])
            .select();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put("/api/officers/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from("officers")
            .update(req.body)
            .eq("id", id)
            .select();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete("/api/officers/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from("officers").delete().eq("id", id);

        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Organizations endpoints
app.get("/api/organizations", async (req, res) => {
    try {
        const { type, college } = req.query;
        let query = supabase
            .from("organizations")
            .select("*")
            .eq("is_active", true)
            .order("order_index", { ascending: true });

        if (type) query = query.eq("type", type);
        if (college) query = query.eq("college", college);

        const { data, error } = await query;
        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/api/organizations", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("organizations")
            .insert([req.body])
            .select();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put("/api/organizations/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from("organizations")
            .update(req.body)
            .eq("id", id)
            .select();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Committees endpoints
app.get("/api/committees", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("committees")
            .select("*")
            .eq("is_active", true)
            .order("order_index", { ascending: true });

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/api/committees", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("committees")
            .insert([req.body])
            .select();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put("/api/committees/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from("committees")
            .update(req.body)
            .eq("id", id)
            .select();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Governance Documents endpoints
app.get("/api/governance-documents", async (req, res) => {
    try {
        const { type } = req.query;
        let query = supabase
            .from("governance_documents")
            .select("*")
            .eq("is_active", true)
            .order("order_index", { ascending: true });

        if (type) query = query.eq("type", type);

        const { data, error } = await query;
        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/api/governance-documents", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("governance_documents")
            .insert([req.body])
            .select();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put("/api/governance-documents/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from("governance_documents")
            .update(req.body)
            .eq("id", id)
            .select();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Site Content endpoints
app.get("/api/site-content", async (req, res) => {
    try {
        const { section } = req.query;
        let query = supabase
            .from("site_content")
            .select("*")
            .eq("is_active", true)
            .order("order_index", { ascending: true });

        if (section) query = query.eq("section", section);

        const { data, error } = await query;
        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/api/site-content", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("site_content")
            .upsert([req.body], { onConflict: "section,key" })
            .select();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Page Content endpoints
app.get("/api/page-content/:slug", async (req, res) => {
    try {
        const { slug } = req.params;
        const { data, error } = await supabase
            .from("page_content")
            .select("*")
            .eq("page_slug", slug)
            .single();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/api/page-content", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("page_content")
            .upsert([req.body], { onConflict: "page_slug" })
            .select();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});
