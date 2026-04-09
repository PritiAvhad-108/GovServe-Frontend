import React, { useEffect, useState } from "react";
import { getOfficerStatistics, getAllCases } from "../../../api/api";
import "./Officers.css";

const Officers = () => {
  const [officers, setOfficers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    busy: 0,
    activeCases: 0
  });

  const [page, setPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    loadOfficers();

    const handleFocus = () => {
      loadOfficers();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const loadOfficers = async () => {
    const [officerRes, caseRes] = await Promise.all([
      getOfficerStatistics(),
      getAllCases()
    ]);

    const cases = Array.isArray(caseRes.data) ? caseRes.data : [];

    const activeStatuses = ["Assigned", "Pending", "Under Verification"];

  const updatedOfficers = officerRes.data.map(officer => {
  const officerName = officer.officerName?.toLowerCase();

  const activeCount = cases.filter(c => {
    return (
      c.officerName?.toLowerCase() === officerName &&
      activeStatuses.includes(c.status)
    );
  }).length;

  return {
    ...officer,
    activeCases: activeCount
     };
     });

    setOfficers(updatedOfficers);

    const total = updatedOfficers.length;
    const busy = updatedOfficers.filter(o => o.activeCases >= 5).length;
    const available = total - busy;
    const totalActive = updatedOfficers.reduce(
      (sum, o) => sum + o.activeCases,
      0
    );

    setStats({
      total,
      available,
      busy,
      activeCases: totalActive
    });
  };

  const start = (page - 1) * recordsPerPage;
  const current = officers.slice(start, start + recordsPerPage);
  const totalPages = Math.ceil(officers.length / recordsPerPage);

  const getWorkload = cases => {
    if (cases >= 5) return "high";
    if (cases >= 3) return "medium";
    return "low";
  };

  return (
    <div className="officers-container">
      <h2>Officers</h2>
      <p>Manage and monitor case officers</p>

      <div className="officers-cards">
        <div className="officers-card">
          <h4>Total Officers</h4>
          <p>{stats.total}</p>
        </div>

        <div className="officers-card">
          <h4>Available</h4>
          <p className="officers-green">{stats.available}</p>
        </div>

        <div className="officers-card">
          <h4>Busy</h4>
          <p className="officers-red">{stats.busy}</p>
        </div>

        <div className="officers-card">
          <h4>Total Active Cases</h4>
          <p>{stats.activeCases}</p>
        </div>
      </div>

      <div className="officer-table">
        <h3>All Officers</h3>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Active</th>
              <th>Workload</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {current.map(o => (
              <tr key={o.officerId}>
                <td>OFF-{o.officerId}</td>
                <td>{o.officerName}</td>
                <td>{o.department}</td>
                <td>{o.activeCases}</td>
                <td>
                  <div className="officers-workload">
                    <div
                      className={`officers-bar officers-${getWorkload(
                        o.activeCases
                      )}`}
                    />
                  </div>
                </td>
                <td>
                  {o.activeCases >= 5 ? (
                    <span className="officers-status officers-busy">
                      Busy
                    </span>
                  ) : (
                    <span className="officers-status officers-available">
                      Available
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Officers;