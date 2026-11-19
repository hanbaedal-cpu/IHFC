"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ko } from "date-fns/locale";
import { useMemo, useState } from "react";

export type CalendarRoom = {
  id: string;
  roomName: string;
  deceasedName: string;
  startAt: string;
  endAt: string;
  status: string;
};

export function CalendarBoard({
  rooms,
  onSelect,
}: {
  rooms: CalendarRoom[];
  onSelect?: (room: CalendarRoom) => void;
}) {
  const [cursor, setCursor] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  return (
    <div className="calendar-board">
      <div className="calendar-head">
        <button type="button" onClick={() => setCursor((d) => subMonths(d, 1))}>
          이전
        </button>
        <h3>{format(cursor, "yyyy년 M월", { locale: ko })}</h3>
        <button type="button" onClick={() => setCursor((d) => addMonths(d, 1))}>
          다음
        </button>
      </div>
      <div className="calendar-weekdays">
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {days.map((day) => {
          const dayRooms = rooms.filter((room) => {
            const start = new Date(room.startAt);
            const end = new Date(room.endAt);
            return isWithinInterval(day, { start, end }) || isSameDay(day, start) || isSameDay(day, end);
          });
          return (
            <div
              key={day.toISOString()}
              className={`calendar-cell ${isSameMonth(day, cursor) ? "" : "muted"}`}
            >
              <div className="calendar-day">{format(day, "d")}</div>
              <div className="calendar-events">
                {dayRooms.map((room) => (
                  <button
                    key={`${room.id}-${day.toISOString()}`}
                    type="button"
                    className={`cal-event status-${room.status}`}
                    onClick={() => onSelect?.(room)}
                  >
                    {room.roomName}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
