function updatePillStates(target) {
    document.querySelectorAll(".pill").forEach(l => l.classList.remove("active"));
    if (target) {
        target.closest(".pill").classList.add("active");
    }
}

document.querySelectorAll("input[name='animal']").forEach(cb => {
    cb.addEventListener("change", function() {
        document.querySelectorAll("input[name='animal']").forEach(x => {
            if (x !== this) x.checked = false;
        });
        updatePillStates(this);
        const imgDiv = document.getElementById("animalImage");
        if (this.checked) {
            const selected = this.value;
            imgDiv.innerHTML = `<img src="/static/images/${selected}.png" alt="${selected}">`;
        } else {
            imgDiv.innerHTML = "";
        }
    });
});

document.getElementById("uploadBtn").addEventListener("click", async () => {
    const fileInput = document.getElementById("fileInput");
    const fileInfoDiv = document.getElementById("fileInfo");

    if (!fileInput.files.length) {
        fileInfoDiv.innerHTML = `<p class="error">Please choose a file first.</p>`;
        return;
    }
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        const res = await fetch("/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) {
            fileInfoDiv.innerHTML = `<p class="error">${data.error || "Upload failed"}</p>`;
            return;
        }
        fileInfoDiv.innerHTML = `
            <div class="info-grid">
                <div><span class="k">Name</span><span class="v">${data.filename}</span></div>
                <div><span class="k">Size</span><span class="v">${data.size} bytes</span></div>
                <div><span class="k">Type</span><span class="v">${data.type}</span></div>
            </div>
        `;
    } catch (e) {
        fileInfoDiv.innerHTML = `<p class="error">Network error. Is Flask running?</p>`;
    }
});
