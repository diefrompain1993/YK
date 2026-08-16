import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Clock3 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import "../styles/data-controls.css";

type TimePickerProps = {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  placeholder?: string;
  invalid?: boolean;
};

const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, "0"));
const validTime = /^([01]\d|2[0-3]):[0-5]\d$/;

function maskTimeInput(rawValue: string) {
  const digits = rawValue.replace(/\D/g, "").slice(0, 4);
  if (!digits) return "";

  const firstHourDigit = Number(digits[0]);
  let hour = "";
  let remaining = "";

  if (firstHourDigit > 2) {
    hour = `0${digits[0]}`;
    remaining = digits.slice(1);
  } else if (digits.length === 1) {
    return digits;
  } else {
    const hourCandidate = digits.slice(0, 2);
    if (Number(hourCandidate) > 23) {
      hour = `0${digits[0]}`;
      remaining = digits.slice(1);
    } else {
      hour = hourCandidate;
      remaining = digits.slice(2);
    }
  }

  if (!remaining) return hour;
  const minute = Number(remaining[0]) > 5
    ? `0${remaining[0]}`
    : remaining.slice(0, 2);
  return `${hour}:${minute}`;
}

function completeTimeInput(value: string) {
  const masked = maskTimeInput(value);
  if (!masked || validTime.test(masked)) return masked;
  if (/^\d$/.test(masked)) return `0${masked}:00`;
  if (/^\d{2}$/.test(masked)) return `${masked}:00`;
  if (/^\d{2}:\d$/.test(masked)) {
    const [hour, minute] = masked.split(":");
    return `${hour}:0${minute}`;
  }
  return masked;
}

export function TimePicker({
  value,
  onChange,
  ariaLabel,
  placeholder = "00:00",
  invalid = false,
}: TimePickerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [selectedHour, selectedMinute] = validTime.test(value)
    ? value.split(":")
    : ["00", "00"];

  const updatePosition = () => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = 204;
    const height = 246;
    const fitsBelow = window.innerHeight - rect.bottom >= height + 10;
    setPosition({
      left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)),
      top: fitsBelow ? rect.bottom + 6 : Math.max(8, rect.top - height - 6),
    });
  };

  const openPicker = () => {
    if (open) return;
    updatePosition();
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !popoverRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`time-picker ${open ? "is-open" : ""}`}>
      <Clock3 size={16} aria-hidden="true" />
      <input
        className="time-picker__input"
        type="text"
        inputMode="numeric"
        maxLength={5}
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        aria-invalid={invalid}
        onFocus={openPicker}
        onClick={openPicker}
        onChange={(event) => onChange(maskTimeInput(event.target.value))}
        onBlur={(event) => {
          const completed = completeTimeInput(event.target.value);
          if (completed !== event.target.value) onChange(completed);
        }}
      />
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={popoverRef}
              className="time-picker__popover"
              role="dialog"
              aria-label={`Выбор: ${ariaLabel}`}
              style={{ top: position.top, left: position.left, transformOrigin: "top left" }}
              initial={{ opacity: 0, y: -5, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.985 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="time-picker__column">
                <strong>Часы</strong>
                <div className="time-picker__list" role="listbox" aria-label="Часы">
                  {hours.map((hour) => (
                    <button
                      type="button"
                      role="option"
                      aria-selected={hour === selectedHour}
                      className={hour === selectedHour ? "is-selected" : undefined}
                      key={hour}
                      onClick={() => onChange(`${hour}:${selectedMinute}`)}
                    >
                      {hour}
                    </button>
                  ))}
                </div>
              </div>
              <div className="time-picker__column">
                <strong>Минуты</strong>
                <div className="time-picker__list" role="listbox" aria-label="Минуты">
                  {minutes.map((minute) => (
                    <button
                      type="button"
                      role="option"
                      aria-selected={minute === selectedMinute}
                      className={minute === selectedMinute ? "is-selected" : undefined}
                      key={minute}
                      onClick={() => {
                        onChange(`${selectedHour}:${minute}`);
                        setOpen(false);
                      }}
                    >
                      {minute}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}
