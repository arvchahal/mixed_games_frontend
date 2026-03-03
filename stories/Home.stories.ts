import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Home from "../app/page";

const meta = {
    component: Home,
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
