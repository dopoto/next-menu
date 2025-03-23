export const LandingSectionTitle = (props: {
  label: string;
  title: string;
  secondary: string;
}) => {
  return (
    <div className="text-center">
      <h2 className="heading-label">{props.label}</h2>
      <p className="heading-main">{props.title}</p>
      <p className="heading-secondary">{props.secondary}</p>
    </div>
  );
};
