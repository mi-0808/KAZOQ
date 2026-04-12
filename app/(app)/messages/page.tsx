import { listMessages } from "@/lib/repositories/messages";
import { getProfileBoardData } from "@/lib/repositories/profiles";
import { MessageTimeline } from "@/components/messages/message-timeline";
import { RealtimeRefresh } from "@/components/shared/realtime-refresh";

export default async function MessagesPage() {
  const [messages, profileBoard] = await Promise.all([listMessages(), getProfileBoardData()]);

  return (
    <>
      <RealtimeRefresh tables={["messages", "message_reads", "profiles"]} />
      <MessageTimeline messages={messages} profiles={profileBoard.profiles} />
    </>
  );
}
