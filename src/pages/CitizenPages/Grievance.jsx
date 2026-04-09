import { useState, useEffect } from "react";
import { MessageSquareWarning, Scale, Loader2 } from "lucide-react"; // Loader2 जोडला आहे
import "../../styles/CitizenStyles/pages/Grievance.css";
import RaiseGrievance from "./RaiseGrievance";
import FileAppeal from "./FileAppeal";
import GrievanceAndAppealDetails from "./GrievanceAndAppealDetails";

function GrievanceDashboard() {
  const [grievances, setGrievances] = useState([]);
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state जोडला
  const [showGrievanceForm, setShowGrievanceForm] = useState(false);
  const [showAppealForm, setShowAppealForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [grievancePage, setGrievancePage] = useState(0);
  const [appealPage, setAppealPage] = useState(0);
  const itemsPerPage = 2;


  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    if (!userId || userId === "undefined" || !token) {
      console.warn("GrievanceDashboard: Missing userId or Token");
      setLoading(false);
      return;
    }

    const requestHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    setLoading(true);

    
    Promise.all([
      fetch(`https://localhost:7027/api/Grievance/user/${userId}`, { headers: requestHeaders }),
      fetch(`https://localhost:7027/api/Appeal/user/${userId}`, { headers: requestHeaders })
    ])
      .then(async ([resGrievance, resAppeal]) => {
        if (!resGrievance.ok || !resAppeal.ok) throw new Error("Unauthorized access or API error");
        
        const gData = await resGrievance.json();
        const aData = await resAppeal.json();
        
        setGrievances(gData);
        setAppeals(aData);
      })
      .catch((err) => console.error("Error fetching dashboard data:", err))
      .finally(() => setLoading(false));

  }, [userId, token]);

  const paginatedGrievances = grievances.slice(
    grievancePage * itemsPerPage,
    (grievancePage + 1) * itemsPerPage
  );

  const paginatedAppeals = appeals.slice(
    appealPage * itemsPerPage,
    (appealPage + 1) * itemsPerPage
  );

  if (loading) {
    return <div className="loader-box"><Loader2 className="spin" /> Loading Dashboard...</div>;
  }

  return (
    <div className="content-wrapper">
      <h2>Grievance and Appeal</h2>

      <div className="top-cards">
        <div className="action-card grievance" onClick={() => setShowGrievanceForm(true)}>
          <div className="icon-bg"><MessageSquareWarning /></div>
          <h3>Raise Grievance</h3>
          <p>Submit a new grievance easily</p>
        </div>

        <div className="action-card appeal" onClick={() => setShowAppealForm(true)}>
          <div className="icon-bg"><Scale /></div>
          <h3>File Appeal</h3>
          <p>Submit an appeal for any grievance</p>
        </div>
      </div>

      {showGrievanceForm && <RaiseGrievance onClose={() => setShowGrievanceForm(false)} />}
      {showAppealForm && <FileAppeal onClose={() => setShowAppealForm(false)} />}

      {/* --- Grievances Section --- */}
      <div className="list-header grievance-header">
        <div className="header-left">
          <div className="icon-bg-small"><MessageSquareWarning /></div>
          <h3>My Grievances</h3>
        </div>
      </div>
      
      <div className="list-cards">
        {paginatedGrievances.length > 0 ? (
          paginatedGrievances.map((g, index) => (
            <div className="list-card full-width" key={g.grievanceId || index} onClick={() => setSelectedItem(g)}>
              <div className="card-header">
                <div className="card-header-left">
                  <div className="reason-row">
                    <div className="card-icon grievance"><MessageSquareWarning size={16} /></div>
                    <h4>{g.reason}</h4>
                  </div>
                </div>
                <span className={`status ${g.status?.toLowerCase() || 'pending'}`}>{g.status}</span>
              </div>
              <p className="submitted-date">Submitted: {new Date(g.filedDate).toLocaleDateString()}</p>
            </div>
          ))
        ) : <p className="no-data-msg">No grievances found.</p>}
      </div>
      
      <div className="pagination">
        <button disabled={grievancePage === 0} onClick={() => setGrievancePage(grievancePage - 1)}>Prev</button>
        <button disabled={(grievancePage + 1) * itemsPerPage >= grievances.length} onClick={() => setGrievancePage(grievancePage + 1)}>Next</button>
      </div>

      {/* --- Appeals Section --- */}
      <div className="list-header appeal-header">
        <div className="header-left">
          <div className="icon-bg-small"><Scale /></div>
          <h3>My Appeals</h3>
        </div>
      </div>

      <div className="list-cards">
        {paginatedAppeals.length > 0 ? (
          paginatedAppeals.map((a, index) => (
            <div className="list-card full-width" key={a.appealId || index} onClick={() => setSelectedItem(a)}>
              <div className="card-header">
                <div className="card-header-left">
                  <div className="reason-row">
                    <div className="card-icon appeal"><Scale size={16} /></div>
                    <h4>{a.reason}</h4>
                  </div>
                </div>
                <span className={`status ${a.status?.toLowerCase() || 'pending'}`}>{a.status}</span>
              </div>
              <p className="submitted-date">Submitted Date: {new Date(a.filedDate).toLocaleDateString()}</p>
            </div>
          ))
        ) : <p className="no-data-msg">No appeals found.</p>}
      </div>
      
      <div className="pagination">
        <button disabled={appealPage === 0} onClick={() => setAppealPage(appealPage - 1)}>Prev</button>
        <button disabled={(appealPage + 1) * itemsPerPage >= appeals.length} onClick={() => setAppealPage(appealPage + 1)}>Next</button>
      </div>

      {selectedItem && <GrievanceAndAppealDetails item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
}

export default GrievanceDashboard;