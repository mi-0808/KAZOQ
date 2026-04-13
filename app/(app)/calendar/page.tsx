import { CalendarBoard } from "@/components/calendar/calendar-board";
import { getCalendarBoardData } from "@/lib/repositories/calendar";

export default async function CalendarPage() {
  const data = await getCalendarBoardData();

  return <CalendarBoard data={data} />;
}
