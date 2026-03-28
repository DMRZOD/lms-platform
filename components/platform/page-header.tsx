type PageHeaderProps = {
    title: string,
    description?: string,
    action?: React.JSX.Element
};

export function PageHeader({title, description, action}: PageHeaderProps) {
    return (
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {description && (
                <p className="mt-1 text-sm text-secondary-foreground">{description}</p>
            )}
        </div>
    );
}
