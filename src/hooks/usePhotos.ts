"use client";

import { useCallback } from "react";
import { uploadPhotoAction, removePhotoAction } from "@/app/actions";

export function usePhotos() {
  const uploadPhoto = useCallback(async (itemId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return await uploadPhotoAction(itemId, formData);
  }, []);

  const removePhoto = useCallback(
    async (photoId: string, storagePath: string) => {
      await removePhotoAction(photoId, storagePath);
    },
    []
  );

  return { uploadPhoto, removePhoto };
}
