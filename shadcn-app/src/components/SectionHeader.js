export default function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="space-y-2">
      {eyebrow && <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</p>}
      <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}
