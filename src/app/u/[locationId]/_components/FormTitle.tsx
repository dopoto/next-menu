import { PageSubtitle } from '~/components/PageSubtitle';
import { PageTitle } from '~/components/PageTitle';

export function FormTitle(props: { title: string; subtitle: string | React.ReactNode }) {
    return (
        <div className="flex flex-col flex-nowrap pb-6">
            <PageTitle>{props.title}</PageTitle>
            <PageSubtitle textSize="sm">{props.subtitle}</PageSubtitle>
        </div>
    );
}
