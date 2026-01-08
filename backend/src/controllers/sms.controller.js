import SmsModel from "../models/SmsModel";

const MAX_LEN = 159;
const INSTASENT_TOKEN = "issw_q4ayo9uwamoj5jx0p6txjffxztvisg5wwqf"; // literal como pediste

// ==== helpers ====
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

const jsonBytes = (obj) => new TextEncoder().encode(JSON.stringify(obj)).length;

// Enviar un subset al proveedor; si responde 413, divide y reintenta
async function postBulkWithAutoSplit(items, { minSize = 10 }) {
  const doPost = async (subset) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    const resp = await fetch("https://api.instasent.com/sms/bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": INSTASENT_TOKEN
      },
      body: JSON.stringify(subset), // Instasent recibe ARRAY de mensajes
      signal: controller.signal
    });

    clearTimeout(timer);

    let data;
    try { data = await resp.json(); } catch { data = null; }

    if (resp.status === 413 && subset.length > minSize) {
      const mid = Math.floor(subset.length / 2);
      const left = await postBulkWithAutoSplit(subset.slice(0, mid), { minSize });
      const right = await postBulkWithAutoSplit(subset.slice(mid), { minSize });
      return [...left, ...right];
    }

    if (!resp.ok) {
      const errMsg = (data && (data.detail || data.message || data.title)) || `HTTP ${resp.status}`;
      return subset.map(() => ({
        ok: false,
        providerMessageId: null,
        errorCode: String(resp.status),
        errorMessage: errMsg,
      }));
    }

    if (Array.isArray(data)) {
      return data.map((item) => ({
        ok: !item?.errorCode && !item?.error,
        providerMessageId: item?.id || item?.message_id || null,
        errorCode: item?.errorCode || item?.code || null,
        errorMessage: item?.errorMessage || item?.message || null,
      }));
    }

    return subset.map(() => ({
      ok: true,
      providerMessageId: null,
      errorCode: null,
      errorMessage: null,
    }));
  };

  return doPost(items);
}

const sendSMS = async (req, res) => {
  try {
    // ===== NUEVO CONTRATO =====
    // Body: { from: string, text: string, to: string[] }
    const { from, text, to } = req.body || {};

    if (!from) return res.status(400).json({ message: "Falta el campo 'from'." });
    if (!text) return res.status(400).json({ message: "Falta el campo 'text'." });
    if (typeof text !== "string") {
      return res.status(400).json({ message: "El campo 'text' debe ser string." });
    }
    if (text.length > MAX_LEN) {
      return res.status(400).json({ message: "El texto excede 159 caracteres." });
    }
    if (!Array.isArray(to) || to.length === 0) {
      return res.status(400).json({ message: "El campo 'to' debe ser un array con al menos un número." });
    }

    // Normaliza y deduplica números (+52...); descarta vacíos
    const normalized = Array.from(new Set(
      to.map(n => String(n || "").trim())
        .filter(Boolean)
        .map(n => n.startsWith("+") ? n : "+" + n)
    ));

    if (normalized.length === 0) {
      return res.status(400).json({ message: "No hay números válidos en 'to'." });
    }

    // Transformamos al formato que Instasent espera (ARRAY de mensajes)
    const messages = normalized.map(num => ({ from, to: num, text }));

    // ===== Chunking previo + budget opcional =====
    const CHUNK_SIZE = 200;      // por cantidad
    const BYTE_BUDGET = 800_000; // ~0.8 MB por JSON; ajusta según haga falta

    const batches = [];
    for (const group of chunk(messages, CHUNK_SIZE)) {
      let g = group.slice();
      while (jsonBytes(g) > BYTE_BUDGET && g.length > 20) {
        g.pop();
      }
      batches.push(g);
    }

    const batchId = Date.now().toString();
    let totalSent = 0;
    let totalFailed = 0;
    const resultsForClient = [];

    for (const subset of batches) {
      const perItemResults = await postBulkWithAutoSplit(subset, { minSize: 10 });

      // Log por elemento
      const docs = [];
      for (let i = 0; i < subset.length; i++) {
        const m = subset[i];
        const r = perItemResults[i] || { ok: false, providerMessageId: null, errorCode: "unknown", errorMessage: "No result" };

        docs.push({
          from: m.from,
          to: m.to,
          text: m.text,
          providerMessageId: r.providerMessageId || undefined,
          status: r.ok ? "queued" : "failed",
          errorCode: r.errorCode || undefined,
          errorMessage: r.errorMessage || undefined,
          batchId
        });

        if (r.ok) totalSent++; else totalFailed++;
        resultsForClient.push({
          to: m.to,
          ok: r.ok,
          providerMessageId: r.providerMessageId || null,
          error: r.ok ? null : { code: r.errorCode, message: r.errorMessage }
        });
      }

      try {
        await SmsModel.insertMany(docs);
      } catch (e) {
        console.warn("No se pudieron guardar logs de SMS:", e.message);
      }
    }

    return res.status(200).json({
      message: "Proceso de envío completado.",
      batchId,
      sent: totalSent,
      failed: totalFailed,
      results: resultsForClient
    });

  } catch (err) {
    return res.status(500).json({ message: "Error interno al enviar mensajes.", error: err.message });
  }
};

export { sendSMS };
