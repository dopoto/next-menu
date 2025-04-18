import { SplitScreenContainer } from '~/app/_components/SplitScreenContainer';
import { APP_CONFIG } from '~/app/_config/app-config';
import { PlanSelector } from '../_components/PlanSelector';

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
