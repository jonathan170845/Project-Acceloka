"use client";

import { useState } from "react";
import { getBookedTicket } from "../../services/api";

interface TicketItem
{
  ticketCode: string;
  ticketName: string;
  eventDate: string;
  quantity: number;
}

interface CategoryGroup
{
  categoryName: string;
  tickets: TicketItem[];
}

export default function BookedTicketPage()
{
  const [id, setId] = useState("");
  const [data, setData] = useState<CategoryGroup[]>([]);
  const [error, setError] = useState("");

  const handleGet = async () => {
    try
    {
      setError("");
      setData([]);

      if (!id) {
        setError("Please enter ID");
        return;
      }

      const res = await getBookedTicket(Number(id));

      if (!res || res.length === 0) {
        setError("Id not found.");
        return;
      }

      setData(res);
    }
    catch (err)
    {
      console.error(err);
      setError("Id not found.");
    }
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
        paddingTop: "60px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          padding: "30px",
          borderRadius: "16px",
          backgroundColor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          color: "#000",
        }}
      >
        <h1 style={{ textAlign: "center", fontSize: "32px", marginBottom: "20px" }}>
          Get Booked Ticket
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

        <hr style={{ margin: "15px 0" }} /><div style={{ marginBottom: "20px" }}>
          <label>Booked Ticket ID</label>
          <input
            type="number"
            value={id}
            onChange={(e) => setId(e.target.value)}
            min={1}
          />
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input
            placeholder="Enter BookedTicketId"
            value={id}
            onChange={(e) => setId(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              backgroundColor: "#fff",
              color: "#000",
            }}
          />

          <button
            onClick={handleGet}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </div>

        {error && (
          <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>
        )}

        {data.length > 0 && (
          <div>
            <h3 style={{ marginBottom: "10px" }}>Result:</h3>

            {data.map((category) => (
              <div
                key={category.categoryName}
                style={{
                  padding: "15px",
                  marginBottom: "15px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(255,255,255,0.8)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <h4 style={{ marginBottom: "10px" }}>
                  Category: {category.categoryName}
                </h4>

                {category.tickets.map((ticket) => (
                  <div
                    key={ticket.ticketCode}
                    style={{
                      padding: "10px",
                      marginBottom: "10px",
                      borderRadius: "8px",
                      backgroundColor: "#fff",
                      border: "1px solid #eee",
                    }}
                  >
                    <p><b>Code:</b> {ticket.ticketCode}</p>
                    <p><b>Name:</b> {ticket.ticketName}</p>
                    <p>
                      <b>Date:</b>{" "}
                      {new Date(ticket.eventDate).toLocaleDateString()}
                    </p>
                    <p><b>Quantity:</b> {ticket.quantity}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}