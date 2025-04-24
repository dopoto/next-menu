import { PlanSelector } from '~/app/u/plan/change/_components/PlanSelector';
import { SplitScreenContainer } from '~/components/SplitScreenContainer';
import { APP_CONFIG } from '~/config/app-config';

export const metadata = {
    title: `${APP_CONFIG.appName} - Change plan > Select your next plan`,
};

export default function ChangePlanPage() {
    return (
        <SplitScreenContainer
            mainComponent={<PlanSelector />}
            title={'Change your plan'}
            subtitle={'Please select a new plan below'}
        ></SplitScreenContainer>
    );
}
