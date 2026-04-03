interface Props {
  badge?:    string;
  title:     string;
  subtitle?: string;
  center?:   boolean;
}

export default function SectionHeader({ badge, title, subtitle, center }: Props) {
  return (
    <div className={center ? "text-center" : ""}>
      {badge && (
        <span className="badge-ocean inline-block mb-3">
          {badge}
        </span>
      )}
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}