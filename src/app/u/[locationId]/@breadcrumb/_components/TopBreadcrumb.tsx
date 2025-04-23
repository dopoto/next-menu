import { HomeIcon } from 'lucide-react';
import { Fragment } from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage as BreadcrumbPageComponent,
    BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { type LocationId } from '~/domain/location';
import { type NavItem } from '~/lib/nav';
import { ROUTES, type UserRouteFn } from '~/lib/routes';

export function TopBreadcrumb(props: { items: NavItem[]; currentItem?: NavItem; locationId: LocationId }) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {props.currentItem?.route && (
                    <>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href={ROUTES.my}>
                                <HomeIcon size={16} />
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                    </>
                )}
                {props.items.map((item, index) => {
                    const isLast = index === props.items.length - 1;
                    if (!item.title) return null;

                    return (
                        <Fragment key={item.id}>
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPageComponent className="capitalize">
                                        {item.title}
                                    </BreadcrumbPageComponent>
                                ) : (
                                    item.route && (
                                        <BreadcrumbLink href={(item.route as UserRouteFn)(props.locationId)}>
                                            {item.title}
                                        </BreadcrumbLink>
                                    )
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator />}
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
