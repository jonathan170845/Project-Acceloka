"use client";

import { useState } from "react";
import { editBookedTicket } from "@/services/api";

export default function EditPage()
{
  const [id, setId] = useState("");

  const [tickets, setTickets] = useState([
    { ticketCode: "", quantity: "" },
  ]);

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const inputStyle =
  {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    color: "#000",
  };

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

  const handleSubmit = async () => {
    setMessage("");

    if (Number(id) <= 0) {
      setIsError(true);
      setMessage("Booked Ticket ID must be greater than 0.");
      return;
    }

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
      await editBookedTicket(Number(id), {
        tickets: tickets.map((t) => ({
          ticketCode: t.ticketCode.trim(),
          quantity: Number(t.quantity),
        })),
      });

      setIsError(false);
      setMessage("Ticket updated successfully!");
    }
    catch (err: any)
    {
      setIsError(true);

      if (err?.errors?.length > 0)
      {
        setMessage(err.errors[0]);
      }
      else
      {
        setMessage(err.message || "Failed to update ticket.");
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
          Edit Ticket
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
            marginBottom: "15px",
          }}
        >
          ⬅ Back
        </button>

        <hr style={{ margin: "15px 0" }} />

        <div style={{ marginBottom: "20px" }}>
          <label>Booked Ticket ID</label>
          <input
            type="number"
            value={id}
            onChange={(e) => setId(e.target.value)}
            style={{ ...inputStyle, width: "100%" }}
            min={1}
          />
        </div>

        <h3 style={{ marginBottom: "10px" }}>Tickets</h3>

        {tickets.map((t, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "12px",
              alignItems: "center",
            }}
          >
            <input
              placeholder="Ticket Code"
              value={t.ticketCode}
              onChange={(e) =>
                handleChange(index, "ticketCode", e.target.value)
              }
              style={{ ...inputStyle, flex: 1 }}
            />

            <input
              type="number"
              placeholder="Qty"
              value={t.quantity}
              onChange={(e) =>
                handleChange(index, "quantity", e.target.value)
              }
              style={{ ...inputStyle, width: "90px" }}
              min={1}
            />

            <button
              onClick={() => removeTicket(index)}
              style={{
                backgroundColor: "#d1bfbf",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "8px",
                cursor: "pointer",
              }}
            >
              ❌
            </button>
          </div>
        ))}

        <button
          onClick={addTicket}
          style={{
            marginBottom: "20px",
            padding: "8px 16px",
            borderRadius: "8px",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          + Add Ticket
        </button>

        <br />

        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Update
        </button>

        {message && (
          <p
            style={{
              marginTop: "15px",
              color: isError ? "red" : "green",
              fontWeight: "bold",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}