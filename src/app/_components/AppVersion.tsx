import Link from 'next/link';
import { ROUTES } from '../../lib/routes';
import { getAppVersion } from '../_utils/app-version-utils';

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
