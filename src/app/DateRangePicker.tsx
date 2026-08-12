import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { TimePicker } from "./TimePicker";
import "../styles/data-controls.css";

export type DateRangeValue = { from: string; to: string };

type DateRangePickerProps = DateRangeValue & {
  onChange: (value: DateRangeValue) => void;
  withTime?: boolean;
  allowEmpty?: boolean;
  ariaLabel?: string;
  className?: string;
};

const monthFormatter = new Intl.DateTimeFormat("ru-RU", {
  month: "long",
  year: "numeric",
});
const dayFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const shortDayFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
});
const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function datePart(value: string) {
  return value ? value.slice(0, 10) : "";
}

function timePart(value: string, fallback: string) {
  return value.includes("T") ? value.slice(11, 16) : fallback;
}

function toIsoDate(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromIsoDate(value: string) {
  return new Date(`${value}T12:00:00`);
}

function addDays(value: Date, amount: number) {
  const result = new Date(value);
  result.setDate(result.getDate() + amount);
  return result;
}

function withLocalTime(date: string, time: string, enabled: boolean) {
  return enabled ? `${date}T${time}` : date;
}

export function DateRangePicker({
  from,
  to,
  onChange,
  withTime = false,
  allowEmpty = false,
  ariaLabel = "Дата или период",
  className = "",
}: DateRangePickerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const initialDate = datePart(from) || datePart(to) || toIsoDate(new Date());
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(fromIsoDate(initialDate).getFullYear(), fromIsoDate(initialDate).getMonth(), 1),
  );

  const updatePopoverPosition = () => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    const popoverWidth = 276;
    const estimatedHeight = withTime ? 390 : 320;
    const fitsBelow = window.innerHeight - rect.bottom >= estimatedHeight + 10;
    setPopoverPosition({
      left: Math.max(8, Math.min(rect.left, window.innerWidth - popoverWidth - 8)),
      top: fitsBelow
        ? rect.bottom + 6
        : Math.max(8, rect.top - estimatedHeight - 6),
    });
  };

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      const target = event.target as Node;
      const targetElement = target instanceof Element ? target : null;
      if (
        !rootRef.current?.contains(target) &&
        !popoverRef.current?.contains(target) &&
        !targetElement?.closest(".time-picker__popover")
      ) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    updatePopoverPosition();
    window.addEventListener("resize", updatePopoverPosition);
    window.addEventListener("scroll", updatePopoverPosition, true);
    return () => {
      window.removeEventListener("resize", updatePopoverPosition);
      window.removeEventListener("scroll", updatePopoverPosition, true);
    };
  }, [open, withTime]);

  const calendarDays = useMemo(() => {
    const first = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const mondayOffset = (first.getDay() + 6) % 7;
    const start = addDays(first, -mondayOffset);
    return Array.from({ length: 42 }, (_, index) => addDays(start, index));
  }, [visibleMonth]);

  const fromDate = datePart(from);
  const toDate = datePart(to);
  const startTime = timePart(from, "00:00");
  const endTime = timePart(to, "23:59");

  const label = (() => {
    if (!fromDate && !toDate) return "Выбрать дату";
    if (fromDate && (!toDate || fromDate === toDate)) {
      const base = dayFormatter.format(fromIsoDate(fromDate));
      return withTime ? `${base}, ${startTime}–${endTime}` : base;
    }
    const base = `${shortDayFormatter.format(fromIsoDate(fromDate))} — ${dayFormatter.format(fromIsoDate(toDate))}`;
    return withTime ? `${base}, ${startTime}–${endTime}` : base;
  })();

  const selectDate = (value: string) => {
    if (!selectingEnd) {
      onChange({
        from: withLocalTime(value, startTime, withTime),
        to: withLocalTime(value, endTime, withTime),
      });
      setSelectingEnd(true);
      return;
    }
    const start = value < fromDate ? value : fromDate;
    const end = value < fromDate ? fromDate : value;
    onChange({
      from: withLocalTime(start, startTime, withTime),
      to: withLocalTime(end, endTime, withTime),
    });
    setSelectingEnd(false);
  };

  return (
    <div ref={rootRef} className={`date-range-picker ${className}`.trim()}>
      <button
        type="button"
        className="date-range-picker__trigger"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => {
          if (open) {
            setOpen(false);
            return;
          }
          updatePopoverPosition();
          setOpen(true);
        }}
      >
        <CalendarDays size={17} aria-hidden="true" />
        <span>{label}</span>
      </button>
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open && (
        <motion.div
          ref={popoverRef}
          className="date-range-picker__popover is-portaled"
          role="dialog"
          aria-label={ariaLabel}
          style={{ top: popoverPosition.top, left: popoverPosition.left, transformOrigin: "top left" }}
          initial={{ opacity: 0, y: -5, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.985 }}
          transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="date-range-picker__month-head">
            <button
              type="button"
              aria-label="Предыдущий месяц"
              onClick={() => setVisibleMonth((value) => new Date(value.getFullYear(), value.getMonth() - 1, 1))}
            >
              <ChevronLeft size={18} />
            </button>
            <strong>{monthFormatter.format(visibleMonth)}</strong>
            <button
              type="button"
              aria-label="Следующий месяц"
              onClick={() => setVisibleMonth((value) => new Date(value.getFullYear(), value.getMonth() + 1, 1))}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="date-range-picker__weekdays" aria-hidden="true">
            {weekDays.map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="date-range-picker__grid">
            {calendarDays.map((day) => {
              const value = toIsoDate(day);
              const isStart = value === fromDate;
              const isEnd = value === toDate;
              const isInRange = Boolean(fromDate && toDate && value > fromDate && value < toDate);
              const isOutside = day.getMonth() !== visibleMonth.getMonth();
              return (
                <button
                  type="button"
                  key={value}
                  className={[
                    isOutside ? "is-outside" : "",
                    isInRange ? "is-in-range" : "",
                    isStart || isEnd ? "is-selected" : "",
                  ].filter(Boolean).join(" ")}
                  aria-label={dayFormatter.format(day)}
                  aria-pressed={isStart || isEnd}
                  onClick={() => selectDate(value)}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          {withTime && fromDate && (
            <div className="date-range-picker__times">
              <label>
                <span>Время с</span>
                <TimePicker
                  value={startTime}
                  ariaLabel="Время с"
                  invalid={!/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime)}
                  onChange={(value) => onChange({
                    from: withLocalTime(fromDate, value, true),
                    to: withLocalTime(toDate || fromDate, endTime, true),
                  })}
                />
              </label>
              <label>
                <span>Время по</span>
                <TimePicker
                  value={endTime}
                  ariaLabel="Время по"
                  invalid={!/^([01]\d|2[0-3]):[0-5]\d$/.test(endTime)}
                  onChange={(value) => onChange({
                    from: withLocalTime(fromDate, startTime, true),
                    to: withLocalTime(toDate || fromDate, value, true),
                  })}
                />
              </label>
            </div>
          )}

          <div className="date-range-picker__footer">
            {allowEmpty && (
              <button
                type="button"
                className="date-range-picker__clear"
                onClick={() => {
                  onChange({ from: "", to: "" });
                  setSelectingEnd(false);
                }}
              >
                Сбросить
              </button>
            )}
            <button type="button" className="date-range-picker__done" onClick={() => setOpen(false)}>
              <Check size={15} aria-hidden="true" /> Готово
            </button>
          </div>
        </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}
