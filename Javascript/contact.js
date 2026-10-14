
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return entities[character];
  });
}

export async function onRequestPost({ request, env }) {
  try {
    if (!env.RESEND_API_KEY ||
        !env.CONTACT_TO_EMAIL ||
        !env.CONTACT_FROM_EMAIL) {
      return jsonResponse(
        { error: "The contact form is not configured yet." },
        500
      );
    }

    const contentType = request.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return jsonResponse({ error: "Invalid request format." }, 415);
    }

    const length = Number(request.headers.get("content-length") || 0);

    if (length > 12000) {
      return jsonResponse({ error: "Your message is too long." }, 413);
    }

    const data = await request.json();

    // Quietly ignore obvious bot submissions.
    if (data.website) {
      return jsonResponse({ success: true });
    }

    const name = String(data.name || "").trim();
    const email = String(data.email || "").trim();
    const session = String(data.session || "").trim();
    const date = String(data.date || "").trim();
    const location = String(data.location || "").trim();
    const message = String(data.message || "").trim();

    const allowedSessions = [
      "Portraits",
      "Couples / Engagements",
      "Families",
      "Events",
      "Lifestyle / Branding",
      "Other"
    ];

    if (
      !name ||
      name.length > 100 ||
      !email ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !allowedSessions.includes(session) ||
      !message ||
      message.length > 3000 ||
      location.length > 150 
    ) {
      return jsonResponse(
        { error: "Please check your details and try again." },
        400
      );
    }

    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return jsonResponse({ error: "Please check the date." }, 400);
    }

    const emailText = [
      "New photography inquiry from your website",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Session: ${session}`,
      `Preferred date: ${date || "Not provided"}`,
      `Location: ${location || "Not provided"}`,
      "",
      "Message:",
      message
    ].join("\n");

    const emailHtml = `
      <h2>New photography inquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Session:</strong> ${escapeHtml(session)}</p>
      <p><strong>Preferred date:</strong> ${escapeHtml(date || "Not provided")}</p>
      <p><strong>Location:</strong> ${escapeHtml(location || "Not provided")}</p>
      <hr>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `Photography inquiry: ${session} — ${name}`,
        text: emailText,
        html: emailHtml
      })
    });

    if (!emailResponse.ok) {
      // Log the status only; never log the API key or private message.
      console.error("Email delivery provider returned:", emailResponse.status);

      return jsonResponse(
        { error: "We couldn't send your inquiry right now. Please try again later." },
        502
      );
    }

    return jsonResponse({ success: true });

  } catch (error) {
    console.error("Contact form processing failed.");

    return jsonResponse(
      { error: "Something went wrong. Please try again later." },
      500
    );
  }
}

// Reject other HTTP methods.
export async function onRequest({ request }) {
  if (request.method === "POST") {
    return jsonResponse({ error: "Request could not be processed." }, 405);
  }

  return jsonResponse({ error: "Method not allowed." }, 405);
}

