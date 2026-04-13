import "../../../styles/GrievanceStyles/card.css";

const DashboardCard = ({ title, count, icon: Icon, active, onClick }) => {
  return (
    <div
      className={`card ${active ? "active-card" : ""}`}
      onClick={onClick}
    >
      {Icon && (
        <div className="card-icon">
          <Icon size={28} />
        </div>
      )}

      <h4>{title}</h4>
      <h2>{count}</h2>
    </div>
  );
};

export default DashboardCard;