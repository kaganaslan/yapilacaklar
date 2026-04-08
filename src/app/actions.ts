"use server";

import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// --- Auth ---

export async function loginAction(
  userKey: string,
  password: string
): Promise<boolean> {
  const passwords: Record<string, string | undefined> = {
    serra: process.env.SERRA_PASSWORD,
    kagan: process.env.KAGAN_PASSWORD,
  };
  return passwords[userKey] === password;
}

// --- Items ---

export async function fetchItemsAction() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("items")
    .select("*, photos(*)")
    .order("created_at");

  if (error || !data) return [];

  return data.map((item) => ({
    ...item,
    photos: (item.photos || []).map((p: Record<string, unknown>) => ({
      ...p,
      publicUrl: supabase.storage
        .from("polaroids")
        .getPublicUrl(p.storage_path as string).data.publicUrl,
    })),
  }));
}

export async function addItemAction(text: string, createdBy: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("items")
    .insert({ text, created_by: createdBy })
    .select("*, photos(*)")
    .single();

  if (error || !data) return null;
  return { ...data, photos: [] };
}

export async function toggleDoneAction(id: string, done: boolean) {
  const supabase = getSupabase();
  await supabase.from("items").update({ done }).eq("id", id);
}

export async function updateNoteAction(id: string, note: string) {
  const supabase = getSupabase();
  await supabase.from("items").update({ note }).eq("id", id);
}

export async function removeItemAction(id: string) {
  const supabase = getSupabase();
  await supabase.from("items").delete().eq("id", id);
}

// --- Photos ---

const formatDate = (ts: number) => {
  const d = new Date(ts);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(2);
  return `${day}.${month}.${year}`;
};

export async function uploadPhotoAction(itemId: string, formData: FormData) {
  const supabase = getSupabase();
  const file = formData.get("file") as File;
  if (!file) return null;

  const timestamp = Date.now();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${itemId}/${timestamp}.${ext}`;
  const bytes = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from("polaroids")
    .upload(path, bytes, { contentType: file.type });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from("polaroids")
    .getPublicUrl(path);

  const { data, error: insertError } = await supabase
    .from("photos")
    .insert({ item_id: itemId, storage_path: path, date_label: formatDate(timestamp) })
    .select()
    .single();

  if (insertError) {
    console.error("Insert error:", insertError);
    return null;
  }

  return { ...data, publicUrl: urlData.publicUrl };
}

export async function removePhotoAction(photoId: string, storagePath: string) {
  const supabase = getSupabase();
  await supabase.storage.from("polaroids").remove([storagePath]);
  await supabase.from("photos").delete().eq("id", photoId);
}
