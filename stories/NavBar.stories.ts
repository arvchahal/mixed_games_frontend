import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import NavBar from "../app/components/NavBar";

const meta = {
    component: NavBar,
    args: {
        src:"/cardlogo.svg"
    },
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
