"use client";

import { useEffect, useState } from "react";
import { Button, ScrollArea, type Column } from "@/components/ui";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import {
  roomScheduleApi,
  type RoomScheduleResponse,
} from "@/features/room-schedule";
import RoomScheduleList from "@/features/room-schedule/components/room-schedule-list";
import { apiRequest } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/utils";

interface DoctorInfo {
  userId: number;
  roleType: number;
}

export default function DoctorRoomSchedulePage() {
  const [schedules, setSchedules] = useState<RoomScheduleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [doctorInfo, setDoctorInfo] = useState<DoctorInfo | null>(null);

  useEffect(() => {
    fetchDoctorInfo();
  }, []);

  useEffect(() => {
    if (doctorInfo?.userId) {
      fetchSchedules();
    }
  }, [doctorInfo]);

  async function fetchDoctorInfo() {
    try {
      const doctor = await apiRequest<DoctorInfo>("/users/me", {
        method: "GET",
        cache: "no-store",
      });

      setDoctorInfo(doctor);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setIsLoading(false);
    }
  }

  async function fetchSchedules() {
    if (!doctorInfo?.userId) return;
    setIsLoading(true);
    try {
      const data = await roomScheduleApi.getAllDoctorSchedules(
        doctorInfo.userId,
      );
      setSchedules(data || []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  const columns: Column<RoomScheduleResponse>[] = [
    { header: "Schedule ID", accessor: "roomScheduleId" },
    { header: "Room", render: (schedule) => `Room ${schedule.roomNumber}` },
    { header: "Day", accessor: "dayOfWeek" },
    {
      header: "Time Slot",
      render: (schedule) => `${schedule.startTime} - ${schedule.endTime}`,
    },
    {
      header: "Created At",
      render: (schedule) => new Date(schedule.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <RoomScheduleList
      title="My Room Schedules"
      description="View all your assigned room schedules across the week."
      data={schedules}
      columns={columns}
      isLoading={isLoading}
      onRefresh={fetchSchedules}
    />
  );
}
