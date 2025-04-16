import type { Meta, StoryObj } from '@storybook/react';
import { Labeled } from '~/app/_components/Labeled';

const meta: Meta<typeof Labeled> = {
    title: 'Components/Labeled',
    component: Labeled,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Labeled>;

export const Default: Story = {
    args: {
        label: 'Some label',
        text: 'Some value',
    },
};
