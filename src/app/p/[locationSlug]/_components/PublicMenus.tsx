import ContentTabs, { Section } from '~/app/p/[locationSlug]/_components/ContentTabs';
import { PublicMenu } from '~/app/p/[locationSlug]/_components/PublicMenu';
import { LocationId } from '~/domain/locations';
import { getPublicMenusByLocation } from '~/server/queries/menus';

export async function PublicMenus(props: { locationId: LocationId }) {
    const menus = await getPublicMenusByLocation(props.locationId);
    const sections: Section[] = menus.map((m) => {
        return {
            id: m.id.toString(),
            title: m.name ?? '',
            content: <PublicMenu name={m.name ?? ''} items={m.items}/>,
        };
    });
    return <ContentTabs sections={sections} />;
}
