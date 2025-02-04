import { 
  createUser, 
  updateUser, 
  deleteUser 
} from "@/lib/database/actions/user.actions";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Validate headers
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- missing Svix headers", {
      status: 400,
    });
  }

  // Parse request body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Initialize webhook verification
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", { status: 400 });
  }

  const eventType = evt.type;
  console.log(evt.data)

  // CREATE USER
  if (eventType === "user.created") {
    const { 
      id, 
      email_addresses, 
      first_name,
      last_name,
      image_url,
      unsafe_metadata,
    } = evt.data;

    const user = {
      clerkId: id,
      email: email_addresses[0]?.email_address || null,
      firstName:first_name || "",
      lastName:last_name || "",
      image : image_url || null,
      phoneNumber:unsafe_metadata.phone || null, // Primary phone number
      whatsapp: unsafe_metadata.whatsapp || null, // Use second phone if available
      zipCode: unsafe_metadata.zipCode || null,
      country: unsafe_metadata.country || null,
    };

    const newUser = await createUser(user);

    return NextResponse.json({ 
      message: "User created successfully", 
      user: newUser, 
      success: true 
    });
  }

  // UPDATE USER
  if (eventType === "user.updated") {
    const { 
      id, 
      image_url, 
      first_name, 
      last_name, 
      unsafe_metadata
    } = evt.data;

    const user = {
      firstName:first_name || "",
      lastName:last_name || "",
      image : image_url || null,
      phoneNumber:unsafe_metadata.phone || null, // Primary phone number
      whatsapp: unsafe_metadata.whatsapp || null, // Use second phone if available
      zipCode: unsafe_metadata.zipCode || null,
      country: unsafe_metadata.country || null,
    };

    const updatedUser = await updateUser(id, user);

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
      success: true,
    });
  }

  // DELETE USER
  if (eventType === "user.deleted") {
    const { id } = evt.data;

    if (!id) {
      return new Response("User ID is required", { status: 400 });
    }

    const deletedUser = await deleteUser(id);

    return NextResponse.json({
      message: "User deleted successfully",
      user: deletedUser,
      success: true,
    });
  }

  return new Response("", { status: 200 });
}