import { supabase } from "./supabase";

/**
 * Submit user feedback
 */
export const submitFeedback = async (feedbackData) => {
    const { data, error } = await supabase
        .from("feedback")
        .insert([feedbackData]);

    return { data, error };
};
