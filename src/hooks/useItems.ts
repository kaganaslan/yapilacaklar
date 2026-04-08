"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface Photo {
  id: string;
  item_id: string;
  storage_path: string;
  date_label: string;
  created_at: string;
  publicUrl?: string;
}

export interface Item {
  id: string;
  text: string;
  done: boolean;
  note: string;
  order: number;
  created_at: string;
  updated_at: string;
  photos: Photo[];
}

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const enrichPhotos = useCallback((photos: Photo[]) => {
    return photos.map((p) => ({
      ...p,
      publicUrl: supabase.storage.from("polaroids").getPublicUrl(p.storage_path).data.publicUrl,
    }));
  }, []);

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase
      .from("items")
      .select("*, photos(*)")
      .order("created_at");

    if (!error && data) {
      setItems(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.map((item: any) => ({
          ...item,
          photos: enrichPhotos(item.photos || []),
        }))
      );
    }
    setLoading(false);
  }, [enrichPhotos]);

  useEffect(() => {
    fetchItems();

    const channel = supabase
      .channel("items-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "items" },
        () => fetchItems()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "photos" },
        () => fetchItems()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchItems]);

  const addItem = useCallback(async (text: string) => {
    const optimisticItem: Item = {
      id: crypto.randomUUID(),
      text,
      done: false,
      note: "",
      order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      photos: [],
    };
    setItems((prev) => [...prev, optimisticItem]);

    const { data, error } = await supabase
      .from("items")
      .insert({ text })
      .select("*, photos(*)")
      .single();

    if (error) {
      setItems((prev) => prev.filter((i) => i.id !== optimisticItem.id));
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.id === optimisticItem.id
            ? { ...data, photos: enrichPhotos(data.photos || []) }
            : i
        )
      );
    }
  }, [enrichPhotos]);

  const toggleDone = useCallback(async (id: string, current: boolean) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, done: !current } : i))
    );
    await supabase.from("items").update({ done: !current }).eq("id", id);
  }, []);

  const updateNote = useCallback(async (id: string, note: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, note } : i))
    );
    await supabase.from("items").update({ note }).eq("id", id);
  }, []);

  const removeItem = useCallback(async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await supabase.from("items").delete().eq("id", id);
  }, []);

  return { items, loading, addItem, toggleDone, updateNote, removeItem };
}
