import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  CalendarRange,
  Download,
  FileText,
  RotateCcw,
  Search,
  UsersRound,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { CustomSelect } from "./CustomSelect";
import { DataPagination, usePaginatedItems } from "./DataPagination";
import { DateRangePicker } from "./DateRangePicker";
import "../styles/operations.css";

export type PresenceRecord = {
  id: string;
  employee: string;
  role: string;
  contractor: string;
  object: string;
  room?: string;
  enteredAt: string;
  leftAt: string | null;
};

export type ExportEventType = "Вход" | "Выход" | "Отчёт";

export type ExportEvent = {
  id: string;
  occurredAt: string;
  type: ExportEventType;
  employee: string;
  role: string;
  contractor: string;
  object: string;
  details: string;
};

export const PRESENCE_RECORDS: PresenceRecord[] = [
  {
    id: "presence-01",
    employee: "Александр Петров",
    role: "Инженер ПТО",
    contractor: "ООО «Альфа Строй»",
    object: "Логистический центр «Запад»",
    room: "Главный вход",
    enteredAt: "2026-08-12T07:48:00",
    leftAt: null,
  },
  {
    id: "presence-02",
    employee: "Дмитрий Крылов",
    role: "Мастер участка",
    contractor: "ООО «ТехСервис»",
    object: "Логистический центр «Запад»",
    room: "Склад А",
    enteredAt: "2026-08-12T08:12:00",
    leftAt: null,
  },
  {
    id: "presence-03",
    employee: "Виктор Смирнов",
    role: "Руководитель проекта",
    contractor: "ООО «СтройГрупп»",
    object: "Логистический центр «Запад»",
    room: "Зона погрузки",
    enteredAt: "2026-08-12T09:04:00",
    leftAt: null,
  },
  {
    id: "presence-04",
    employee: "Илья Воронов",
    role: "Сервисный инженер",
    contractor: "ООО «ТехСервис»",
    object: "БЦ «Орион»",
    room: "Кровля",
    enteredAt: "2026-08-12T08:31:00",
    leftAt: null,
  },
  {
    id: "presence-05",
    employee: "Максим Волков",
    role: "Начальник участка",
    contractor: "ООО «МонтажПро»",
    object: "Производственная площадка «Север»",
    room: "Проходная № 2",
    enteredAt: "2026-08-12T07:55:00",
    leftAt: null,
  },
  {
    id: "presence-06",
    employee: "Наталья Белова",
    role: "Инженер-сметчик",
    contractor: "ООО «МонтажПро»",
    object: "Производственная площадка «Север»",
    room: "Цех 1",
    enteredAt: "2026-08-12T08:18:00",
    leftAt: null,
  },
  {
    id: "presence-07",
    employee: "Антон Зуев",
    role: "Прораб",
    contractor: "ООО «СтройГрупп»",
    object: "Производственная площадка «Север»",
    room: "Цех 3",
    enteredAt: "2026-08-12T08:26:00",
    leftAt: null,
  },
  {
    id: "presence-08",
    employee: "Сергей Иванов",
    role: "Прораб",
    contractor: "ООО «Альфа Строй»",
    object: "Логистический центр «Запад»",
    room: "Техническая",
    enteredAt: "2026-08-11T08:04:00",
    leftAt: "2026-08-11T18:21:00",
  },
  {
    id: "presence-09",
    employee: "Елена Соколова",
    role: "Специалист по ОТ",
    contractor: "ООО «Альфа Строй»",
    object: "Склад № 3",
    room: "Рампа",
    enteredAt: "2026-08-11T08:19:00",
    leftAt: "2026-08-11T17:49:00",
  },
  {
    id: "presence-10",
    employee: "Ольга Лебедева",
    role: "Инженер по качеству",
    contractor: "ООО «ТехСервис»",
    object: "БЦ «Орион»",
    room: "Паркинг",
    enteredAt: "2026-08-10T09:11:00",
    leftAt: "2026-08-10T16:14:00",
  },
  {
    id: "presence-11",
    employee: "Роман Тихонов",
    role: "Монтажник",
    contractor: "ООО «МонтажПро»",
    object: "Производственная площадка «Север»",
    room: "Цех 3",
    enteredAt: "2026-08-10T07:58:00",
    leftAt: "2026-08-10T18:08:00",
  },
  {
    id: "presence-12",
    employee: "Марина Орлова",
    role: "Электромонтажник",
    contractor: "ООО «Альфа Строй»",
    object: "Склад № 3",
    room: "Рампа",
    enteredAt: "2026-08-09T08:22:00",
    leftAt: "2026-08-09T17:36:00",
  },
  {
    id: "presence-13",
    employee: "Ксения Фролова",
    role: "Специалист по ОТ",
    contractor: "ООО «СтройГрупп»",
    object: "Логистический центр «Запад»",
    room: "Главный вход",
    enteredAt: "2026-08-08T07:58:00",
    leftAt: "2026-08-08T17:38:00",
  },
];

