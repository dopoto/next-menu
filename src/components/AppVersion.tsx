import Link from 'next/link';
import { getAppVersion } from '~/lib/app-version-utils';
import { ROUTES } from '~/lib/routes';

export function AppVersion() {
    return (
        <div className="my-auto">
            <Link href={ROUTES.home} className="hover:underline">
                <i>the</i>
                <span className="text-gray-600 dark:text-gray-400">Menu</span>
            </Link>{' '}
            v{getAppVersion()}
        </div>
    );
}
