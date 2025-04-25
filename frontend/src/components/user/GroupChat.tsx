import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useChatSocket } from "../../api/useChatSocket";
import { useAuth } from "../../hooks/useAuth";
import { ChatMessage, fetchGroupMessages } from "../../api/chatApi";
import { EventGroupType, getUserGroups } from "../../api/eventGroupApi";

export default function GroupChat() {
  const { id } = useParams<{ id: string }>();
  const user = useAuth().user;
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [groups, setGroups] = useState<EventGroupType[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user groups
        const groupsData = await getUserGroups(Number(id));
        setGroups(groupsData);
      } catch (error) {
        console.error("Error getting user groups:", error);
      }

      try {
        // Fetch messages for the current group
        const messagesData = await fetchGroupMessages(Number(id));
        setMessages(messagesData);
        scrollToBottom();
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchData();
  }, [id, user?.sub]);

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const onNewMessage = (msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
    scrollToBottom();
  };

  const { sendMessage } = useChatSocket(Number(id), onNewMessage);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    sendMessage({
      groupId: Number(id),
      userId: user?.sub,
      message: newMessage,
    });
    setNewMessage("");
  };

  const handleGroupSelect = (groupId: number) => {
    navigate(`/user/user/chat/${groupId}`);
  };

  return (
    <div className="flex h-screen w-full max-w-[664px] mx-auto bg-gray-100">
      {/* Unified Panel with Vertical Margins */}
      <div className="flex flex-1 my-4 bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-lg shadow-md">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 rounded-l-lg overflow-y-auto">
          <div className="p-3 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Chats</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {groups.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                You have no chats yet
              </div>
            ) : (
              groups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => handleGroupSelect(group.id)}
                  className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                    group.id === Number(id) ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-base font-medium text-gray-800">
                      {group.title}
                    </h3>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-col flex-1 max-w-[400px] bg-gradient-to-b from-gray-50 to-gray-100 rounded-r-lg">
          {/* Header */}
          <div className="px-3 py-2 bg-white border-b border-gray-200 rounded-tr-lg">
            <h2 className="text-lg font-semibold text-gray-800">Group Chat</h2>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 bg-white/90 backdrop-blur-sm">
            {messages.map((msg) => {
              const isMine = msg.user.id === user?.sub;
              return (
                <div
                  key={msg.id}
                  className={`flex ${
                    isMine ? "justify-end" : "justify-start"
                  } animate-fade-in`}
                >
                  <div
                    className={`relative rounded-xl px-3 py-1.5 text-sm max-w-[70%] group ${
                      isMine
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    } shadow-sm transition-all duration-200`}
                  >
                    <div className="flex items-baseline gap-1.5">
                      {!isMine && (
                        <span className="text-sm font-medium text-gray-600">
                          {msg.user.username}
                        </span>
                      )}
                      <span
                        className={`text-sm ${
                          isMine ? "text-blue-100" : "text-gray-500"
                        } opacity-0 group-hover:opacity-100 transition-opacity`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="mt-0.5">{msg.message}</div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div className="sticky bottom-0 p-3 bg-white border-t border-gray-200 rounded-br-lg shadow-inner">
            <div className="flex items-center gap-2">
              <input
                className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                aria-label="Type a message"
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 active:scale-95 transition-all duration-200"
                aria-label="Send message"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
