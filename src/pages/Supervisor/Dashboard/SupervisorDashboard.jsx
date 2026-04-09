import React, { useEffect, useState } from "react";
import "./SupervisorDashboard.css";
import {
  FaFolder,
  FaClock,
  FaUserCheck,
  FaCheckCircle,
  FaArrowUp,
  FaHourglassEnd
} from "react-icons/fa";
import {
  getCitizenByApplication,
  getSLABreachedCases,
  getApplications,
  getAllCases
} from "../../../api/api";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ added useLocation

const SupervisorDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ added

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    completed: 0,
    escalated: 0
  });

  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [slaBreached, setSlaBreached] = useState(0);
  const [slaCases, setSlaCases] = useState([]);
  const [slaPage, setSlaPage] = useState(1);

  const itemsPerPage = 5;
  const slaItemsPerPage = 5;

  // ✅ CHANGED: re-load dashboard whenever route changes
  useEffect(() => {
    loadDashboardStats();
    loadRecentApplications();
    loadActiveSLABreaches();
    loadSLABreachedCases();
  }, [location.pathname]);

  /* ---------------- DASHBOARD STATS ---------------- */

  const loadDashboardStats = async () => {
    try {
      const res = await getAllCases();
      const cases = Array.isArray(res.data) ? res.data : [];

      setStats({
        total: cases.length,
        pending: cases.filter(c => c.status === "Pending").length,
        assigned: cases.filter(c => c.status === "Assigned").length,
        completed: cases.filter(
          c => c.status === "Approved" || c.status === "Completed"
        ).length,
        escalated: cases.filter(c => c.status === "Escalated").length
      });
    } catch {
      setStats({
        total: 0,
        pending: 0,
        assigned: 0,
        completed: 0,
        escalated: 0
      });
    }
  };

  /* ---------------- ACTIVE SLA COUNT ---------------- */
const loadActiveSLABreaches = async () => {
  try {
    const [slaRes, caseRes] = await Promise.all([
      getSLABreachedCases(),
      getAllCases()
    ]);

    if (!Array.isArray(slaRes.data) || !Array.isArray(caseRes.data)) {
      setSlaBreached(0);
      return;
    }

    const escalatedCaseIds = new Set(
      caseRes.data
        .filter(c => c.status === "Escalated")
        .map(c => c.caseId)
    );

    const uniqueCaseIds = new Set();

    slaRes.data.forEach(row => {
      if (escalatedCaseIds.has(row.caseId)) {
        uniqueCaseIds.add(row.caseId);
      }
    });

    setSlaBreached(uniqueCaseIds.size);
  } catch {
    setSlaBreached(0);
  }
};

  /* ---------------- RECENT APPLICATIONS ---------------- */

  const loadRecentApplications = async () => {
    const [appRes, caseRes] = await Promise.all([
      getApplications(),
      getAllCases()
    ]);

    const caseLookup = {};
    caseRes.data.forEach(c => {
      caseLookup[c.applicationNumber] = c;
    });

    const updated = await Promise.all(
      appRes.data.map(async app => {
        let citizenName = "N/A";
        try {
          const citizen = await getCitizenByApplication(app.applicationId);
          citizenName = citizen.data.fullName;
        } catch {}

        const matchedCase = caseLookup[`APP-${app.applicationId}`];

        return {
          ...app,
          citizenName,
          caseId: matchedCase?.caseId ?? null
        };
      })
    );

    setApplications(updated);
  };

  /* ---------------- SLA BREACHED CASES ---------------- */
