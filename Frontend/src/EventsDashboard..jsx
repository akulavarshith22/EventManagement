import { useEffect, useState } from "react";

import {

  getEvents,

  createEvent,

  updateEvent,

  deleteEvent,

} from "./services/api";

import "./App.css";



const emptyForm = {

  title: "",

  description: "",

  date: "",

  location: "",

  category: "Technology",

  capacity: "50",

};



function EventsDashboard({ user, onLogout }) {

  const [events, setEvents] = useState([]);

  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");



  async function loadEvents() {

    setError("");



    try {

      const data = await getEvents();

      setEvents(data);

    } catch (err) {

      setError(err.message || "Unable to load events. Check the backend.");

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



  function openCreateForm() {

    setEditingId(null);

    setForm({ ...emptyForm });

    setError("");

    setMessage("");

    setShowForm(true);

    document.getElementById("events")?.scrollIntoView({

      behavior: "smooth",

    });

  }



  function openEditForm(event) {

    setEditingId(event.id);

    setForm({

      title: event.title ?? "",

      description: event.description ?? "",

      date: event.date ?? "",

      location: event.location ?? "",

      category: event.category || "Other",

      capacity: String(event.capacity ?? 50),

    });



    setError("");

    setMessage("");

    setShowForm(true);



    setTimeout(() => {

      document.getElementById("event-form")?.scrollIntoView({

        behavior: "smooth",

        block: "start",

      });

    }, 0);

  }



  function cancelForm() {

    setShowForm(false);

    setEditingId(null);

    setForm({ ...emptyForm });

    setError("");

  }



  async function handleSubmit(event) {

    event.preventDefault();

    setSaving(true);

    setError("");

    setMessage("");



    try {

      const eventData = {

        ...form,

        capacity: Number(form.capacity),

      };



      if (

        !Number.isInteger(eventData.capacity) ||

        eventData.capacity < 1

      ) {

        throw new Error("Capacity must be a positive whole number.");

      }



      if (editingId !== null) {

        await updateEvent(editingId, eventData);

        setMessage("Event updated successfully!");

      } else {

        await createEvent(eventData);

        setMessage("Event created successfully!");

      }



      setShowForm(false);

      setEditingId(null);

      setForm({ ...emptyForm });



      await loadEvents();

      document.getElementById("events")?.scrollIntoView({

        behavior: "smooth",

      });

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

    setMessage("");



    try {

      await deleteEvent(id);



      setEvents((previous) =>

        previous.filter((event) => event.id !== id)

      );



      if (editingId === id) {

        cancelForm();

      }



      setMessage("Event deleted successfully!");

    } catch (err) {

      setError(err.message || "Could not delete the event.");

    }

  }



  const filteredEvents = events.filter((event) => {

    const query = search.trim().toLowerCase();



    return (

      (event.title || "").toLowerCase().includes(query) ||

      (event.category || "").toLowerCase().includes(query) ||

      (event.location || "").toLowerCase().includes(query)

    );

  });



  return (

    <div className="app">

      <nav className="navbar">

        <a className="logo" href="#home">

          EventEase<span>.</span>

        </a>



        <div className="nav-links">

          <a href="#home">Home</a>

          <a href="#events">Events</a>

          <a href="#about">About</a>

        </div>



        <button

          type="button"

          className="primary-button nav-button"

          onClick={openCreateForm}

        >

          + Create Event

        </button>

        <span className="signed-in-user">
          Hi, {user?.name || "User"}
        </span>

        <button
          type="button"
          className="secondary-button logout-button"
          onClick={onLogout}
        >
          Log out
        </button>

      </nav>



      <main>

        <section className="hero" id="home">

          <div className="hero-content">

            <span className="eyebrow">

              YOUR NEXT EXPERIENCE STARTS HERE

            </span>



            <h1>

              Discover Events.

              <br />

              <span>Create Memories.</span>

            </h1>



            <p>

              Find exciting events, explore new experiences, and bring

              people together with EventEase.

            </p>



            <div className="hero-actions">

              <a className="primary-button" href="#events">

                Explore Events →

              </a>



              <button

                type="button"

                className="secondary-button"

                onClick={openCreateForm}

              >

                Create an Event

              </button>

            </div>



            <div className="hero-note">

              <span className="status-dot" />

              Discover what's happening around you

            </div>

          </div>



          <div className="hero-art" aria-hidden="true">

            <div className="art-orbit orbit-one" />

            <div className="art-orbit orbit-two" />

            <div className="art-center">✦</div>

            <div className="art-card art-card-one">🎵</div>

            <div className="art-card art-card-two">🎨</div>

            <div className="art-card art-card-three">💡</div>

            <div className="art-card art-card-four">🎉</div>

            <div className="art-caption">

              <span>MAKE IT</span>

              <strong>MEMORABLE</strong>

            </div>

          </div>

        </section>



        <section className="events-section" id="events">

          <div className="section-heading">

            <div>

              <span className="eyebrow">FIND YOUR EXPERIENCE</span>

              <h2>Explore Events</h2>

              <p>Discover events and find something you love.</p>

            </div>



            <button

              type="button"

              className="primary-button"

              onClick={showForm ? cancelForm : openCreateForm}

            >

              {showForm ? "Close Form" : "+ Add Event"}

            </button>

          </div>



          {message && (

            <div className="notice success-notice" role="status">

              {message}

            </div>

          )}



          {error && (

            <div className="notice error-notice" role="alert">

              {error}

            </div>

          )}



          {showForm && (

            <form

              id="event-form"

              className="event-form"

              onSubmit={handleSubmit}

            >

              <div className="form-heading">

                <h3>

                  {editingId !== null ? "Edit Event" : "Create a New Event"}

                </h3>

                <p>

                  {editingId !== null

                    ? `Updating event #${editingId}. Change the fields below and save.`

                    : "Fill in the details below to add an event."}

                </p>

              </div>



              <div className="form-grid">

                <label>

                  Event Title *

                  <input

                    name="title"

                    value={form.title}

                    onChange={handleChange}

                    placeholder="e.g. Music Festival"

                    required

                    maxLength={150}

                  />

                </label>



                <label>

                  Category *

                  <select

                    name="category"

                    value={form.category}

                    onChange={handleChange}

                    required

                  >

                    <option>Technology</option>

                    <option>Music</option>

                    <option>Art & Culture</option>

                    <option>Education</option>

                    <option>Business</option>

                    <option>Sports</option>

                    <option>Other</option>

                  </select>

                </label>



                <label>

                  Event Date *

                  <input

                    type="date"

                    name="date"

                    value={form.date}

                    onChange={handleChange}

                    required

                  />

                </label>



                <label>

                  Location *

                  <input

                    name="location"

                    value={form.location}

                    onChange={handleChange}

                    placeholder="e.g. Hyderabad"

                    required

                    maxLength={200}

                  />

                </label>



                <label>

                  Capacity *

                  <input

                    type="number"

                    name="capacity"

                    value={form.capacity}

                    onChange={handleChange}

                    min="1"

                    max="1000000"

                    step="1"

                    required

                  />

                </label>



                <label className="full-width">

                  Description *

                  <textarea

                    name="description"

                    value={form.description}

                    onChange={handleChange}

                    placeholder="Tell people about your event..."

                    rows="4"

                    required

                    maxLength={2000}

                  />

                </label>

              </div>



              <div className="form-actions">

                <button

                  type="button"

                  className="secondary-button"

                  onClick={cancelForm}

                  disabled={saving}

                >

                  Cancel

                </button>



                <button

                  type="submit"

                  className="primary-button"

                  disabled={saving}

                >

                  {saving

                    ? "Saving..."

                    : editingId !== null

                      ? "Save Changes"

                      : "Create Event"}

                </button>

              </div>

            </form>

          )}



          <div className="event-toolbar">

            <div>

              <strong>{events.length}</strong>{" "}

              {events.length === 1 ? "event" : "events"} in the database

            </div>



            <input

              className="search-input"

              type="search"

              placeholder="Search events..."

              value={search}

              onChange={(event) => setSearch(event.target.value)}

              aria-label="Search events"

            />

          </div>



          {loading ? (

            <div className="empty-state">

              <div className="loading-spinner" />

              <p>Loading events...</p>

            </div>

          ) : filteredEvents.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">✦</div>

              <h3>

                {search ? "No matching events" : "Your events start here"}

              </h3>

              <p>

                {search

                  ? "Try a different search term."

                  : "Create your first event and it will appear here."}

              </p>



              {!search && (

                <button

                  type="button"

                  className="primary-button"

                  onClick={openCreateForm}

                >

                  + Create Your First Event

                </button>

              )}

            </div>

          ) : (

            <div className="event-grid">

              {filteredEvents.map((event, index) => (

                <article className="event-card" key={event.id}>

                  <div className={`event-cover cover-${index % 4}`}>

                    <span className="event-emoji">

                      {event.category === "Music"

                        ? "🎵"

                        : event.category === "Technology"

                          ? "💻"

                          : event.category === "Sports"

                            ? "🏆"

                            : event.category === "Education"

                              ? "📚"

                              : event.category === "Business"

                                ? "🤝"

                                : event.category === "Art & Culture"

                                  ? "🎨"

                                  : "🎉"}

                    </span>



                    <span className="category-pill">

                      {event.category || "Event"}

                    </span>

                  </div>



                  <div className="event-info">

                    <h3>{event.title}</h3>

                    <p className="event-description">

                      {event.description}

                    </p>



                    <div className="event-meta">

                      <span>📍 {event.location}</span>

                      <span>📅 {event.date}</span>

                      <span>👥 Capacity: {event.capacity}</span>

                    </div>



                    <div className="event-card-footer">

                      <span className="event-id">Event #{event.id}</span>



                      <div className="event-card-actions">

                        <button

                          type="button"

                          className="edit-button"

                          onClick={() => openEditForm(event)}

                          aria-label={`Edit ${event.title}`}

                        >

                          Edit

                        </button>



                        <button

                          type="button"

                          className="delete-button"

                          onClick={() => handleDelete(event.id)}

                          aria-label={`Delete ${event.title}`}

                        >

                          Delete

                        </button>

                      </div>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>



        <section className="about-section" id="about">

          <span className="eyebrow">WHY EVENTEASE?</span>

          <h2>Every great memory starts somewhere.</h2>

          <p>

            EventEase brings event discovery and event management together

            in one simple place.

          </p>

        </section>

      </main>



      <footer className="footer">

        <a className="logo footer-logo" href="#home">

          EventEase<span>.</span>

        </a>

        <p>Bringing people together through unforgettable events.</p>

        <p>© 2026 EventEase. Local development project.</p>

      </footer>

    </div>

  );

}



export default EventsDashboard;
