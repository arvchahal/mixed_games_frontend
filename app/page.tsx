import Link from "next/link";
import HomeCard from "./components/HomeCard";
import NavBar from "./components/NavBar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen dark:bg-[#151515]">
      <NavBar src="/cardlogo.svg" />

      <main className="flex flex-1 w-full max-w-5xl mx-auto flex-row gap-12 py-24 px-16">
        <div className="flex flex-col gap-8 flex-1">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold text-white">Mixed Games</h1>
            <p className="text-gray-400 text-base">
              Free, no download. Play niche card games with friends via a shared link, no account required.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/room">
              <div className="p-3 rounded-lg border-2 border-violet-500 w-56 flex justify-center bg-violet-700 text-white cursor-pointer hover:bg-violet-600 text-base font-medium">
                Start a new game
              </div>
            </Link>
            <Link href="/join">
              <div className="p-3 rounded-lg border-2 border-gray-600 w-56 flex justify-center text-gray-300 cursor-pointer hover:bg-gray-800 text-base transition-colors">
                Join a game
              </div>
            </Link>
            <Link href="/supported_games">
              <div className="p-3 rounded-lg border-2 border-violet-500 w-56 flex justify-center text-violet-300 cursor-pointer hover:bg-violet-900/30 text-base">
                Supported games & rules
              </div>
            </Link>
          </div>

          <div className="flex flex-col gap-3 text-sm text-gray-400">
            <div className="flex items-start gap-2">
              <span className="text-violet-400 mt-0.5">✓</span>
              <span>No account needed</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-violet-400 mt-0.5">✓</span>
              <span>Share a link to invite friends instantly</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-violet-400 mt-0.5">✓</span>
              <span>Real-time multiplayer with live chip tracking</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-violet-400 mt-0.5">✓</span>
              <span>Currently supporting Indian Poker — more games coming</span>
            </div>
          </div>

          <p className="text-xs text-gray-600 max-w-sm">
            Mixed Games is a free platform that only uses play chips with no monetary value. No real money gambling. For entertainment purposes only.
          </p>
        </div>

        <div className="flex flex-col flex-1 justify-start pt-2 gap-0">
          <HomeCard
            header="Indian Poker"
            context="Each player holds one card to their forehead, visible to everyone but themselves. Bet, bluff, and read the table. No-limit betting with full chip tracking across rounds."
          />
          <HomeCard
            header="Screw Your Neighbor — coming soon"
            context="Players try to avoid holding the lowest card at the table. Trade or block — but the dealer always has the deck. Fast, chaotic, and brutal on the last chip."
          />
        </div>
      </main>

      <footer className="text-center text-xs text-gray-600 py-6 border-t border-gray-800">
        Mixed Games · Free to play · No real money · <Link href="/terms" className="hover:text-gray-400">Terms</Link> · <Link href="/privacy" className="hover:text-gray-400">Privacy</Link>
      </footer>
    </div>
  );
}
