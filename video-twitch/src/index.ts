import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { usersTable } from './db/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const db = drizzle({
    connection: {
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!
    }
  });

  // // Thêm user
  // await db.insert(usersTable).values({
  //   name: 'John',
  //   age: 30,
  //   email: 'john@example.com'
  // });
  // console.log('User created!');

  // Đọc user
  const users = await db.select().from(usersTable);
  console.log('All users:', users);

  // // Cập nhật user
  // await db.update(usersTable)
  //   .set({ age: 31 })
  //   .where(eq(usersTable.email, 'john@example.com'));
  // console.log('User updated!');

  // Xóa user
//   await db.delete(usersTable)
//     .where(eq(usersTable.email, 'john@example.com'));
//   console.log('User deleted!');
}
main();
