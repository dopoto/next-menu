import { PageSubtitle } from '~/app/_components/PageSubtitle';
import { PageTitle } from '~/app/_components/PageTitle';

export function FormTitle(props: { title: string; subtitle: string }) {
    return (
        <div className="flex flex-col flex-nowrap pb-6">
            <PageTitle>{props.title}</PageTitle>
            <PageSubtitle textSize="sm">{props.subtitle}</PageSubtitle>
        </div>
    );
}
