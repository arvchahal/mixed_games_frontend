import React from 'react'
import GameCard from "./components/GameCard";
import {GAMES} from "./games"
import NavBar from "../components/NavBar";

const SupportedGames = () => {
  return (
    <div className="flex flex-col min-h-screen dark:bg-[#151515]">
      <NavBar src="/cardlogo.svg" />
      <main className="flex flex-col max-w-2xl w-full mx-auto py-16 px-8 gap-2">
        <h1 className="text-3xl font-bold text-white mb-4">Supported Games & Rules</h1>
        {GAMES.map((game) => (
          <GameCard key={game.name} headers={game.name} context={game.description} rules={game.rules} />
        ))}
      </main>
    </div>
  );
};

export default SupportedGames
