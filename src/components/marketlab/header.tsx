import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-white/10 bg-[#080a0d] text-white">
      <div className="mx-auto flex max-w-6xl px-4 py-5">
        <div>
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            MarketLab
          </Link>
          <p className="mt-1 text-sm text-zinc-400">Cursor Workshop Quito</p>
        </div>
      </div>
    </header>
  );
}
