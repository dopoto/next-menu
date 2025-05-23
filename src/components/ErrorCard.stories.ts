import { type Meta, type StoryObj } from '@storybook/react';
import { ErrorCard } from '~/components/ErrorCard';
import { PUBLIC_ERROR_DELIMITER } from '~/domain/error-handling';

const meta: Meta<typeof ErrorCard> = {
    title: 'Components/ErrorCard',
    component: ErrorCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ErrorCard>;

const parameters = {
    nextjs: {
        appDirectory: true,
        router: {
            pathname: '/profile/[id]',
            asPath: '/profile/1',
            query: {
                id: '1',
            },
        },
    },
};
export const Default: Story = {
    parameters,
    args: {
        publicErrorMessage: `123456-abc${PUBLIC_ERROR_DELIMITER}Something went wrong`,
        errorDigest: 'abcde12345',
    },
};

export const UnknownError: StoryObj<typeof ErrorCard> = {
    parameters,
    args: {
        publicErrorMessage: undefined,
        errorDigest: 'unknown123',
    },
};
