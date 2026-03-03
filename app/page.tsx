import { Link } from "react-router-dom";
import HomeCard from "./components/HomeCard";
export default function Home() {
  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-5xl flex-row py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col gap-6 flex-1">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Start a New Game
          </h1>
          <h1>
            Supported Games & Rules
          </h1>
        </div>
        <div className="flex flex-col flex-1">
          <HomeCard header={"Home of fun Mixed Game"} context={"Welcome to MixedGames.net a site that is home to Indian Poker with support for more games comings soon"}></HomeCard>
        </div>
      </main>
    </div>
  );
}
