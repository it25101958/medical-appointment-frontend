"use server";

import { revalidateTag } from "next/cache";

import { apiRequest } from "@/lib/api-client";
import {
  CACHE_REVALIDATE_SECONDS,
  CACHE_TAGS,
  createCachedReadOptions,
} from "@/lib/cache";

const roomReadOptions = createCachedReadOptions(
  [CACHE_TAGS.rooms],
  CACHE_REVALIDATE_SECONDS.long,
);

function invalidateRoomCache() {
  revalidateTag(CACHE_TAGS.rooms, "max");
}

export interface Room {
  roomId: number;
  roomNumber?: string;
  roomType?: string;
  capacity?: number;
  equipmentAvailable?: string;
  status?: string;
  [key: string]: unknown;
}

export interface RoomPayload {
  roomNumber: string;
  roomType: string;
  capacity: number;
  equipmentAvailable: string;
  status: string;
}

export async function getRooms(): Promise<Room[]> {
  return await apiRequest("/room", roomReadOptions);
}

export async function createRoom(payload: RoomPayload): Promise<Room> {
  const room = await apiRequest<Room>("/room", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  invalidateRoomCache();
  return room;
}

export async function updateRoom(
  roomId: number,
  payload: Partial<RoomPayload>,
): Promise<Room> {
  const room = await apiRequest<Room>(`/room/${roomId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  invalidateRoomCache();
  return room;
}

export async function deleteRoom(roomId: number): Promise<void> {
  await apiRequest(`/room/${roomId}`, {
    method: "DELETE",
  });

  invalidateRoomCache();
}
