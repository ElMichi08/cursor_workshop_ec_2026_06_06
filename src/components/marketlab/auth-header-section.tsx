import { AuthHeader } from "@/components/marketlab/auth-header";
import { getCurrentProfile } from "@/lib/profile/queries";

export async function AuthHeaderSection() {
  const { user, profile, error } = await getCurrentProfile();

  return <AuthHeader user={user} profile={profile} profileError={error} />;
}