const REPORT_EVENTS: ExportEvent[] = [
  {
    id: "report-01",
    occurredAt: "2026-08-12T12:36:00",
    type: "Отчёт",
    employee: "Александр Петров",
    role: "Инженер ПТО",
    contractor: "ООО «Альфа Строй»",
    object: "Логистический центр «Запад»",
    details: "Отчёт за смену",
  },
  {
    id: "report-02",
    occurredAt: "2026-08-12T11:08:00",
    type: "Отчёт",
    employee: "Дмитрий Крылов",
    role: "Мастер участка",
    contractor: "ООО «ТехСервис»",
    object: "Логистический центр «Запад»",
    details: "Проверка оборудования",
  },
  {
    id: "report-03",
    occurredAt: "2026-08-12T10:36:00",
    type: "Отчёт",
    employee: "Максим Волков",
    role: "Начальник участка",
    contractor: "ООО «МонтажПро»",
    object: "Производственная площадка «Север»",
    details: "Отчёт о выполненных работах",
  },
  {
    id: "report-04",
    occurredAt: "2026-08-11T15:40:00",
    type: "Отчёт",
    employee: "Ксения Фролова",
    role: "Специалист по ОТ",
    contractor: "ООО «СтройГрупп»",
    object: "Логистический центр «Запад»",
    details: "Проверка техники безопасности",
  },
  {
    id: "report-05",
    occurredAt: "2026-08-10T16:18:00",
    type: "Отчёт",
    employee: "Ольга Лебедева",
    role: "Инженер по качеству",
    contractor: "ООО «ТехСервис»",
    object: "БЦ «Орион»",
    details: "Проверка качества работ",
  },
];

const OBJECT_ROOMS: Record<string, string[]> = {
  "Логистический центр «Запад»": [
    "Главный вход",
    "Склад А",
    "Склад Б",
    "Зона погрузки",
    "Зона разгрузки",
    "Техническая",
    "Диспетчерская",
    "Комната охраны",
    "Серверная",
    "Электрощитовая",
    "Ремонтная зона",
    "Архив",
    "Бытовая комната",
    "Парковка",
    "Резервный выход",
  ],
  "БЦ «Орион»": [
    "Холл",
    "Ресепшен",
    "Паркинг",
    "Щитовая",
    "Кровля",
    "Серверная",
    "Переговорная 1",
    "Переговорная 2",
    "Офис 201",
    "Офис 305",
    "Конференц-зал",
    "Архив",
    "Склад инвентаря",
    "Комната охраны",
    "Технический этаж",
  ],
  "Склад № 3": [
    "КПП",
    "Склад 1",
    "Склад 2",
    "Склад 3",
    "Рампа",
    "Зона приёмки",
    "Зона отгрузки",
    "Холодильная камера",
    "Комплектовочная",
    "Упаковочная",
    "Комната персонала",
    "Техническая",
    "Электрощитовая",
    "Архив",
    "Парковка",
  ],
  "Производственная площадка «Север»": [
    "Проходная № 2",
    "Цех 1",
    "Цех 2",
    "Цех 3",
    "Компрессорная",
    "Котельная",
    "Лаборатория",
    "Ремонтный участок",
    "Склад сырья",
    "Склад продукции",
    "Диспетчерская",
    "Комната мастеров",
    "Электрощитовая",
    "Погрузочная площадка",
    "Административный корпус",
  ],
};

