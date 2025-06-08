import moment from "moment";

import { getBlockedUsers } from "@/lib/block-service";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const CommunityPage = async () => {
  const blockedUsers = await getBlockedUsers();

  const formattedData = blockedUsers
    .filter((block) => block.blocked !== null) // Filter out null blocked users
    .map((block) => ({
      ...block,
      userId: block.blocked!.id,
      imageUrl: block.blocked!.imageUrl || "/default-avatar.png", // Provide default if imageUrl doesn't exist
      username: block.blocked!.username,
      createdAt: moment(block.createdAt).format("DD/MM/yyyy"), // Use block.createdAt instead of block.blocked.createdAt
    }));

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Community Settings</h1>
      </div>
      <DataTable columns={columns} data={formattedData} />
    </div>
  );
};

export default CommunityPage;