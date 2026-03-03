"use client";

import { useState } from "react";
import { revokeTicket } from "@/services/api";

export default function RevokePage()
{
  const [id, setId] = useState("");
  const [code, setCode] = useState("");
  const [qty, setQty] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const inputStyle =
  {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    color: "#000",
  };

  const handleSubmit = async () => {
    setMessage("");

    if (!id || !code || !qty)
    {
      setIsError(true);
      setMessage("All fields must be filled.");
      return;
    }

    if (Number(id) <= 0)
    {
      setIsError(true);
      setMessage("Booked Ticket ID must be greater than 0.");
      return;
    }

    if (Number(qty) <= 0)
    {
      setIsError(true);
      setMessage("Quantity must be greater than 0.");
      return;
    }

    try
    {
      await revokeTicket(Number(id), code, Number(qty));
      setIsError(false);
      setMessage("Success revoke ticket!");
    }
    catch (err: any)
    {
      setIsError(true);

      console.log("ERROR FULL:", err);

      if (err?.errors && err.errors.length > 0) {
        const errorMsg = err.errors[0];

        if (errorMsg.includes("Qty exceeds"))
        {
          setMessage("Quantity exceeds your booked ticket.");
        }
        else if (errorMsg.includes("not found"))
        {
          setMessage("Ticket code not found in this booking.");
        }
        else
        {
          setMessage(errorMsg);
        }
      }
      else if (err?.message)
      {
        setMessage(err.message);
      }
      else
      {
        setMessage("Failed to revoke ticket.");
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
          maxWidth: "500px",
          padding: "30px",
          borderRadius: "16px",
          backgroundColor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          color: "#000",
        }}
      >

        <h1 style={{ textAlign: "center", fontSize: "32px", marginBottom: "20px" }}>
          Revoke Ticket
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

        <p style={{ marginBottom: "20px" }}>
          Enter the details of the ticket you want to revoke.
        </p>

        <div style={{ marginBottom: "15px" }}>
          <label>Booked Ticket ID</label>
          <input
            type="number"
            placeholder="Enter booked ticket id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            style={inputStyle}
            min={1}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Ticket Code</label>
          <input
            type="text"
            placeholder="Enter ticket code (e.g. BIO001)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Quantity</label>
          <input
            type="number"
            placeholder="Enter quantity to revoke"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            style={inputStyle}
            min={1}
          />
        </div>

        <button
          onClick={handleSubmit}
          style={{
            padding: "12px",
            width: "100%",
            borderRadius: "8px",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Revoke
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