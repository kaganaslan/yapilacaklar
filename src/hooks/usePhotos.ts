"use client";

import { useCallback } from "react";
import { supabase } from "@/lib/supabase";

const formatDate = (ts: number) => {
  const d = new Date(ts);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(2);
  return `${day}.${month}.${year}`;
};

export function usePhotos() {
  const uploadPhoto = useCallback(async (itemId: string, file: File) => {
    const timestamp = Date.now();
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${itemId}/${timestamp}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("polaroids")
      .upload(path, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("polaroids")
      .getPublicUrl(path);

    const dateLabel = formatDate(timestamp);

    const { data, error: insertError } = await supabase
      .from("photos")
      .insert({ item_id: itemId, storage_path: path, date_label: dateLabel })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return null;
    }

    return { ...data, publicUrl: urlData.publicUrl };
  }, []);

  const removePhoto = useCallback(
    async (photoId: string, storagePath: string) => {
      await supabase.storage.from("polaroids").remove([storagePath]);
      await supabase.from("photos").delete().eq("id", photoId);
    },
    []
  );

  return { uploadPhoto, removePhoto };
}
