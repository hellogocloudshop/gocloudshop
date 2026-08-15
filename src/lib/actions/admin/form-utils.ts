export function formToObject(formData: FormData, booleanFields: string[] = []): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    obj[key] = value;
  }
  for (const field of booleanFields) {
    obj[field] = formData.get(field) === "on";
  }
  return obj;
}

export type ActionResult = { success: true } | { success: false; error: string };
