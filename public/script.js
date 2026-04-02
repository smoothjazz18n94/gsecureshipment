console.log("JS LOADED");

document.addEventListener("DOMContentLoaded", () => {

    // ---------------- Admin Create Shipment ----------------
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

                const result = await res.json();
                createResult.innerHTML = `<strong>Created!</strong> Tracking ID: ${result.trackingId}`;
            } catch (err) {
                console.error(err);
                createResult.innerHTML = `<span style="color:red;">Error creating shipment</span>`;
            }
        });
    }

    // ---------------- Admin Update Shipment ----------------
    const updateBtn = document.getElementById("updateShipmentBtn");
    const updateResult = document.getElementById("updateResult");

    if (updateBtn) {
        updateBtn.addEventListener("click", async () => {
            const id = document.getElementById("trackId").value;
            const data = {
                status: document.getElementById("status").value,
                event: document.getElementById("event").value,
                location: document.getElementById("location").value
            };

            try {
                const res = await fetch(`/shipments/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const result = await res.json();
                updateResult.innerHTML = `<strong>Updated!</strong> Tracking ID: ${result.trackingId}`;
            } catch (err) {
                console.error(err);
                updateResult.innerHTML = `<span style="color:red;">Update failed</span>`;
            }
        });
    }

    // ---------------- User Tracking ----------------
    const trackBtn = document.getElementById("trackButton");
    const trackingBox = document.getElementById("trackingResult");

    if (trackBtn) {
        trackBtn.addEventListener("click", async () => {
            const id = document.getElementById("trackingInput").value.trim();
            trackingBox.innerHTML = "";
            if (!id) return trackingBox.innerHTML = "<p style='color:red;'>Enter a tracking ID</p>";

            try {
                const res = await fetch(`/shipments/${id}`);
                if (!res.ok) throw new Error("Not found");
                const data = await res.json();

                trackingBox.innerHTML = `
                    <div class="shipment-card">
                        <h2>Shipment Details</h2>
                        <div class="shipment-row"><div>Tracking ID:</div><div>${data.trackingId}</div></div>
                        <div class="shipment-row"><div>Status:</div><div>${data.status}</div></div>
                        <div class="shipment-row"><div>Origin:</div><div>${data.origin}</div></div>
                        <div class="shipment-row"><div>Destination:</div><div>${data.destination}</div></div>
                        <div class="shipment-row"><div>Delivery:</div><div>${data.delivery}</div></div>
                        <div class="shipment-row"><div>Event:</div><div>${data.event || "-"}</div></div>
                        <div class="shipment-row"><div>Location:</div><div>${data.location || "-"}</div></div>
                    </div>
                `;
            } catch {
                trackingBox.innerHTML = "<p style='color:red;'>Shipment not found</p>";
            }
        });
    }

});