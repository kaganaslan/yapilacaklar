"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchItemsAction,
  addItemAction,
  toggleDoneAction,
  updateNoteAction,
  removeItemAction,
  removePhotoAction,
} from "@/app/actions";

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
  created_by: string;
  created_at: string;
  updated_at: string;
  photos: Photo[];
}

export function useItems(currentUser: string) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    const data = await fetchItemsAction();
    setItems(data as Item[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
    // Diğer kişinin değişikliklerini 30sn'de bir çek
    const interval = setInterval(fetchItems, 30000);
    return () => clearInterval(interval);
  }, [fetchItems]);

  const addItem = useCallback(async (text: string) => {
    const optimisticItem: Item = {
      id: crypto.randomUUID(),
      text,
      done: false,
      note: "",
      order: 0,
      created_by: currentUser,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      photos: [],
    };
    setItems((prev) => [...prev, optimisticItem]);

    const data = await addItemAction(text, currentUser);
    if (!data) {
      setItems((prev) => prev.filter((i) => i.id !== optimisticItem.id));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.id === optimisticItem.id ? (data as Item) : i))
      );
    }
  }, [currentUser]);

  const toggleDone = useCallback(async (id: string, current: boolean) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, done: !current } : i))
    );
    await toggleDoneAction(id, !current);
  }, []);

  const updateNote = useCallback(async (id: string, note: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, note } : i))
    );
    await updateNoteAction(id, note);
  }, []);

  const removeItem = useCallback(async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await removeItemAction(id);
  }, []);

  const removePhoto = useCallback(async (photoId: string, storagePath: string) => {
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        photos: item.photos.filter((p) => p.id !== photoId),
      }))
    );
    await removePhotoAction(photoId, storagePath);
  }, []);

  return { items, loading, addItem, toggleDone, updateNote, removeItem, removePhoto, refetch: fetchItems };
}
