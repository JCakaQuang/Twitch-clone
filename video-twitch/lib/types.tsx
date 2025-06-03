export interface UserWithStream {
  id: string;
  username: string;
  imageUrl: string;
  createdAt: number;
  stream: { isLive: boolean } | null;
}