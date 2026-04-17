import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Cases.css";
import { autoAssignCase, getApplications } from "../../../api/api";
 
const Cases = () => {
  const navigate = useNavigate();
 
  const [cases, setCases] = useState([]);
  const [applications, setApplications] = useState([]);
  const [departments, setDepartments] = useState([]);
 
  //  services & mapping
  const [services, setServices] = useState([]);
  const [serviceDeptMap, setServiceDeptMap] = useState({});
 
  const [assignData, setAssignData] = useState({
    applicationId: "",
    departmentId: ""
  });
 
  const [assignMessage, setAssignMessage] = useState("");
  const [assignType, setAssignType] = useState("");
 
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
 
  useEffect(() => {
    loadData();
  }, []);
 
  const loadData = async () => {
    const caseRes = await axios.get("https://localhost:7027/api/Case/all");
    const appRes = await getApplications();
    const deptRes = await axios.get("https://localhost:7027/api/Department");
 
    //  fetch services
    const serviceRes = await axios.get("https://localhost:7027/api/Services");


    
 
    setCases(caseRes.data);
    setDepartments(deptRes.data);
    setServices(serviceRes.data);
 
    // build service → department mapping
    const map = {};
    serviceRes.data.forEach(s => {
      map[s.serviceName] = {
        departmentId: s.departmentID,
        departmentName: s.departmentName
      };
    });
    setServiceDeptMap(map);
 
    const assignedSet = new Set(
      caseRes.data
        .map(c =>
          c.applicationID ??
          (c.applicationNumber
            ? Number(c.applicationNumber.replace("APP-", ""))
            : null)
        )
        .filter(id => typeof id === "number")
    );
 
    const availableApplications = appRes.data.filter(app => {
      const appId = app.applicationId ?? app.applicationID;
      const status = (app.applicationStatus ?? app.status ?? "").toLowerCase();
 
      return ["received", "submitted"].includes(status) && !assignedSet.has(appId);
    });
 
    setApplications(availableApplications);
  };
 
  //  get selected service from application
  const getSelectedService = () => {
    const selectedApp = applications.find(
      a => String(a.applicationId) === String(assignData.applicationId)
    );
    return selectedApp?.serviceName || "";
  };
 
  const handleAutoAssign = async () => {
    setAssignMessage("");
    setAssignType("");
 
    const alreadyAssigned = cases.some(
      c => c.applicationNumber === `APP-${assignData.applicationId}`
    );
 
    if (alreadyAssigned) {
      setAssignMessage("This application has already been assigned to an officer.");
      setAssignType("error");
      return;
    }
 
    // validate department against service
    const selectedService = getSelectedService();
    const validDeptId = serviceDeptMap[selectedService]?.departmentId;
 
    if (
      selectedService &&
      validDeptId &&
      Number(assignData.departmentId) !== Number(validDeptId)
    ) {
      setAssignMessage("Please select suitable department");
      setAssignType("error");
      return;
    }
 
    try {
      const res = await autoAssignCase({
        ApplicationId: Number(assignData.applicationId),
        DepartmentId: Number(assignData.departmentId)
      });
 
      setAssignMessage(res.data || "Case assigned successfully");
      setAssignType("success");
      setAssignData({ applicationId: "", departmentId: "" });
      loadData();
    } catch (error) {
      setAssignMessage(error.response?.data || "Case assignment failed");
      setAssignType("error");
    }
  };
 
  const filteredCases = cases.filter(c =>
    c.caseId.toString().includes(search)
  );
 
  const start = (currentPage - 1) * itemsPerPage;
  const currentCases = filteredCases.slice(start, start + itemsPerPage);
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
 
  return (
    <div className="cases-page">
      <h2>Cases</h2>
 
      <div className="cases-card">
        <h3>Create Case</h3>
 
        <select
          value={assignData.applicationId}
          onChange={e =>
            setAssignData({ ...assignData, applicationId: e.target.value })
          }
        >
          <option value="">Select Application</option>
          {applications.map(app => {
            const appId = app.applicationId ?? app.applicationID;
            return (
              <option key={appId} value={appId}>
                APP-{appId} ({app.serviceName})
              </option>
            );
          })}
        </select>
 
        <select
          value={assignData.departmentId}
          onChange={e =>
            setAssignData({ ...assignData, departmentId: e.target.value })
          }
        >
          <option value="">Select Department</option>
          {departments.map(dep => {
            const selectedService = getSelectedService();
            const validDept = serviceDeptMap[selectedService]?.departmentId;
 
            const isDisabled =
              selectedService &&
              validDept &&
              dep.departmentID !== validDept;
 
            return (
              <option
                key={dep.departmentID}
                value={dep.departmentID}
                disabled={isDisabled}
              >
                {dep.departmentName}
              </option>
            );
          })}
        </select>
 
        <button
          className="primary-btn"
          disabled={!assignData.applicationId || !assignData.departmentId}
          onClick={handleAutoAssign}
        >
          Auto Assign
        </button>
 
        {assignMessage && (
          <div className={`assign-msg ${assignType}`}>
            {assignMessage}
          </div>
        )}
      </div>
 
      <div className="cases-card">
        <h3>All Cases</h3>
 
        <input
          className="search-input"
          placeholder="Search by Case ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
 
        <table className="cases-table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Application</th>
              <th>Service</th>
              <th>Department</th>
              <th>Officer</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCases.map(c => (
              <tr key={c.caseId}>
                <td>CASE-{c.caseId}</td>
                <td>{c.applicationNumber}</td>
                <td>{c.serviceName}</td>
                <td>{c.departmentName}</td>
                <td>{c.officerName}</td>
                <td>{c.status}</td>
                <td>
                  <button
                    className="outline-btn"
                    onClick={() => navigate(`../case-details/${c.caseId}`)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
 
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default Cases;