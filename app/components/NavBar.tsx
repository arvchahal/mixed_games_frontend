import React from 'react'
import Link from "next/link";
interface NavBarProps {
    src: string;

}

const NavBar = ({ src }: NavBarProps) => {
  return (
    <div className="flex flex-row items-center gap-8 px-16 py-3 border-b border-gray-800 bg-[#151515]">
        <Link href ="/">
            <img src={src} alt="logo" className="mr-10 w-30 h-20 cursor-pointer hover:opacity-70" />
        </Link>
        <Link href="/room">
        <div className="text-gray-400 text-sm cursor-pointer hover:text-white">New Game</div>
        </Link>
        <Link href="/supported_games">
        <div className="text-gray-400 text-sm cursor-pointer hover:text-white">Supported Games</div>
        </Link>
        <div className="ml-auto text-sm px-4 py-1.5 rounded-lg border border-violet-500 text-violet-300 cursor-pointer hover:bg-violet-900/30">Log-in</div>
    </div>
  )
}

export default NavBar
