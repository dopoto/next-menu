export function SeparatorWithText(props: { title: string }) {
    return (
        <div className="relative flex items-center py-5">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-800"></div>
            <span className="mx-4 flex-shrink text-gray-400">{props.title}</span>
            <div className="flex-grow border-t dark:border-gray-800"></div>
        </div>
    );
}
