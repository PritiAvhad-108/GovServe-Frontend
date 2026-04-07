import React, { useState } from "react";
import Pagination from "../../../components/AdminComponents/common/Pagination";

export default function RecentCasesTable({ cases }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(cases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = cases.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="panel">
      <h3>Recent Cases</h3>

      <table className="table-white">
        <thead>
          <tr>
            <th>Case ID</th>
            <th>Application</th>
            <th>Service</th>
            <th>Department</th>
            <th>Officer</th>
            <th>Status</th>
            <th>Last Updated</th>
          </tr>
        </thead>

        <tbody>
          {currentData.length === 0 ? (
            <tr>
              <td colSpan="7" className="empty-msg">
                No recent cases available.
              </td>
            </tr>
          ) : (
            currentData.map((c) => (
              <tr key={c.caseId}>
                <td>{c.caseId}</td>
                <td>{c.applicationNumber}</td>
                <td>{c.serviceName}</td>
                <td>{c.departmentName}</td>
                <td>
                  {c.officerName}
                  <br />
                  <small>({c.officerDepartment})</small>
                </td>
                <td>
                  <span className={`case-status ${c.status.toLowerCase()}`}>
                    {c.status}
                  </span>
                </td>
                <td>
                  {new Date(c.lastUpdated).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
