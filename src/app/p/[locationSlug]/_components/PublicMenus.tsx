import { PublicMenu } from '~/app/p/[locationSlug]/_components/PublicMenu';
import StickyTabs, { type Section } from '~/app/p/[locationSlug]/_components/StickyTabs';
import { type CurrencyId } from '~/domain/currencies';
import { type LocationId } from '~/domain/locations';
import { MenuModeId } from '~/domain/menu-modes';
import { getPublicMenusByLocation } from '~/server/queries/menus';

export async function PublicMenus(props: { locationId: LocationId; menuMode: MenuModeId; currencyId: CurrencyId }) {
    const menus = await getPublicMenusByLocation(props.locationId);
    const sections: Section[] = menus.map((m) => {
        return {
            id: m.id.toString(),
            title: m.name ?? '',
            content: (
                <PublicMenu
                    name={m.name ?? ''}
                    items={m.items}
                    currencyId={props.currencyId}
                    menuMode={props.menuMode}
                />
            ),
        };
    });
    return <StickyTabs sections={sections} />;
}
