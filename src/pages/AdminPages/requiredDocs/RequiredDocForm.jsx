import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function RequiredDocForm({ doc = {}, onClose, onSave }) {
  const isEdit = !!doc.documentID;

  const [services, setServices] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    serviceID: doc.serviceID || "",
    documentName: doc.documentName || "",
    mandatory: doc.mandatory === "Yes" || doc.mandatory === true
  });

  /*  Load services ONLY for CREATE */
  useEffect(() => {
    if (!isEdit) {
      api
        .get("/Services")
        .then(res => setServices(res.data))
        .catch(() => toast.error("Unable to load services."));
    }
  }, [isEdit]);

  /* Validation */
  const validateForm = () => {
    const newErrors = {};

    if (!isEdit && !form.serviceID) {
      newErrors.serviceID = "Please select a service.";
    }

    if (!form.documentName.trim()) {
      newErrors.documentName = "Document name is required.";
    } else if (form.documentName.trim().length < 3) {
      newErrors.documentName =
        "Document name must be at least 3 characters long.";
    }

    if (form.mandatory === null || form.mandatory === undefined) {
      newErrors.mandatory = "Please select mandatory status.";
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
          documentName: form.documentName.trim(),
          mandatory: Boolean(form.mandatory)
        }
      : {
          serviceID: Number(form.serviceID),
          documentName: form.documentName.trim(),
          mandatory: Boolean(form.mandatory)
        };

    try {
      if (isEdit) {
        await api.put(`/RequiredDocuments/${doc.documentID}`, payload);
        toast.success("Document updated successfully.");
      } else {
        await api.post("/RequiredDocuments", payload);
        toast.success("Document created successfully.");
      }

      await onSave();
      onClose();
    } catch {
      toast.error("Failed to save required document.");
    }
  };

  return (
    <div className="form-modal">
      <div className="modal-card">
        <h4>{isEdit ? "Edit Document" : "Add Document"}</h4>

        <form onSubmit={handleSubmit}>
          {/*  Service */}
          <label>Service</label>
          {isEdit ? (
            <>
              <input
                className="form-control"
                value={doc.serviceName}
                disabled
              />
              <small className="text-muted">
                Service cannot be changed once the document is created.
              </small>
            </>
          ) : (
            <>
              <select
                className={`form-control ${
                  errors.serviceID ? "is-invalid" : ""
                }`}
                value={form.serviceID}
                onChange={(e) =>
                  setForm({ ...form, serviceID: e.target.value })
                }
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

          {/*  Document Name */}
          <label>Document Name</label>
          <input
            className={`form-control ${
              errors.documentName ? "is-invalid" : ""
            }`}
            value={form.documentName}
            onChange={(e) =>
              setForm({ ...form, documentName: e.target.value })
            }
          />
          {errors.documentName && (
            <small className="error-text">{errors.documentName}</small>
          )}

          {/* Mandatory */}
          <label>Mandatory</label>
          <select
            className={`form-control ${
              errors.mandatory ? "is-invalid" : ""
            }`}
            value={form.mandatory ? "Yes" : "No"}
            onChange={(e) =>
              setForm({ ...form, mandatory: e.target.value === "Yes" })
            }
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          {errors.mandatory && (
            <small className="error-text">{errors.mandatory}</small>
          )}

          <div className="actions-row">
            <button
              className="btn btn-secondary"
              type="button"
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