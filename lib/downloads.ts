const MY_JOBS_KEY = "ayonime_my_job_ids";

export function getMyJobIds(): string[] {
  try { return JSON.parse(localStorage.getItem(MY_JOBS_KEY) || "[]"); } catch { return []; }
}

export function saveMyJobId(jobId: string) {
  try {
    const ids = getMyJobIds();
    if (!ids.includes(jobId)) { ids.push(jobId); localStorage.setItem(MY_JOBS_KEY, JSON.stringify(ids)); }
  } catch {}
}

export function removeMyJobId(jobId: string) {
  try {
    const ids = getMyJobIds().filter((id) => id !== jobId);
    localStorage.setItem(MY_JOBS_KEY, JSON.stringify(ids));
  } catch {}
}
