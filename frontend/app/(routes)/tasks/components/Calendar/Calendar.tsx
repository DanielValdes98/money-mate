"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import multimonthPlugin from "@fullcalendar/multimonth";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { DateSelectArg, EventContentArg } from "@fullcalendar/core/index.js";

import axios from "axios";

import { formatDate } from "@/lib/formatDate";

import { CalendarProps } from "./Calendar.types";
import { Toast } from "@/components/ui/toast";
import { ModalAddEvent } from "../ModalAddEvent";
import { start } from "repl";
import { toast } from "@/hooks/use-toast";

export function Calendar(props: CalendarProps) {
  const { companies, events } = props;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [onSaveNewEvent, setOnSaveNewEvent] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DateSelectArg>();
  const [newEvent, setNewEvent] = useState({
    eventName: "",
    companieSelected: {
      name: "",
      id: 0,
    },
  });

  const handleDateClick = async (selected: DateSelectArg) => {
    setOpen(true);
    setSelectedItem(selected);
  };

  useEffect(() => {
    if (onSaveNewEvent && selectedItem?.view.calendar) {
      const calendarApi = selectedItem.view.calendar;
      calendarApi.unselect();

      const newEventRequest = {
        company_id: newEvent.companieSelected.id,
        title: newEvent.eventName,
        start: new Date(selectedItem.start),
        all_day: false,
        time_format: "H(:mm)",
      };

      axios
        .post(
          `/api/company/${newEvent.companieSelected.id}/event`,
          newEventRequest
        )
        .then((response) => {
          //   console.log("[CREATE EVENT] response", response);
          if (response.status === 200) {
            toast({ title: "Evento creado" });
            router.refresh();
          } else {
            throw new Error("Error al crear el evento");
          }
        })
        .catch((error) => {
          toast({ title: "Error al crear el evento", variant: "destructive" });
          console.error(error);
        });

      setNewEvent({
        eventName: "",
        companieSelected: {
          name: "",
          id: 0,
        },
      });

      setOnSaveNewEvent(false);
    }
  }, [onSaveNewEvent, selectedItem]);

  const handleEventClick = async (selected: any) => {
    if (
      window.confirm(
        `¿Estás seguro de eliminar el evento ${selected.event.title}?`
      )
    ) {
      try {
        await axios.delete(`/api/event/${selected.event._def.publicId}`);
        toast({ title: "Evento eliminado" });
        router.refresh();
      } catch (error) {
        toast({
          title: "Error al eliminar el evento",
          variant: "destructive",
        });
      }
    }
    console.log("Event clicked");
  };

  return (
    <div>
      <div className="md:flex gap-x-3">
        <div className="w-[200px] relative">
          <div className="overflow-auto absolute left-0 top-0 h-full w-full">
            <p className="mb-3 text-xl">Listado de tareas</p>
            {events.map((currentEvent) => (
              <div
                key={currentEvent.id}
                className="p-4 rounded-lg shadow-md mb-2 bg-slate-200 dark:bg-background"
              >
                <p className="font-bold">{currentEvent.title}</p>
                <p>{formatDate(currentEvent.start)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 calendar-container">
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              listPlugin,
              interactionPlugin,
              multimonthPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right:
                "multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            height="80vh"
            initialView="dayGridMonth"
            weekends={false}
            events={events.map((event) => ({
              ...event,
              id: event.id.toString(),
            }))}
            eventContent={renderEventContent}
            editable={true}
            selectable={true}
            selectMirror={true}
            select={handleDateClick}
            eventClick={handleEventClick}
          />
        </div>
      </div>

      <ModalAddEvent
        open={open}
        setOpen={setOpen}
        setOnSaveNewEvent={setOnSaveNewEvent}
        companies={companies}
        setNewEvent={setNewEvent}
      />
    </div>
  );
}

function renderEventContent(eventInfo: EventContentArg) {
  return (
    <div className="w-full p-1 bg-slate-200 dark:bg-background">
      <i>{eventInfo.event.title}</i>
    </div>
  );
}
