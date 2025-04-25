import api from "./axiosInstance";

export type ChatMessage = {
  id: number;
  message: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
  };
};

export const fetchGroupMessages = async (
  groupId: number,
): Promise<ChatMessage[]> => {
  const res = await api.get(`/group-chat-message/${groupId}`);
  return res.data.data;
};

export const sendGroupMessage = async (
  groupId: number,
  userId: number,
  message: string,
): Promise<void> => {
  await api.post("/group-chat-message", {
    groupId,
    userId,
    message,
  });
};
