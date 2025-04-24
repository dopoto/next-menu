import { SignOutButton } from '@clerk/nextjs';
import { SplitScreenContainer } from '~/app/_components/SplitScreenContainer';
import { APP_CONFIG } from '~/app/_config/app-config';
import { Button } from '~/components/ui/button';

export const metadata = {
    title: `${APP_CONFIG.appName} - Sign out`,
};

export default async function SignOutPage() {
    return (
        <SplitScreenContainer
            mainComponent={
                <>
                    <p>Click the button below to log out of your account.</p>
                    <SignOutButton>
                        <Button>Sign out</Button>
                    </SignOutButton>
                </>
            }
            title={'Sign out'}
            subtitle={'Hope to see you again soon!'}
        ></SplitScreenContainer>
    );
}
