import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function EligibilityRuleForm({ rule = {}, onClose, onSave }) {
  const isEdit = !!rule?.ruleID;

  const [services, setServices] = useState([]);
  const [errors, setErrors] = useState({});

  const [selectedServiceID, setSelectedServiceID] = useState("");
  const [ruleDescription, setRuleDescription] = useState(
    rule?.ruleDescription || ""
  );

  /*  Load services only for CREATE */
  useEffect(() => {
    if (!isEdit) {
      api
        .get("/Services/active")
        .then(res => setServices(res.data))
        .catch(() => toast.error("Unable to load services."));
    }
  }, [isEdit]);

  /*  Validation */
  const validateForm = () => {
    const newErrors = {};

    if (!isEdit && !selectedServiceID) {
      newErrors.serviceID = "Please select a service.";
    }

    if (!ruleDescription.trim()) {
      newErrors.ruleDescription = "Rule description is required.";
    } else if (ruleDescription.trim().length < 10) {
      newErrors.ruleDescription =
        "Rule description must be at least 10 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /*  Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = isEdit
      ? {
          ruleDescription: ruleDescription.trim()
        }
      : {
          serviceID: Number(selectedServiceID),
          ruleDescription: ruleDescription.trim()
        };

    try {
      if (isEdit) {
        await api.put(`/EligibilityRules/${rule.ruleID}`, payload);
        toast.success("Eligibility rule updated successfully.");
      } else {
        await api.post("/EligibilityRules", payload);
        toast.success("Eligibility rule created successfully.");
      }

      await onSave();
      onClose();
    } catch {
      toast.error("Failed to save eligibility rule.");
    }
  };

  return (
    <div className="form-modal">
      <div className="modal-card">
        <h4>{isEdit ? "Edit Eligibility Rule" : "Add Eligibility Rule"}</h4>

        <form onSubmit={handleSubmit}>
          {/*  Service */}
          <label>Service</label>
          {isEdit ? (
            <>
              <input
                className="form-control"
                value={rule.serviceName}
                disabled
              />
              <small className="text-muted">
                Service cannot be changed once the rule is created.
              </small>
            </>
          ) : (
            <>
              <select
                className={`form-control ${
                  errors.serviceID ? "is-invalid" : ""
                }`}
                value={selectedServiceID}
                onChange={(e) => setSelectedServiceID(e.target.value)}
              >
                <option value="">Select Service</option>
                {services.map(s => (
                  <option key={s.serviceID} value={s.serviceID}>
                    {s.serviceName}
                  </option>
                ))}
              </select>
              {errors.serviceID && (
                <small className="error-text">{errors.serviceID}</small>
              )}
            </>
          )}

          {/*  Rule Description */}
          <label>Rule Description</label>
          <textarea
            className={`form-control ${
              errors.ruleDescription ? "is-invalid" : ""
            }`}
            value={ruleDescription}
            onChange={(e) => setRuleDescription(e.target.value)}
            rows={4}
          />
          {errors.ruleDescription && (
            <small className="error-text">{errors.ruleDescription}</small>
          )}

          <div className="actions-row">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
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