export function roomForRecord(record: PresenceRecord) {
  if (record.room) return record.room;
  const rooms = OBJECT_ROOMS[record.object] ?? ["Территория"];
  const number = Number(record.id.match(/\d+$/)?.[0] ?? 1);
  return rooms[(number - 1) % rooms.length];
}

const PRESENCE_EVENTS: ExportEvent[] = PRESENCE_RECORDS.flatMap((record) => {
  const entry: ExportEvent = {
    id: `${record.id}-entry`,
    occurredAt: record.enteredAt,
    type: "Вход",
    employee: record.employee,
    role: record.role,
    contractor: record.contractor,
    object: record.object,
    details: roomForRecord(record),
  };
  const exit: ExportEvent[] = record.leftAt
    ? [
        {
          ...entry,
          id: `${record.id}-exit`,
          occurredAt: record.leftAt,
          type: "Выход",
          details: roomForRecord(record),
        },
      ]
    : [];
  return [entry, ...exit];
});

export const EXPORT_EVENTS: ExportEvent[] = [
  ...PRESENCE_EVENTS,
  ...REPORT_EVENTS,
].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));

const dateTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
});

function unique(values: string[]) {
  return [...new Set(values)];
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("ru-RU");
}

function formatDateTime(value: string) {
  return dateTimeFormatter.format(new Date(value));
}

export function formatDuration(record: PresenceRecord) {
  if (!record.leftAt) return "На объекте";
  const minutes = Math.max(
    0,
    Math.round(
      (new Date(record.leftAt).getTime() -
        new Date(record.enteredAt).getTime()) /
        60_000,
    ),
  );
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours ? `${hours} ч ${rest} мин` : `${rest} мин`;
}

type PresenceMode = "now" | "period";

export type PresencePageProps = {
  onOpenEmployee: (name: string) => void;
  allowedObjectNames?: readonly string[];
  records?: readonly PresenceRecord[];
};