const loadSLABreachedCases = async () => {
  try {
    const [slaRes, caseRes] = await Promise.all([
      getSLABreachedCases(),
      getAllCases()
    ]);

    if (!Array.isArray(slaRes.data) || !Array.isArray(caseRes.data)) {
      setSlaCases([]);
      return;
    }

    // Step 1: collect escalated cases
    const escalatedCaseIds = new Set(
      caseRes.data
        .filter(c => c.status === "Escalated")
        .map(c => c.caseId)
    );

    // Step 2: remove duplicate SLA rows by caseId
    const uniqueMap = {};

    slaRes.data.forEach(row => {
      if (escalatedCaseIds.has(row.caseId) && !uniqueMap[row.caseId]) {
        uniqueMap[row.caseId] = row;
      }
    });

    // Step 3: set unique rows only
    setSlaCases(Object.values(uniqueMap));
  } catch {
    setSlaCases([]);
  }
};

  /* ---------------- PAGINATION ---------------- */

  const filteredApps = applications.filter(app =>
    app.applicationId.toString().includes(search)
  );

  const appStart = (page - 1) * itemsPerPage;
  const currentApps = filteredApps.slice(appStart, appStart + itemsPerPage);
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);

  const slaStart = (slaPage - 1) * slaItemsPerPage;
  const currentSla = slaCases.slice(slaStart, slaStart + slaItemsPerPage);
  const slaTotalPages = Math.ceil(slaCases.length / slaItemsPerPage);

  return (
    <div className="supervisor-dashboard-wrapper">

      {/* ================= CARDS ================= */}
      <div className="supervisor-cards">
        <div className="supervisor-card">
          <div className="icon-box blue"><FaFolder /></div>
          <h4>Total Cases</h4>
          <p>{stats.total}</p>
        </div>

        <div className="supervisor-card">
          <div className="icon-box orange"><FaClock /></div>
          <h4>Pending Cases</h4>
          <p>{stats.pending}</p>
        </div>

        <div className="supervisor-card">
          <div className="icon-box green"><FaUserCheck /></div>
          <h4>Assigned Cases</h4>
          <p>{stats.assigned}</p>
        </div>

        <div className="supervisor-card">
          <div className="icon-box blue"><FaCheckCircle /></div>
          <h4>Completed Cases</h4>
          <p>{stats.completed}</p>
        </div>

        <div
          className="supervisor-card clickable danger"
          onClick={() => navigate("/supervisor/escalations")}
        >
          <div className="icon-box red"><FaArrowUp /></div>
          <h4>Escalated Cases</h4>
          <p>{stats.escalated}</p>
        </div>

        <div className="supervisor-card clickable warning">
          <div className="icon-box red"><FaHourglassEnd /></div>
          <h4>SLA Breached</h4>
          <p>{slaBreached}</p>
        </div>
      </div>

      {/* ================= RECENT APPLICATIONS ================= */}
      <div className="supervisor-recent">
        <h2>Recent Applications</h2>

        <input
          className="supervisor-search"
          placeholder="Search by Application ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <table>
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Citizen Name</th>
              <th>Service</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentApps.map(app => (
              <tr key={app.applicationId}>
                <td>APP-{app.applicationId}</td>
                <td>{app.citizenName}</td>
                <td>{app.serviceName}</td>
                <td>
                  {app.caseId ? (
                    <span className="status-assigned">
                      Assigned to Officer
                    </span>
                  ) : (
                    <span className="status-received">Received</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="supervisor-pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      </div>

      {/* ================= SLA BREACHED CASES ================= */}
      {slaCases.length > 0 && (
        <div className="supervisor-recent">
          <h2>SLA Breached Cases</h2>

          <table>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Application ID</th>
                <th>Department ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentSla.map(c => (
                <tr key={c.caseId}>
                  <td>CASE-{c.caseId}</td>
                  <td>APP-{c.applicationID}</td>
                  <td>{c.departmentID}</td>
                  <td>
                    <span className="status-rejected">Breached</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="supervisor-pagination">
            <button
              disabled={slaPage === 1}
              onClick={() => setSlaPage(slaPage - 1)}
            >
              Previous
            </button>
            <span>Page {slaPage} of {slaTotalPages}</span>
            <button
              disabled={slaPage === slaTotalPages}
              onClick={() => setSlaPage(slaPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default SupervisorDashboard;