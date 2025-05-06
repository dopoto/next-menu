import { LocationId } from '~/domain/locations';
import { getPublicMenusByLocation } from '~/server/queries/menus';

export async function PublicMenus(props: { locationId: LocationId }) {
    const menus = await getPublicMenusByLocation(props.locationId);
    return (
        <>
            {menus.map((m) => (
                <div key={m.id}>{m.name}</div>
            ))}
        </>
    );
}
