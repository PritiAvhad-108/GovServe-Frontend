import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function EligibilityRuleForm({ rule, onClose, onSave }) {
  const [services, setServices] = useState([]);

  // ✅ serviceID must ALWAYS come from dropdown
  const [form, setForm] = useState({
    serviceID: "",
    ruleDescription: rule?.ruleDescription || ""
   
  });

  useEffect(() => {
    api.get("/Services").then(res => setServices(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.serviceID) {
      toast.error("Please select a service");
      return;
    }

    const payload = {
      serviceID: Number(form.serviceID),
      ruleDescription: form.ruleDescription.trim()
      
    };

    try {
      if (rule?.ruleID) {
        await api.put(`/EligibilityRules/${rule.ruleID}`, payload);
        toast.success("Rule updated");
      } else {
        await api.post("/EligibilityRules", payload);
        toast.success("Rule created");
      }

      await onSave(); // ✅ reload first
      onClose();      // ✅ close after reload

    } catch {
      toast.error("Invalid rule data");
    }
  };

  return (
    <div className="form-modal">
      <div className="modal-card">
        <h4>{rule?.ruleID ? "Edit Rule" : "Add Eligibility Rule"}</h4>

        <form onSubmit={handleSubmit}>
          <label>Service</label>
          <select
            className="form-control mb-2"
            value={form.serviceID}
            onChange={(e) => setForm({ ...form, serviceID: e.target.value })}
            required
          >
            <option value="">Select Service</option>
            {services.map(s => (
              <option key={s.serviceID} value={s.serviceID}>
                {s.serviceName}
              </option>
            ))}
          </select>

          <label>Rule Description</label>
          <textarea
            className="form-control mb-2"
            value={form.ruleDescription}
            onChange={(e) => setForm({ ...form, ruleDescription: e.target.value })}
            required
          />

        

          <div className="actions-row">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}