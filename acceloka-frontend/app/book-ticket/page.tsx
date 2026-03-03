"use client";

import { useState } from "react";
import { bookTicket } from "../../services/api";

export default function BookTicketPage()
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

  const [tickets, setTickets] = useState([
    { ticketCode: "", quantity: "" },
  ]);

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [result, setResult] = useState<any>(null);

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...tickets];
    updated[index][field as "ticketCode" | "quantity"] = value;
    setTickets(updated);
  };

  const addTicket = () => {
    setTickets([...tickets, { ticketCode: "", quantity: "" }]);
  };

  const removeTicket = (index: number) => {
    const updated = tickets.filter((_, i) => i !== index);
    setTickets(updated);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMessage("");
    setResult(null);

    const seen = new Set<string>();

    for (let t of tickets)
    {
      const code = t.ticketCode.trim();

      if (!code || Number(t.quantity) <= 0)
      {
        setIsError(true);
        setMessage("All ticket fields must be filled correctly.");
        return;
      }

      if (seen.has(code))
      {
        setIsError(true);
        setMessage(`Duplicate ticket code: ${code}`);
        return;
      }

      seen.add(code);
    }

    try
    {
      const res = await bookTicket({
        tickets: tickets.map((t) => ({
          ticketCode: t.ticketCode.trim(),
          quantity: Number(t.quantity),
        })),
      });

      setIsError(false);
      setMessage("Booking success!");
      setResult(res);
      setTickets([{ ticketCode: "", quantity: "" }]);
    }
    catch (err: any)
    {
      setIsError(true);

      try
      {
        const parsed = JSON.parse(err.message);

        if (parsed?.errors?.length > 0)
        {
          setMessage(parsed.errors[0]);
        }
        else
        {
          setMessage(parsed.title || "Booking failed.");
        }
      }
      catch
      {
        setMessage(err.message || "Booking failed.");
      }
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
          Book Ticket
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

        <hr style={{ margin: "15px 0" }} />

        <h3 style={{ marginBottom: "10px" }}>Tickets</h3>

        {tickets.map((t, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "12px",
              alignItems: "flex-end",
            }}
          >
            <div style={{ flex: 1 }}>
              <label>Ticket Code</label>
              <input
                value={t.ticketCode}
                onChange={(e) =>
                  handleChange(index, "ticketCode", e.target.value)
                }
                style={inputStyle}
              />
            </div>

            <div style={{ width: "100px" }}>
              <label>Qty</label>
              <input
                type="number"
                value={t.quantity}
                onChange={(e) =>
                  handleChange(index, "quantity", e.target.value)
                }
                style={inputStyle}
                min={1}
              />
            </div>

            <button
              onClick={() => removeTicket(index)}
              style={{
                padding: "8px",
                borderRadius: "8px",
                backgroundColor: "#ededed",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
                height: "38px",
              }}
            >
              ❌
            </button>
          </div>
        ))}

        <button
          onClick={addTicket}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          + Add Ticket
        </button>

        <br />

        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Book
        </button>

        {message && (
          <p
            style={{
              color: isError ? "red" : "green",
              marginTop: "15px",
              fontWeight: "500",
            }}
          >
            {message}
          </p>
        )}

        {result && (
          <div style={{ marginTop: "20px" }}>
            <h3>🧾 Order Summary</h3>

            <p>
              <b>Total Price:</b> Rp {result.priceSummary.toLocaleString()}
            </p>

            {result.ticketsPerCategories.map((cat: any, i: number) => (
              <div key={i} style={{ marginTop: "10px" }}>
                <h4>📦 {cat.categoryName}</h4>
                <p>Subtotal: Rp {cat.summaryPrice.toLocaleString()}</p>

                {cat.tickets.map((t: any, j: number) => (
                  <div key={j} style={{ marginLeft: "10px" }}>
                    - {t.ticketName} ({t.ticketCode}) <br />
                    Qty: {t.quantity} × Rp {t.price.toLocaleString()}
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