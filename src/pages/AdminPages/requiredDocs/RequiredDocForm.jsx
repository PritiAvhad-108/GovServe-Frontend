import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function RequiredDocForm({ doc, onClose, onSave }) {
  const [services, setServices] = useState([]);

  const [form, setForm] = useState({
    serviceID: doc.serviceID || "",
    documentName: doc.documentName || "",
    mandatory: doc.mandatory === "Yes" || doc.mandatory === true
  });

  useEffect(() => {
    api.get("/Services").then(res => setServices(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      serviceID: Number(form.serviceID),
      documentName: form.documentName,
      mandatory: Boolean(form.mandatory)
    };

    if (doc.documentID) {
      await api.put(`/RequiredDocuments/${doc.documentID}`, payload);
      toast.success("Document updated");
    } else {
      await api.post("/RequiredDocuments", payload);
      toast.success("Document created");
    }

    await onSave();  // ✅ reload table
    onClose();       // ✅ close modal after reload
  };

  return (
    <div className="form-modal">
      <div className="modal-card">
        <h4>{doc.documentID ? "Edit Document" : "Add Document"}</h4>

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

          <label>Document Name</label>
          <input
            className="form-control mb-2"
            value={form.documentName}
            onChange={(e) => setForm({ ...form, documentName: e.target.value })}
            required
          />

          <label>Mandatory</label>
          <select
            className="form-control mb-3"
            value={form.mandatory ? "Yes" : "No"}
            onChange={(e) => setForm({ ...form, mandatory: e.target.value === "Yes" })}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <div className="actions-row">
            <button className="btn btn-secondary" type="button" onClick={onClose}>
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