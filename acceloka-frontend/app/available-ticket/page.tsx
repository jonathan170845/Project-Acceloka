"use client";

import { useEffect, useState } from "react";

interface Ticket
{
  ticketCode: string;
  ticketName: string;
  categoryName: string;
  price: number;
  eventDate: string;
  remainingQuota: number;
}

export default function TicketsPage()
{
  const inputStyle =
  {
    width: "100%",
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    color: "#000",
  };
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    maxPrice: "",
    category: "",
    ticketCode: "",
    ticketName: "",
    dateFrom: "",
    dateTo: "",
    orderBy: "",
    orderState: "",
  });

  const pageSize = 10;

  const fetchTickets = async () => {
    try
    {
      setLoading(true);

      const params = new URLSearchParams();

      params.append("PageNumber", page.toString());
      params.append("PageSize", pageSize.toString());

      if (filters.maxPrice) params.append("MaxPrice", filters.maxPrice);
      if (filters.category) params.append("CategoryName", filters.category);
      if (filters.ticketCode) params.append("TicketCode", filters.ticketCode);
      if (filters.ticketName) params.append("TicketName", filters.ticketName);
      if (filters.dateFrom) params.append("EventDateFrom", filters.dateFrom);
      if (filters.dateTo) params.append("EventDateTo", filters.dateTo);
      if (filters.orderBy) params.append("OrderBy", filters.orderBy.toLowerCase());
      if (filters.orderState) params.append("OrderState", filters.orderState.toLowerCase());

      const url = `http://localhost:5209/api/v1/get-available-ticket?${params.toString()}`;

      const res = await fetch(url);

      if (!res.ok) {
        setTickets([]);
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) setTickets(data);
      else if (data.data) setTickets(data.data);
      else setTickets([]);
    }
    catch
    {
      setTickets([]);
    }
    finally
    {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [page]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "maxPrice" && Number(value) < 0)
    {
      return;
    }

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    setPage(1);
    fetchTickets();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/beach.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "20px",
        paddingTop: "60px"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          padding: "30px",
          borderRadius: "16px",
          backgroundColor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          color: "#000",
        }}
      >
        <h1 style={{ textAlign: "center", fontSize: "32px", marginBottom: "20px" }}>
          Check Available Tickets
        </h1>

        <button
          onClick={() => window.history.back()}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            marginBottom: "10px",
          }}
        >
          ⬅ Back
        </button>

        <hr />

        <h3 style={{ marginBottom: "10px" }}>Filter</h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
          
          <div>
            <label>Category</label>
            <input name="category" onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label>Ticket Code</label>
            <input name="ticketCode" onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label>Ticket Name</label>
            <input name="ticketName" onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label>Max Price</label>
            <input type="number" name="maxPrice" onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label>Event Start</label>
            <input type="date" name="dateFrom" onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label>Event End</label>
            <input type="date" name="dateTo" onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label>Order By</label>
            <select name="orderBy" onChange={handleChange} style={inputStyle}>
              <option value="">Select</option>
              <option value="ticketcode">Ticket Code</option>
              <option value="ticketname">Ticket Name</option>
              <option value="categoryname">Category</option>
              <option value="eventdate">Event Date</option>
              <option value="price">Price</option>
            </select>
          </div>

          <div>
            <label>Order</label>
            <select name="orderState" onChange={handleChange} style={inputStyle}>
              <option value="">Select</option>
              <option value="asc">ASC</option>
              <option value="desc">DESC</option>
            </select>
          </div>

        </div>

        <br />

        <button
          onClick={handleSearch}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            marginTop: "10px"
          }}
        >
          Search
        </button>

        <hr style={{ margin: "10px 0" }} />

        <h3>Ticket List</h3>

        {loading ? (
          <p>Loading...</p>
        ) : tickets.length === 0 ? (
          <p>No data available</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {tickets.map((t) => (
              <div
                key={t.ticketCode}
                style={{
                  padding: "15px",
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                }}
              >
                <b>{t.ticketName}</b> ({t.ticketCode}) <br />
                Category: {t.categoryName} <br />
                Price: Rp. {t.price} <br />
                Date: {new Date(t.eventDate).toLocaleDateString()} <br />
                Remaining: {t.remainingQuota}
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: "20px" }}>
          {page > 1 && (
            <button onClick={() => setPage(page - 1)}>⬅ Previous</button>
          )}

          <span style={{ margin: "0 10px" }}>Page {page}</span>

          {tickets.length === pageSize && (
            <button onClick={() => setPage(page + 1)}>Next ➡</button>
          )}
        </div>
      </div>
    </div>
  );
}