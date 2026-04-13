import { SettingsBoard } from "@/components/settings/settings-board";
import { updateFamilyPreferencesAction } from "@/app/(app)/settings/actions";
import { getCurrentAppContext } from "@/lib/repositories/app-context";
import { getFamilyPreferences } from "@/lib/repositories/family-preferences";

export default async function SettingsPage() {
  const context = await getCurrentAppContext();
  const preferences = await getFamilyPreferences(context.familyId);

  return <SettingsBoard familyName={context.familyName} preferences={preferences} action={updateFamilyPreferencesAction} />;
}
