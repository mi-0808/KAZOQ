import { DiaryBoard } from "@/components/diary/diary-board";
import { getDiaryBoardData } from "@/lib/repositories/diary";

export default async function DiaryPage() {
  const data = await getDiaryBoardData();

  return <DiaryBoard data={data} />;
}
