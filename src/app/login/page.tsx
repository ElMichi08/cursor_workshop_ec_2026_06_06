import { SignInForm } from "@/components/marketlab/auth-forms";

export const metadata = {
  title: "Sign in | MarketLab",
  description: "Sign in to MarketLab with your workshop account.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-12">
      <SignInForm />
    </div>
  );
}
