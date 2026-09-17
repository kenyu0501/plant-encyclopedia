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
    <header className="flex min-w-0 flex-col gap-5 border-b border-leaf-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="section-kicker mb-3">TROPICAL FRUIT FIELD GUIDE</p>
        <h1 className="display-serif text-3xl font-bold leading-tight text-leaf-900 sm:text-[2.5rem]">{title}</h1>
        {description ? <p className="mt-2.5 leading-7 text-leaf-900/65">{description}</p> : null}
      </div>
      {action ? <div className="min-w-0 max-w-full sm:w-auto sm:shrink-0">{action}</div> : null}
    </header>
  );
}
