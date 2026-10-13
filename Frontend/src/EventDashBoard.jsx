
import { useState, useEffect } from "react";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "./services/api.js";
import "./App.css";

export default function EventsDashboard({ user, onLogout }) {
  const emptyForm = {
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    capacity: 50,
  };

  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadEvents() {
    setLoading(true);
    setError("");

    try {
      const data = await getEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not load events.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function startEdit(event) {
    setEditingId(event.id);

    setForm({
      title: event.title || "",
      description: event.description || "",
      date: event.date || "",
      location: event.location || "",
      category: event.category || "",
      capacity: event.capacity ?? 50,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...form,
        capacity: Number(form.capacity),
      };

      if (editingId !== null) {
        await updateEvent(editingId, payload);
        setSuccess("Event updated successfully.");
      } else {
        await createEvent(payload);
        setSuccess("Event created successfully.");
      }

      setEditingId(null);
      setForm({ ...emptyForm });

      await loadEvents();
    } catch (err) {
      setError(err.message || "Could not save the event.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteEvent(id);

      if (editingId === id) {
        setEditingId(null);
        setForm({ ...emptyForm });
      }

      setSuccess("Event deleted successfully.");
      await loadEvents();
    } catch (err) {
      setError(err.message || "Could not delete the event.");
    }
  }

  return (
    <div className="dashboard-page">
      <header className="navbar">
        <div className="logo">EventEase.</div>

        <div className="dashboard-user">
          <span>
            Welcome, {user?.name || user?.email || "User"}
          </span>

          <button
            type="button"
            className="login-btn"
            onClick={onLogout}
          >
            Log out
          </button>
        </div>
      </header>

      <main className="events-section">
        <p className="section-label">
          YOUR NEXT EXPERIENCE STARTS HERE
        </p>

        <h1>
          {editingId !== null
            ? "Update Your Event"
            : "Manage Your Events"}
        </h1>

        <p className="section-description">
          Create events, update details, and manage your experiences.
        </p>

        {error && (
          <p className="event-error" role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className="event-success" role="status">
            {success}
          </p>
        )}

        <section className="event-form-section">
          <h2>
            {editingId !== null ? "Edit Event" : "Create an Event"}
          </h2>

          <form className="event-form" onSubmit={handleSubmit}>
            <label htmlFor="event-title">Event title</label>
            <input
              id="event-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter event title"
              maxLength={150}
              required
            />

            <label htmlFor="event-description">Description</label>
            <textarea
              id="event-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your event"
              rows={4}
              required
            />

            <label htmlFor="event-date">Event date</label>
            <input
              id="event-date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />

            <label htmlFor="event-location">Location</label>
            <input
              id="event-location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Enter event location"
              required
            />

            <label htmlFor="event-category">Category</label>
            <input
              id="event-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Music, Technology, Art..."
              required
            />

            <label htmlFor="event-capacity">Capacity</label>
            <input
              id="event-capacity"
              name="capacity"
              type="number"
              min="1"
              value={form.capacity}
              onChange={handleChange}
              required
            />

            <div className="event-form-actions">
              <button
                type="submit"
                className="login-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                    ? "Update Event"
                    : "Create Event"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  className="details-btn"
                  onClick={cancelEdit}
                  disabled={saving}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="events-list-section">
          <div className="event-list-heading">
            <h2>All Events</h2>

            <button
              type="button"
              className="details-btn"
              onClick={loadEvents}
              disabled={loading}
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p>Loading events...</p>
          ) : events.length === 0 ? (
            <p>No events found. Create your first event above.</p>
          ) : (
            <div className="event-grid">
              {events.map((event) => (
                <article
                  className="event-card"
                  key={event.id}
                >
                  <div className="event-info">
                    <span className="category">
                      {event.category || "EVENT"}
                    </span>

                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    <p>📍 {event.location}</p>
                    <p>📅 {event.date}</p>
                    <p>👥 Capacity: {event.capacity}</p>

                    <button
                      type="button"
                      className="details-btn"
                      onClick={() => startEdit(event)}
                    >
                      Edit Event
                    </button>

                    <button
                      type="button"
                      className="details-btn"
                      onClick={() => handleDelete(event.id)}
                    >
                      Delete Event
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
