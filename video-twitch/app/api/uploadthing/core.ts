import { createUploadthing, type FileRouter } from "uploadthing/next";

import { db } from "@/src";
import { getSelf } from "@/lib/auth-service";

import { eq } from "drizzle-orm";
import { streams } from "@/src/db/schema";

const f = createUploadthing();

export const ourFileRouter = {
  thumbnailUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const self = await getSelf();

      return { user: self };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Update stream thumbnail với Drizzle ORM
      await db
        .update(streams)
        .set({
          thumbnail: file.url,
        })
        .where(eq(streams.userId, metadata.user.id));

      return { fileUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
