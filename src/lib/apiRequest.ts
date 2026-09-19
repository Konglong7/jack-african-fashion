type JsonBodyResult = { ok: true; data: unknown } | { ok: false; error: string };
type FormDataBodyResult = { ok: true; data: FormData } | { ok: false; error: string };

export async function readJsonBody(req: Request): Promise<JsonBodyResult> {
  try {
    return { ok: true, data: await req.json() };
  } catch {
    return { ok: false, error: 'Invalid JSON body' };
  }
}

export async function readFormDataBody(req: Request): Promise<FormDataBodyResult> {
  try {
    return { ok: true, data: await req.formData() };
  } catch {
    return { ok: false, error: 'Invalid form data' };
  }
}
