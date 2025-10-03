export async function loadPartial(id, file) {
    const container = document.getElementById(id);
    if (!container) return;

    const res = await fetch(file);
    const html = await res.text();
    container.innerHTML = html;
}