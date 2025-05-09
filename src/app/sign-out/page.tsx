import { SignOutButton } from '@clerk/nextjs';
import { SplitScreenContainer } from '~/components/SplitScreenContainer';
import { Button } from '~/components/ui/button';
import { APP_CONFIG } from '~/config/app-config';

export const metadata = {
    title: `${APP_CONFIG.appName} - Sign out`,
};

// TODO Sign out does not work

export default async function SignOutPage() {
    return (
        <SplitScreenContainer
            mainComponent={
                <>
                    <p>Click the button below to log out of your account.</p>
                    <SignOutButton redirectUrl='/'>
                        <Button>Sign out</Button>
                    </SignOutButton>
                </>
            }
            title={'Sign out'}
            subtitle={'Hope to see you again soon!'}
        ></SplitScreenContainer>
    );
}
