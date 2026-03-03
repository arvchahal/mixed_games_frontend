import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import HomeCard from "../app/components/HomeCard";

const meta = {
    component: HomeCard,
    args: {
        header: "This is my card header it can get longer as well",
        context:
            "This is my card content as it gets longer and logner and longer and longer",
    },
} satisfies Meta<typeof HomeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
