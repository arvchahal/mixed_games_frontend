import React from 'react'
import GameCard from "./components/GameCard";
import {GAMES} from "./games"

const SupportedGames = () => {
  return (
    <div className="flex flex-col max-w-2xl mx-auto py-16 px-8 gap-2">
      <h1 className="text-3xl font-bold text-white mb-4">Supported Games & Rules</h1>
      {GAMES.map((game) => (
        <GameCard key={game.name} headers={game.name} context={game.description} rules={game.rules} />
      ))}
    </div>
  );
};

export default SupportedGames
