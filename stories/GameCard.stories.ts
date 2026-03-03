import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SupportedGames from "../app/supported_games//components/GameCard";

const meta = {
    component: SupportedGames,
    args: {
        headers: "This is my card header it can get longer as well",
        context:
            "This is my card content as it gets longer and logner and longer and longer",
        rules:["these are the rules"]
    },
} satisfies Meta<typeof SupportedGames>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
