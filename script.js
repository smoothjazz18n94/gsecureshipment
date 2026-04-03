// Check if admin is logged in
if(localStorage.getItem("isAdmin") !== "true") {
  window.location.href = "login.html"; // redirect to login if not
}


console.log("JS LOADED");

// ================= ADMIN =================
document.addEventListener("DOMContentLoaded", () => {
  const createBtn = document.getElementById("createShipmentBtn");
  const createResult = document.getElementById("createResult");

  if (createBtn) {
    createBtn.addEventListener("click", async () => {
      const data = {
        origin: document.getElementById("origin").value,
        destination: document.getElementById("destination").value,
        delivery: document.getElementById("delivery").value,
        cargo: document.getElementById("cargo").value,
        weight: document.getElementById("weight").value,
        value: document.getElementById("value").value
      };

      try {
        const res = await fetch("/shipments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });

        const shipment = await res.json();
        console.log("Server result:", shipment);

        createResult.innerHTML = `
          <p><b>Tracking ID:</b> ${shipment.trackingId}</p>
          <p><b>Status:</b> ${shipment.status}</p>
        `;
      } catch (err) {
        console.error(err);
        createResult.innerHTML = `<p style="color:red;">Error creating shipment</p>`;
      }
    });
  }


  document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("isAdmin");
  window.location.href = "login.html";
});

  // ================= USER TRACKING =================
  const trackBtn = document.getElementById("trackButton");
  if (trackBtn) {
    trackBtn.addEventListener("click", async () => {
      const id = document.getElementById("trackingInput").value.trim();
      const box = document.getElementById("trackingResult");

      if (!id) return;

      try {
        const res = await fetch(`/shipments/${id}`);
        if (!res.ok) throw new Error("Not found");

        const data = await res.json();

        box.innerHTML = `
          <div class="tracking-card">
            <h3>Shipment Details</h3>
            <p><b>Tracking ID:</b> ${data.trackingId}</p>
            <p><b>Status:</b> ${data.status}</p>
            <p><b>Origin:</b> ${data.origin}</p>
            <p><b>Destination:</b> ${data.destination}</p>
            <p><b>Delivery:</b> ${data.delivery}</p>
            <p><b>Event:</b> ${data.event || "-"}</p>
            <p><b>Location:</b> ${data.location || "-"}</p>
          </div>
        `;
      } catch (err) {
        console.error(err);
        box.innerHTML = `<p style="color:red;">Shipment not found</p>`;
      }
    });
  }
});

// ===== SCROLL ANIMATION =====
const faders = document.querySelectorAll(".fade-in");

const appearOnScroll = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

faders.forEach(el => {
  appearOnScroll.observe(el);
});