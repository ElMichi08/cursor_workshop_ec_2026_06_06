import Image from "next/image";

import { Header } from "@/components/marketlab/header";

export default function Home() {
  return (
    <div className="min-h-svh bg-[#080a0d] text-white">
      <Header />

      <main className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#080a0d_0%,#10151d_54%,#08120f_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00d395]/60 to-transparent" />

        <section className="relative mx-auto flex min-h-[calc(100svh-6.5rem)] max-w-6xl items-center justify-center px-4 py-14 text-center">
          <div className="mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="mx-auto mb-8 w-44 overflow-hidden rounded-[1.75rem] border border-white/10 bg-zinc-900 shadow-2xl shadow-[#00d395]/15 sm:w-56">
              <Image
                alt="Cursor Quito event mark"
                className="h-auto w-full"
                height={1080}
                priority
                src="/quito.png"
                width={1080}
              />
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#00d395]">
              Cursor Workshop / Quito
            </p>
            <h1 className="mx-auto mt-4 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-tight sm:text-7xl">
              MarketLab is ready.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
              Welcome to the Cursor workshop in Quito. Your local setup is
              running, and we will build the prediction market from here.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
