export function PageHeader({
  title,
  description,
  action
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold leading-tight text-leaf-900">{title}</h1>
        {description ? <p className="mt-2 leading-6 text-leaf-900/70">{description}</p> : null}
      </div>
      {action ? <div className="min-w-0 max-w-full sm:w-auto sm:shrink-0">{action}</div> : null}
    </header>
  );
}
