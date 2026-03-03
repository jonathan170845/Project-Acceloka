export const BASE_URL = "http://localhost:5209/api/v1";

export async function getAvailableTickets()
{
  const res = await fetch(`${BASE_URL}/get-available-ticket`);
  if (!res.ok) throw new Error("Failed to fetch tickets");
  return res.json();
}

export async function bookTicket(data: any)
{
  const res = await fetch(`${BASE_URL}/book-ticket`,
  {
    method: "POST",
    headers:
    {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const text = await res.text();
  console.log("STATUS:", res.status);
  console.log("RESPONSE:", text);

  if (!res.ok) throw new Error(text);

  return JSON.parse(text);
}

export const getBookedTicket = async (id: number) =>
{
  try
  {
    const res = await fetch(`${BASE_URL}/get-booked-ticket/${id}`);

    if (!res.ok)
    {
      return null;
    }

    const text = await res.text();

    if (!text)
    {
      return null;
    }

    return JSON.parse(text);
  }
  catch (err)
  {
    console.error("API ERROR:", err);
    return null;
  }
};

export async function revokeTicket(
  bookedTicketId: number,
  ticketCode: string,
  qty: number
) {
  const url = `${BASE_URL}/revoke-ticket/${bookedTicketId}/${ticketCode}/${qty}`;

  console.log("DELETE URL:", url);

  const res = await fetch(url, {
    method: "DELETE",
  });

  let data: any;

  try
  {
    data = await res.json();
  }
  catch
  {
    data = null;
  }

  if (!res.ok)
  {
    throw data || { message: "Failed to revoke ticket." };
  }

  return data;
}

export async function editBookedTicket(
  bookedTicketId: number,
  body: any
) {
  const res = await fetch(
    `${BASE_URL}/edit-booked-ticket/${bookedTicketId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  let data: any;

  try
  {
    data = await res.json();
  }
  catch
  {
    data = null;
  }

  if (!res.ok)
  {
    throw data || { message: "Failed to update ticket." };
  }

  return data;
}