import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// This Edge Function runs on Supabase's infrastructure.
// It will be triggered by a Database Webhook whenever a new user is inserted into auth.users.

// --- Environment Variables ---
// IMPORTANT: These variables will be set in the Supabase Dashboard for the function.
// For local testing with `supabase functions serve`, you can set them in a .env.local file
// or directly in your shell before running the command.
// NEVER hardcode sensitive keys in your code that will be deployed.

// Your Supabase Project URL (e.g., https://xyz.supabase.co)
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
// Your Supabase Service Role Key (found in Project Settings -> API Keys).
// This key grants full bypass RLS access and should ONLY be used in secure backend environments
// like Edge Functions or your server, NEVER on the client-side.
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// --- Edge Function Request Handler ---
serve(async (req) => {
  // Only accept POST requests, as webhooks send POST requests
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Create a Supabase client instance using the Service Role Key.
  // This allows the function to perform database operations with elevated privileges,
  // bypassing Row Level Security, which is necessary for inserting into 'profiles'
  // without a logged-in user context from auth.
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      // It's crucial to set persistSession to false in serverless functions
      // as there's no long-lived session to manage.
      persistSession: false,
    },
  });

  try {
    // Parse the incoming request body as JSON.
    // This payload contains the details of the database event (e.g., new user insertion).
    const payload = await req.json();

    // Log the incoming payload for debugging purposes (remove or secure in production)
    console.log("Received webhook payload:", JSON.stringify(payload, null, 2));

    // Check if the event is an INSERT operation on the 'users' table within the 'auth' schema.
    // This ensures we only process the relevant event for new user signups.
    if (
      payload.table === "users" &&
      payload.type === "INSERT" &&
      payload.schema === "auth"
    ) {
      const newUserData = payload.record; // The 'record' property contains the new row data from auth.users

      const { id, email, raw_user_meta_data } = newUserData;

      // Extract the 'full_name' from 'raw_user_meta_data'.
      // The 'raw_user_meta_data' is a JSONB column, so we use optional chaining
      // and provide a default of null if 'full_name' is not present in the metadata.
      const fullName = raw_user_meta_data?.full_name || null;

      // Perform the insertion into the 'public.profiles' table.
      // 'id' and 'email' are copied directly from the new user.
      // 'full_name' is from the user's metadata.
      // 'is_admin' is explicitly set to false for all new signups by default.
      const { error: insertError } = await supabaseAdmin
        .from("profiles")
        .insert({
          id: id,
          email: email,
          full_name: fullName,
          is_admin: false,
        });

      // Handle any errors during the insertion into 'profiles'.
      if (insertError) {
        console.error(
          "Error inserting into profiles table:",
          insertError.message
        );
        return new Response(JSON.stringify({ error: insertError.message }), {
          status: 500, // Internal Server Error if insertion fails
          headers: { "Content-Type": "application/json" },
        });
      }

      // Log success message.
      console.log(
        `Successfully created profile for user: ${email} (ID: ${id})`
      );

      // Return a success response to the webhook sender (Supabase).
      return new Response(
        JSON.stringify({ message: "Profile created successfully" }),
        {
          status: 200, // OK status for successful processing
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      // If the webhook event is not an INSERT on auth.users, log it and return OK.
      // This prevents unnecessary error logs for other types of auth.users events
      // or events from other tables if this webhook ever receives them.
      console.log(
        `Received non-user-insert webhook event: table=${payload.table}, type=${payload.type}, schema=${payload.schema}`
      );
      return new Response(
        JSON.stringify({
          message: "Event ignored (not an insert on auth.users)",
        }),
        {
          status: 200, // OK, as the function processed it, just didn't insert a profile
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    // Catch any unexpected errors during function execution.
    console.error("Unhandled Edge Function error:", error.message);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred." }),
      {
        status: 500, // Internal Server Error for unhandled exceptions
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
