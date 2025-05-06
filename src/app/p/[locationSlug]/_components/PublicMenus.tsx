import ContentTabs, { Section } from '~/app/p/[locationSlug]/_components/ContentTabs';
import { LocationId } from '~/domain/locations';
import { getPublicMenusByLocation } from '~/server/queries/menus';

export async function PublicMenus(props: { locationId: LocationId }) {
    const menus = await getPublicMenusByLocation(props.locationId);
    const sections: Section[] = menus.map((m) => {
        return {
            id: m.id.toString(),
            title: m.name ?? '',
            content: (
                <>
                    <h1>{m.name}</h1>
                    <div>1</div>
                    <div>2</div>
                    <div>3</div>
                    <div>4</div>
                </>
            ),
        };
    });
    return <ContentTabs sections={sections} />;
}
