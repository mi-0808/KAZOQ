import { listMessages, markMessagesAsRead } from "@/lib/repositories/messages";
import { getProfileBoardData } from "@/lib/repositories/profiles";
import { MessageTimeline } from "@/components/messages/message-timeline";
import { RealtimeRefresh } from "@/components/shared/realtime-refresh";
import { getCurrentAppContext } from "@/lib/repositories/app-context";

export default async function MessagesPage() {
  const context = await getCurrentAppContext();
  const [messages, profileBoard] = await Promise.all([listMessages(), getProfileBoardData()]);

  await markMessagesAsRead({
    messageIds: messages.map((message) => message.id),
    userId: context.appUserId
  });

  const hydratedMessages = messages.map((message) => ({
    ...message,
    readBy: message.readBy.includes(context.appUserId) ? message.readBy : [...message.readBy, context.appUserId],
    isRead: true
  }));

  return (
    <>
      <RealtimeRefresh tables={["messages", "message_reads", "profiles"]} />
      <MessageTimeline messages={hydratedMessages} profiles={profileBoard.profiles} currentUserId={context.appUserId} />
    </>
  );
}
