import { SignUpForm } from "@/components/marketlab/auth-forms";

export const metadata = {
  title: "Sign up | MarketLab",
  description: "Create a MarketLab account for the workshop.",
};

export default function SignUpPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-12">
      <SignUpForm />
    </div>
  );
}
