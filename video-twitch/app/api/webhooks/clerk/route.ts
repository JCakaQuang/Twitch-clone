import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/src';
import { users } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not set');
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to your .env file');
  }

  // Get the headers from the request
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, return error
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing Svix headers:', { svix_id, svix_timestamp, svix_signature });
    return new Response('Missing headers', { status: 400 });
  }

  // Get the body from the request
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // If there is no body, return error
  if (!body) {
    console.error('Missing request body');
    return new Response('Missing body', { status: 400 });
  }

  // Create a new Svix webhook instance
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    // Verify the webhook event
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (error) {
    console.error('Webhook verification failed:', error);
    return new Response('Invalid webhook signature', { status: 400 });
  }

  // Get the type of the event
  const type = evt.type;

  if (type === 'user.created') {
    try {
      const userData = payload.data;
      console.log('Clerk user data:', userData); // Log the payload to inspect its structure

      // Validate required fields
      const id = userData.id;
      const externalUserId = userData.id;
      const username = userData.username ?? 'unknown';
      const imageUrl = userData.image_url ?? '';

      if (!id || !externalUserId) {
        throw new Error('Missing required fields (id or externalUserId) in Clerk payload');
      }

      // Insert into Turso database
      await db.insert(users).values({
        id,
        externalUserId,
        username,
        imageUrl,
        bio: '', // Optional field, default to empty string
      });

      console.log('User successfully inserted into Turso database:', { id, username });
    } catch (err) {
      console.error('Error inserting user into Turso database:', err);
      return new Response('Failed to insert user into database', { status: 500 });
    }
  }
  if (type === 'user.updated') {
    try {
      const userData = payload.data;
      console.log('Clerk user update data:', userData); // Log the payload to inspect its structure

      // Validate required fields
      const id = userData.id;
      const externalUserId = userData.id;
      const username = userData.username ?? 'unknown';
      const imageUrl = userData.image_url ?? '';

      if (!id || !externalUserId) {
        throw new Error('Missing required fields (id or externalUserId) in Clerk payload');
      }

      // Update in Turso database
      await db.update(users).set({
        username,
        imageUrl,
      }).where(eq(users.externalUserId, externalUserId));

      console.log('User successfully updated in Turso database:', { id, username });
    } catch (err) {
      console.error('Error updating user in Turso database:', err);
      return new Response('Failed to update user in database', { status: 500 });
    }
  }
  if (type === 'user.deleted') {
    try {
      const userData = payload.data;
      console.log('Clerk user deletion data:', userData); // Log the payload to inspect its structure

      // Validate required fields
      const id = userData.id;
      const externalUserId = userData.id;

      if (!id || !externalUserId) {
        throw new Error('Missing required fields (id or externalUserId) in Clerk payload');
      }

      // Delete from Turso database
      await db.delete(users).where(eq(users.externalUserId, externalUserId));

      console.log('User successfully deleted from Turso database:', { id });
    } catch (err) {
      console.error('Error deleting user from Turso database:', err);
      return new Response('Failed to delete user from database', { status: 500 });
    }
  }

  return new Response('Webhook received successfully', { status: 200 });
}