export function PresencePage({
  onOpenEmployee,
  allowedObjectNames,
  records = PRESENCE_RECORDS,
}: PresencePageProps) {
  const [mode, setMode] = useState<PresenceMode>("now");
  const [periodStart, setPeriodStart] = useState("2026-08-11T00:00");
  const [periodEnd, setPeriodEnd] = useState("2026-08-12T23:59");
  const [objectFilter, setObjectFilter] = useState("");
  const [contractorFilter, setContractorFilter] = useState("");
  const [query, setQuery] = useState("");

  const scopedRecords = useMemo(() => {
    if (allowedObjectNames === undefined) return [...records];
    const allowed = new Set(allowedObjectNames);
    return records.filter((record) => allowed.has(record.object));
  }, [allowedObjectNames, records]);

  const objectOptions = useMemo(
    () => unique(scopedRecords.map((record) => record.object)),
    [scopedRecords],
  );
  const contractorOptions = useMemo(
    () => unique(scopedRecords.map((record) => record.contractor)),
    [scopedRecords],
  );

  const selectedObject = objectOptions.includes(objectFilter)
    ? objectFilter
    : "";
  const selectedContractor = contractorOptions.includes(contractorFilter)
    ? contractorFilter
    : "";
  const hasPeriod = Boolean(periodStart && periodEnd);
  const periodStartTime = hasPeriod ? Date.parse(periodStart) : Number.NEGATIVE_INFINITY;
  const periodEndTime = hasPeriod ? Date.parse(periodEnd) : Number.POSITIVE_INFINITY;
  const periodIsValid =
    !hasPeriod ||
    (Number.isFinite(periodStartTime) &&
      Number.isFinite(periodEndTime) &&
      periodStartTime <= periodEndTime);

  const visibleRecords = useMemo(() => {
    const search = normalize(query);
    return scopedRecords
      .filter((record) => {
        const matchesMode =
          mode === "now"
            ? record.leftAt === null
            : periodIsValid &&
              new Date(record.enteredAt).getTime() <= periodEndTime &&
              (record.leftAt === null ||
                new Date(record.leftAt).getTime() >= periodStartTime);
        const matchesSearch =
          !search ||
          normalize(
            `${record.employee} ${record.role} ${record.contractor} ${record.object}`,
          ).includes(search);
        return (
          matchesMode &&
          (!selectedObject || record.object === selectedObject) &&
          (!selectedContractor || record.contractor === selectedContractor) &&
          matchesSearch
        );
      })
      .sort((a, b) => {
        if (mode === "period") return b.enteredAt.localeCompare(a.enteredAt);
        return a.object.localeCompare(b.object, "ru") ||
          a.employee.localeCompare(b.employee, "ru");
      });
  }, [
    mode,
    periodEndTime,
    periodIsValid,
    periodStartTime,
    query,
    scopedRecords,
    selectedContractor,
    selectedObject,
  ]);

  const activeObjectCount = new Set(
    visibleRecords.map((record) => record.object),
  ).size;
  const presencePagination = usePaginatedItems(
    visibleRecords,
    [mode, periodStart, periodEnd, selectedObject, selectedContractor, query].join("|"),
  );
  const filtersAreSet = Boolean(selectedObject || selectedContractor || query);

  const clearFilters = () => {
    setObjectFilter("");
    setContractorFilter("");
    setQuery("");
  };

  const openFromKeyboard = (
    event: KeyboardEvent<HTMLTableRowElement>,
    employee: string,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpenEmployee(employee);
    }
  };

  return (
    <section className="operations-page" aria-labelledby="presence-page-title">
      <header className="operations-page__header">
        <div>
          <h1 id="presence-page-title">Кто где работает</h1>
          <p>Сотрудники на объектах сейчас и за выбранный период.</p>
        </div>
        <div className="segmented-switch op-mode-switch" aria-label="Режим просмотра">
          <button
            type="button"
            className={mode === "now" ? "is-active" : ""}
            aria-pressed={mode === "now"}
            onClick={() => setMode("now")}
          >
            Сейчас
          </button>
          <button
            type="button"
            className={mode === "period" ? "is-active" : ""}
            aria-pressed={mode === "period"}
            onClick={() => setMode("period")}
          >
            За период
          </button>
        </div>
      </header>

      <div className="op-filter-card">
        <div className="op-filter-grid">
          {mode === "period" && (
            <div className="op-field op-field--date-range">
              <span>Дата и время</span>
              <DateRangePicker
                from={periodStart}
                to={periodEnd}
                withTime
                allowEmpty
                ariaLabel="Дата и время присутствия"
                onChange={(value) => {
                  setPeriodStart(value.from);
                  setPeriodEnd(value.to);
                }}
              />
            </div>
          )}
          <div className="op-field">
            <span>Объект</span>
            <CustomSelect
              ariaLabel="Объект"
              value={selectedObject || "Все объекты"}
              options={["Все объекты", ...objectOptions]}
              onChange={(value) => setObjectFilter(value === "Все объекты" ? "" : value)}
            />
          </div>
          <div className="op-field">
            <span>Подрядчик</span>
            <CustomSelect
              ariaLabel="Подрядчик"
              value={selectedContractor || "Все подрядчики"}
              options={["Все подрядчики", ...contractorOptions]}
              onChange={(value) => setContractorFilter(value === "Все подрядчики" ? "" : value)}
            />
          </div>
          <label className="op-field op-field--search">
            <span>Поиск</span>
            <span className="op-search-input">
              <Search aria-hidden="true" size={17} />
              <input
                type="search"
                value={query}
                placeholder="Сотрудник, объект или подрядчик"
                onChange={(event) => setQuery(event.target.value)}
              />
            </span>
          </label>
        </div>
        {filtersAreSet && (
          <button type="button" className="op-reset-button" onClick={clearFilters}>
            <RotateCcw aria-hidden="true" size={14} />
            Сбросить фильтры
          </button>
        )}
        {mode === "period" && !periodIsValid && (
          <p className="op-filter-error" role="alert">
            Проверьте начало и конец периода.
          </p>
        )}
      </div>

      <div className="op-table-card">
        <div className="op-table-card__header">
          <div>
            <h2>{mode === "now" ? "Сейчас на объектах" : "Присутствие за период"}</h2>
            <p>
              Сотрудников: {visibleRecords.length} · Объектов: {activeObjectCount}
            </p>
          </div>
          <UsersRound aria-hidden="true" size={20} />
        </div>
        <div className="op-table-scroll op-export-table-wrap">
          <table className="op-table op-presence-table">
            <thead>
              <tr>
                <th>Сотрудник</th>
                <th>Объект</th>
                <th>Помещение</th>
                <th>Подрядчик</th>
                <th>Вход</th>
                <th>Выход</th>
                <th>Время на объекте</th>
              </tr>
            </thead>
            <tbody>
              {presencePagination.pageItems.map((record) => (
                <tr
                  key={record.id}
                  className="op-clickable-row"
                  tabIndex={0}
                  aria-label={`Открыть карточку сотрудника ${record.employee}`}
                  onClick={() => onOpenEmployee(record.employee)}
                  onKeyDown={(event) => openFromKeyboard(event, record.employee)}
                >
                  <td data-label="Сотрудник">
                    <div className="op-person">
                      <span>
                        <strong>{record.employee}</strong>
                        <small>{record.role}</small>
                      </span>
                    </div>
                  </td>
                  <td data-label="Объект">
                    <span className="op-cell-main">{record.object}</span>
                  </td>
                  <td data-label="Помещение">
                    <span className="op-cell-main">{roomForRecord(record)}</span>
                  </td>
                  <td data-label="Подрядчик">
                    <span className="op-cell-main">{record.contractor}</span>
                  </td>
                  <td data-label="Вход">
                    <time dateTime={record.enteredAt}>
                      {formatDateTime(record.enteredAt)}
                    </time>
                  </td>
                  <td data-label="Выход">
                    {record.leftAt ? (
                      <time dateTime={record.leftAt}>
                        {formatDateTime(record.leftAt)}
                      </time>
                    ) : (
                      <span className="op-status op-status--active">Сейчас</span>
                    )}
                  </td>
                  <td data-label="Время на объекте">
                    <span className={record.leftAt ? "" : "op-active-text"}>
                      {formatDuration(record)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visibleRecords.length && (
            <div className="op-empty-state">
              <UsersRound aria-hidden="true" size={22} />
              <strong>Сотрудники не найдены</strong>
              <span>Выберите другой период или сбросьте фильтры.</span>
            </div>
          )}
        </div>
        <DataPagination
          page={presencePagination.page}
          pageCount={presencePagination.pageCount}
          pageSize={presencePagination.pageSize}
          totalItems={visibleRecords.length}
          onPageChange={presencePagination.setPage}
        />
      </div>
    </section>
  );
}

function csvCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

function eventTone(type: ExportEventType) {
  if (type === "Вход") return "op-event-badge--entry";
  if (type === "Выход") return "op-event-badge--exit";
  return "op-event-badge--report";
}

export type ExportPageProps = {
  events?: readonly ExportEvent[];
  allowedObjectNames?: readonly string[];
  title?: string;
  exportEnabled?: boolean;
  onOpenEmployee?: (name: string) => void;
};

export function ExportPage({
  events = EXPORT_EVENTS,
  allowedObjectNames,
  title = "Экспорт",
  exportEnabled = true,
  onOpenEmployee,
}: ExportPageProps) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [objectFilter, setObjectFilter] = useState("");
  const [contractorFilter, setContractorFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | ExportEventType>("");
  const [query, setQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<ExportEvent | null>(null);
  const reportDrawerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!selectedReport) return;
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setSelectedReport(null);
        return;
      }
      if (event.key !== "Tab" || !reportDrawerRef.current) return;
      const focusable = Array.from(
        reportDrawerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    const focusFrame = window.requestAnimationFrame(() => {
      reportDrawerRef.current
        ?.querySelector<HTMLElement>("button")
        ?.focus({ preventScroll: true });
    });
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", closeOnEscape);
      window.requestAnimationFrame(() => previousFocus?.focus({ preventScroll: true }));
    };
  }, [selectedReport]);

  const scopedEvents = useMemo(() => {
    if (allowedObjectNames === undefined) return [...events];
    const allowed = new Set(allowedObjectNames);
    return events.filter((event) => allowed.has(event.object));
  }, [allowedObjectNames, events]);
  const objectOptions = useMemo(
    () => unique(scopedEvents.map((event) => event.object)),
    [scopedEvents],
  );
  const contractorOptions = useMemo(
    () => unique(scopedEvents.map((event) => event.contractor)),
    [scopedEvents],
  );
  const selectedObject = objectOptions.includes(objectFilter) ? objectFilter : "";
  const selectedContractor = contractorOptions.includes(contractorFilter)
    ? contractorFilter
    : "";
  const dateRangeIsValid = !dateFrom || !dateTo || dateFrom <= dateTo;

  const visibleEvents = useMemo(() => {
    const search = normalize(query);
    if (!dateRangeIsValid) return [];
    return scopedEvents
      .filter((event) => {
        const eventDate = event.occurredAt.slice(0, 10);
        const matchesSearch =
          !search ||
          normalize(
            `${event.employee} ${event.role} ${event.contractor} ${event.object} ${event.details}`,
          ).includes(search);
        return (
          (!dateFrom || eventDate >= dateFrom) &&
          (!dateTo || eventDate <= dateTo) &&
          (!selectedObject || event.object === selectedObject) &&
          (!selectedContractor || event.contractor === selectedContractor) &&
          (!typeFilter || event.type === typeFilter) &&
          matchesSearch
        );
      })
      .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  }, [
    dateRangeIsValid,
    dateFrom,
    dateTo,
    scopedEvents,
    selectedContractor,
    selectedObject,
    query,
    typeFilter,
  ]);

  const filtersAreSet = Boolean(
    dateFrom || dateTo || selectedObject || selectedContractor || typeFilter || query,
  );
  const exportPagination = usePaginatedItems(
    visibleEvents,
    [dateFrom, dateTo, selectedObject, selectedContractor, typeFilter, query].join("|"),
  );

  const clearFilters = () => {
    setDateFrom("");
    setDateTo("");
    setObjectFilter("");
    setContractorFilter("");
    setTypeFilter("");
    setQuery("");
  };

  const downloadCsv = () => {
    const header = [
      "Дата",
      "Время",
      "Сотрудник",
      "Должность",
      "Подрядчик",
      "Объект",
      "Тип",
      "Помещение / отчёт",
    ];
    const rows = visibleEvents.map((event) => {
      const occurredAt = new Date(event.occurredAt);
      return [
        dateFormatter.format(occurredAt),
        timeFormatter.format(occurredAt),
        event.employee,
        event.role,
        event.contractor,
        event.object,
        event.type,
        event.details,
      ];
    });
    const csv = [header, ...rows]
      .map((row) => row.map(csvCell).join(";"))
      .join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `events-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };
  const openEvent = (event: ExportEvent) => {
    if (event.type === "Отчёт") {
      setSelectedReport(event);
    }
    else onOpenEmployee?.(event.employee);
  };

  return (
    <section className="operations-page" aria-labelledby="export-page-title">
      <header className="operations-page__header">
        <div>
          <h1 id="export-page-title">{title}</h1>
          <p>
            {exportEnabled
              ? "Выберите нужные события и скачайте таблицу в CSV."
              : "Входы, выходы и отчёты сотрудников."}
          </p>
        </div>
        {exportEnabled && (
          <button
            type="button"
            className="op-primary-button op-primary-button--compact"
            disabled={!visibleEvents.length}
            onClick={downloadCsv}
          >
            <Download aria-hidden="true" size={17} />
            Скачать CSV
          </button>
        )}
      </header>

      <div className="op-filter-card">
        <div className="op-filter-grid op-filter-grid--export">
          <div className="op-field op-field--date-range">
            <span>Дата или период</span>
            <DateRangePicker
              from={dateFrom}
              to={dateTo}
              allowEmpty
              ariaLabel="Дата или период событий"
              onChange={(value) => {
                setDateFrom(value.from);
                setDateTo(value.to);
              }}
            />
          </div>
          <div className="op-field">
            <span>Объект</span>
            <CustomSelect
              ariaLabel="Объект"
              value={selectedObject || "Все объекты"}
              options={["Все объекты", ...objectOptions]}
              onChange={(value) => setObjectFilter(value === "Все объекты" ? "" : value)}
            />
          </div>
          <div className="op-field">
            <span>Подрядчик</span>
            <CustomSelect
              ariaLabel="Подрядчик"
              value={selectedContractor || "Все подрядчики"}
              options={["Все подрядчики", ...contractorOptions]}
              onChange={(value) => setContractorFilter(value === "Все подрядчики" ? "" : value)}
            />
          </div>
          <div className="op-field">
            <span>Тип</span>
            <CustomSelect
              ariaLabel="Тип события"
              value={typeFilter || "Все типы"}
              options={["Все типы", "Вход", "Выход", "Отчёт"]}
              onChange={(value) => setTypeFilter(value === "Все типы" ? "" : value as ExportEventType)}
            />
          </div>
          <label className="op-field op-field--search">
            <span>Поиск</span>
            <span className="op-search-input">
              <Search aria-hidden="true" size={17} />
              <input
                type="search"
                value={query}
                placeholder="Сотрудник, объект или описание"
                onChange={(event) => setQuery(event.target.value)}
              />
            </span>
          </label>
        </div>
        {filtersAreSet && (
          <button type="button" className="op-reset-button" onClick={clearFilters}>
            <RotateCcw aria-hidden="true" size={14} />
            Сбросить фильтры
          </button>
        )}
        {!dateRangeIsValid && (
          <p className="op-filter-error" role="alert">
            Дата «от» должна быть раньше даты «до».
          </p>
        )}
      </div>

      <div className="op-table-card">
        <div className="op-table-card__header">
          <div>
            <h2>События</h2>
            <p>Найдено: {visibleEvents.length}</p>
          </div>
          <CalendarRange aria-hidden="true" size={20} />
        </div>
        <div className="op-table-scroll">
          <table className="op-table op-export-table">
            <thead>
              <tr>
                <th>Дата и время</th>
                <th>Сотрудник</th>
                <th>Подрядчик</th>
                <th>Объект</th>
                <th>Тип</th>
                <th>Помещение / отчёт</th>
              </tr>
            </thead>
            <tbody>
              {exportPagination.pageItems.map((event) => (
                <tr
                  key={event.id}
                  className={
                    onOpenEmployee || event.type === "Отчёт"
                      ? "op-clickable-row"
                      : undefined
                  }
                  tabIndex={onOpenEmployee || event.type === "Отчёт" ? 0 : undefined}
                  aria-label={
                    event.type === "Отчёт"
                      ? `Открыть отчёт ${event.employee}`
                      : onOpenEmployee
                        ? `Открыть карточку сотрудника ${event.employee}`
                        : undefined
                  }
                  onClick={() => openEvent(event)}
                  onKeyDown={(keyboardEvent) => {
                    if (
                      (onOpenEmployee || event.type === "Отчёт") &&
                      (keyboardEvent.key === "Enter" || keyboardEvent.key === " ")
                    ) {
                      keyboardEvent.preventDefault();
                      openEvent(event);
                    }
                  }}
                >
                  <td data-label="Дата и время">
                    <time dateTime={event.occurredAt}>
                      {formatDateTime(event.occurredAt)}
                    </time>
                  </td>
                  <td data-label="Сотрудник">
                    <div className="op-person op-person--compact">
                      <span>
                        <strong>{event.employee}</strong>
                        <small>{event.role}</small>
                      </span>
                    </div>
                  </td>
                  <td data-label="Подрядчик">
                    <span className="op-cell-main">{event.contractor}</span>
                  </td>
                  <td data-label="Объект">
                    <span className="op-cell-main">{event.object}</span>
                  </td>
                  <td data-label="Тип">
                    <span className={`op-event-badge ${eventTone(event.type)}`}>
                      {event.type}
                    </span>
                  </td>
                  <td data-label="Помещение / отчёт">
                    <span className="op-cell-main op-export-details" title={event.details}>
                      {event.details}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visibleEvents.length && (
            <div className="op-empty-state">
              <CalendarRange aria-hidden="true" size={22} />
              <strong>События не найдены</strong>
              <span>Выберите другие даты или сбросьте фильтры.</span>
            </div>
          )}
        </div>
        <DataPagination
          page={exportPagination.page}
          pageCount={exportPagination.pageCount}
          pageSize={exportPagination.pageSize}
          totalItems={visibleEvents.length}
          onPageChange={exportPagination.setPage}
        />
      </div>
      <AnimatePresence>
        {selectedReport && (
        <motion.div
          className="op-report-layer"
          role="presentation"
          initial="closed"
          animate="open"
          exit="closed"
        >
          <motion.button
            className="op-report-backdrop"
            aria-label="Закрыть отчёт"
            onClick={() => setSelectedReport(null)}
            variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          />
          <motion.aside
            ref={reportDrawerRef}
            className="op-report-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="op-report-title"
            variants={{ closed: { x: "100%" }, open: { x: 0 } }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: "transform" }}
          >
            <header>
              <div>
                <small>Отчёт сотрудника</small>
                <h2 id="op-report-title">{selectedReport.details}</h2>
              </div>
              <button aria-label="Закрыть отчёт" onClick={() => setSelectedReport(null)}><X size={17} /></button>
            </header>
            <div className="op-report-body">
              <section className="op-report-details" aria-labelledby="op-report-details-title">
                <h3 id="op-report-details-title">Сведения об отчёте</h3>
                <dl className="op-report-meta">
                  <div className="op-report-meta__person">
                    <dt>Сотрудник</dt>
                    <dd>
                      <strong>{selectedReport.employee}</strong>
                      <small>{selectedReport.role}</small>
                    </dd>
                  </div>
                  <div className="op-report-meta__contractor">
                    <dt>Подрядчик</dt>
                    <dd>{selectedReport.contractor}</dd>
                  </div>
                  <div className="op-report-meta__time">
                    <dt>Дата и время</dt>
                    <dd><time>{formatDateTime(selectedReport.occurredAt)}</time></dd>
                  </div>
                  <div className="op-report-meta__object">
                    <dt>Объект</dt>
                    <dd>{selectedReport.object}</dd>
                  </div>
                </dl>
              </section>
              <section className="op-report-content">
                <div className="op-report-content__head">
                  <small>Содержание отчёта</small>
                  <h3>Результат выполненных работ</h3>
                </div>
                <p>
                  Работы за смену выполнены по плану. Отклонения и замечания,
                  требующие срочного решения, не зафиксированы.
                </p>
              </section>
            </div>
          </motion.aside>
        </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
