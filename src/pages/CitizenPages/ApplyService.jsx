import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Clock, Search as SearchIcon, Heart, 
  GraduationCap, Building2, Landmark, 
  ShieldCheck, Briefcase, ChevronRight
} from "lucide-react";
import "../../styles/CitizenStyles/pages/ApplyService.css";

function ApplyServices() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const servicesPerPage = 4; 
 const BASE_URL = "https://localhost:7027/api/Services/active";

useEffect(() => {
  fetch(BASE_URL)
    .then((res) => res.json())
    .then((data) => setServices(data))
    .catch((err) => console.error(err))
    .finally(() => setLoading(false));
}, []);

  const filteredServices = services.filter((s) =>
    s.serviceName.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

  const getServiceIcon = (deptName) => {
    const dept = deptName?.toLowerCase() || "";
    if (dept.includes("health")) return <Heart size={24} className="icon-blue" />;
    if (dept.includes("education")) return <GraduationCap size={24} className="icon-blue" />;
    if (dept.includes("revenue") || dept.includes("finance")) return <Landmark size={24} className="icon-blue" />;
    if (dept.includes("labor") || dept.includes("employment")) return <Briefcase size={24} className="icon-blue" />;
    if (dept.includes("police") || dept.includes("home")) return <ShieldCheck size={24} className="icon-blue" />;
    return <Building2 size={24} className="icon-blue" />; 
  };

  return (
    <div className="content-wrapper">
 
      <div className="search-section">
        <div className="search-box-attractive">
          <SearchIcon size={20} className="search-icon-color" />
          <input
            type="text"
            placeholder="Search for government services..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); 
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="status-msg">Loading services, please wait...</div>
      ) : currentServices.length === 0 ? (
        <div className="status-msg">No services found. </div>
      ) : (
        <>
          <div className="service-list-vertical">
            {currentServices.map((service) => (
              <div
                className="service-row-card"
                key={service.serviceID}
                onClick={() => navigate(`/citizen/service-details/${service.serviceID}`)}
              >
                <div className="card-left-content">
                  <div className="icon-box-light">
                    {getServiceIcon(service.departmentName)}
                  </div>
                  
                  <div className="service-text-details">
                    <h3 className="service-name-left">{service.serviceName}</h3>
                    <p className="service-desc-left">{service.description}</p>
                    
                    <div className="service-meta-container">
                      <div className="service-meta-left">
                        <Clock size={14} />
                        <span>{service.slA_Days} Days</span>
                      </div>
                      <span className="meta-separator">•</span>
                      <div className="dept-tag-inline">
                        <Building2 size={12} />
                        <span>{service.departmentName}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card-right-action">
                  <ChevronRight size={20} className="arrow-icon" />
                </div>
              </div>
            ))}
          </div>

          <div className="pagination-footer">
            <button 
              className="p-btn" 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(currentPage - 1)}
            >Previous </button>
            <span className="p-info">Page {currentPage} of {totalPages}</span>
            <button 
              className="p-btn" 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(currentPage + 1)}
            > Next</button>
          </div>
        </>
      )}
    </div>
  );
}

export default ApplyServices;