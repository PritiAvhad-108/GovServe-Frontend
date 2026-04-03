import React, { useState } from "react";
import Pagination from "../../../components/AdminComponents/common/Pagination";

export default function RecentApplicationsTable({ applications }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(applications.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = applications.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="panel">
      <h3>Recent Applications</h3>

      <table className="table table-white">
        <thead>
          <tr>
            <th>Application ID</th>
            <th>UserID</th>
            <th>Service</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {currentData.map(app => (
            <tr key={app.applicationId}>
              <td>App-{app.applicationNumber || app.applicationId}</td>
              <td>{app.userId}</td>
              <td>{app.serviceName}</td>
              <td>{app.applicationStatus}</td>
              <td>{new Date(app.submittedDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}