import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  Braces,
  Building2,
  CalendarRange,
  Check,
  ChevronDown,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  MapPinned,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { CustomSelect } from "./CustomSelect";
import { DataPagination, usePaginatedItems } from "./DataPagination";
import { DateRangePicker } from "./DateRangePicker";
import { OBJECT_CATALOG } from "./objectCatalog";
import "../styles/operations.css";

const [PRIMARY_OBJECT, SECONDARY_OBJECT, THIRD_OBJECT, FOURTH_OBJECT] =
  OBJECT_CATALOG.map((object) => object.name);

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
  tag: string;
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
    object: PRIMARY_OBJECT,
    room: "Главный вход",
    enteredAt: "2026-08-12T07:48:00",
    leftAt: null,
  },
  {
    id: "presence-02",
    employee: "Дмитрий Крылов",
    role: "Мастер участка",
    contractor: "ООО «ТехСервис»",
    object: PRIMARY_OBJECT,
    room: "Склад А",
    enteredAt: "2026-08-12T08:12:00",
    leftAt: null,
  },
  {
    id: "presence-03",
    employee: "Виктор Смирнов",
    role: "Руководитель проекта",
    contractor: "ООО «СтройГрупп»",
    object: PRIMARY_OBJECT,
    room: "Зона погрузки",
    enteredAt: "2026-08-12T09:04:00",
    leftAt: null,
  },
  {
    id: "presence-04",
    employee: "Илья Воронов",
    role: "Сервисный инженер",
    contractor: "ООО «ТехСервис»",
    object: SECONDARY_OBJECT,
    room: "Кровля",
    enteredAt: "2026-08-12T08:31:00",
    leftAt: null,
  },
  {
    id: "presence-05",
    employee: "Максим Волков",
    role: "Начальник участка",
    contractor: "ООО «МонтажПро»",
    object: FOURTH_OBJECT,
    room: "Проходная № 2",
    enteredAt: "2026-08-12T07:55:00",
    leftAt: null,
  },
  {
    id: "presence-06",
    employee: "Наталья Белова",
    role: "Инженер-сметчик",
    contractor: "ООО «МонтажПро»",
    object: FOURTH_OBJECT,
    room: "Цех 1",
    enteredAt: "2026-08-12T08:18:00",
    leftAt: null,
  },
  {
    id: "presence-07",
    employee: "Антон Зуев",
    role: "Прораб",
    contractor: "ООО «СтройГрупп»",
    object: FOURTH_OBJECT,
    room: "Цех 3",
    enteredAt: "2026-08-12T08:26:00",
    leftAt: null,
  },
  {
    id: "presence-08",
    employee: "Сергей Иванов",
    role: "Прораб",
    contractor: "ООО «Альфа Строй»",
    object: PRIMARY_OBJECT,
    room: "Техническая",
    enteredAt: "2026-08-11T08:04:00",
    leftAt: "2026-08-11T18:21:00",
  },
  {
    id: "presence-09",
    employee: "Елена Соколова",
    role: "Специалист по ОТ",
    contractor: "ООО «Альфа Строй»",
    object: THIRD_OBJECT,
    room: "Рампа",
    enteredAt: "2026-08-11T08:19:00",
    leftAt: "2026-08-11T17:49:00",
  },
  {
    id: "presence-10",
    employee: "Ольга Лебедева",
    role: "Инженер по качеству",
    contractor: "ООО «ТехСервис»",
    object: SECONDARY_OBJECT,
    room: "Паркинг",
    enteredAt: "2026-08-10T09:11:00",
    leftAt: "2026-08-10T16:14:00",
  },
  {
    id: "presence-11",
    employee: "Роман Тихонов",
    role: "Монтажник",
    contractor: "ООО «МонтажПро»",
    object: FOURTH_OBJECT,
    room: "Цех 3",
    enteredAt: "2026-08-10T07:58:00",
    leftAt: "2026-08-10T18:08:00",
  },
  {
    id: "presence-12",
    employee: "Марина Орлова",
    role: "Электромонтажник",
    contractor: "ООО «Альфа Строй»",
    object: THIRD_OBJECT,
    room: "Рампа",
    enteredAt: "2026-08-09T08:22:00",
    leftAt: "2026-08-09T17:36:00",
  },
  {
    id: "presence-13",
    employee: "Ксения Фролова",
    role: "Специалист по ОТ",
    contractor: "ООО «СтройГрупп»",
    object: PRIMARY_OBJECT,
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
    tag: "Работы за смену",
    employee: "Александр Петров",
    role: "Инженер ПТО",
    contractor: "ООО «Альфа Строй»",
    object: PRIMARY_OBJECT,
    details: "Отчёт за смену",
  },
  {
    id: "report-02",
    occurredAt: "2026-08-12T11:08:00",
    type: "Отчёт",
    tag: "Оборудование",
    employee: "Дмитрий Крылов",
    role: "Мастер участка",
    contractor: "ООО «ТехСервис»",
    object: PRIMARY_OBJECT,
    details: "Проверка оборудования",
  },
  {
    id: "report-03",
    occurredAt: "2026-08-12T10:36:00",
    type: "Отчёт",
    tag: "Работы за смену",
    employee: "Максим Волков",
    role: "Начальник участка",
    contractor: "ООО «МонтажПро»",
    object: FOURTH_OBJECT,
    details: "Отчёт о выполненных работах",
  },
  {
    id: "report-04",
    occurredAt: "2026-08-11T15:40:00",
    type: "Отчёт",
    tag: "Охрана труда",
    employee: "Ксения Фролова",
    role: "Специалист по ОТ",
    contractor: "ООО «СтройГрупп»",
    object: PRIMARY_OBJECT,
    details: "Проверка техники безопасности",
  },
  {
    id: "report-05",
    occurredAt: "2026-08-10T16:18:00",
    type: "Отчёт",
    tag: "Контроль качества",
    employee: "Ольга Лебедева",
    role: "Инженер по качеству",
    contractor: "ООО «ТехСервис»",
    object: SECONDARY_OBJECT,
    details: "Проверка качества работ",
  },
];

const OBJECT_ROOMS: Record<string, string[]> = {
  [PRIMARY_OBJECT]: [
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
  [SECONDARY_OBJECT]: [
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
  [THIRD_OBJECT]: [
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
  [FOURTH_OBJECT]: [
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
    tag: "Посещение",
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
                <th>Метка</th>
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
                  <td data-label="Метка">
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

type ExportFormat = "csv" | "xls" | "json";

type ExportDatePeriod = {
  id: number;
  from: string;
  to: string;
};

const exportPeriodValuePattern = /^\d{4}-\d{2}-\d{2}(?:T(?:[01]\d|2[0-3]):[0-5]\d)?$/;

function exportPeriodDate(value: string) {
  return value.slice(0, 10);
}

function exportPeriodHasSingleDay(period: ExportDatePeriod) {
  const from = exportPeriodDate(period.from);
  const to = exportPeriodDate(period.to);
  return Boolean(from && to && from === to);
}

function exportPeriodBoundary(value: string, endOfMinute: boolean) {
  if (!value) return "";
  const date = exportPeriodDate(value);
  const time = value.includes("T")
    ? value.slice(11, 16)
    : endOfMinute ? "23:59" : "00:00";
  return `${date}T${time}:${endOfMinute ? "59" : "00"}`;
}

type ExportMultiSelectProps = {
  label: string;
  ariaLabel: string;
  placeholder: string;
  options: readonly string[];
  selected: readonly string[];
  icon: ReactNode;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  compactOptions?: boolean;
  hint?: string;
  onChange: (values: string[]) => void;
};

function ExportMultiSelect({
  label,
  ariaLabel,
  placeholder,
  options,
  selected,
  icon,
  disabled = false,
  searchable = false,
  searchPlaceholder = "Введите для поиска",
  compactOptions = false,
  hint,
  onChange,
}: ExportMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedSet = new Set(selected);

  useEffect(() => {
    if (!open) return;
    const closeOnOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        if (searchable) setQuery("");
      }
    };
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        if (searchable) setQuery("");
      }
    };
    document.addEventListener("pointerdown", closeOnOutside);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, searchable]);

  useEffect(() => {
    if (!disabled) return;
    setOpen(false);
    setQuery("");
  }, [disabled]);

  useEffect(() => {
    if (!open || !searchable) return;
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open, searchable]);

  const triggerText = !selected.length
    ? placeholder
    : selected.length === 1
      ? selected[0]
      : `Выбрано: ${selected.length}`;

  const normalizedQuery = query.trim().toLocaleLowerCase("ru-RU");
  const visibleOptions = searchable && normalizedQuery
    ? options.filter((option) => option.toLocaleLowerCase("ru-RU").includes(normalizedQuery))
    : options;

  const toggleValue = (value: string) => {
    onChange(
      selectedSet.has(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    );
    if (searchable) setQuery("");
  };

  return (
    <div
      className={`export-multiselect ${compactOptions ? "export-multiselect--compact" : ""} ${open ? "is-open" : ""}`.trim()}
      ref={rootRef}
    >
      <span className="export-field-label">{label}</span>
      <button
        type="button"
        className="export-multiselect__trigger"
        aria-label={ariaLabel}
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="export-multiselect__icon" aria-hidden="true">{icon}</span>
        <span className={selected.length ? "has-value" : ""}>{triggerText}</span>
        <ChevronDown size={15} aria-hidden="true" />
      </button>
      {hint && <small className="export-field-hint">{hint}</small>}
      <AnimatePresence>
        {open && (
          <motion.div
            className="export-multiselect__menu"
            initial={{ opacity: 0, y: -5, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.99 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="export-multiselect__menu-head">
              <strong>{label}</strong>
              {selected.length > 0 && (
                <button type="button" onClick={() => onChange([])}>Очистить</button>
              )}
            </div>
            {searchable && (
              <label className="export-multiselect__search">
                <Search size={15} aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="text"
                  role="combobox"
                  aria-label={`Поиск: ${ariaLabel}`}
                  aria-expanded="true"
                  aria-autocomplete="list"
                  value={query}
                  placeholder={searchPlaceholder}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && query.trim() && visibleOptions.length) {
                      event.preventDefault();
                      toggleValue(visibleOptions[0]);
                    }
                  }}
                />
              </label>
            )}
            <div className="export-multiselect__options" role="group" aria-label={ariaLabel}>
              {visibleOptions.map((option) => {
                const checked = selectedSet.has(option);
                return (
                  <button
                    type="button"
                    className={checked ? "is-selected" : ""}
                    key={option}
                    onClick={() => toggleValue(option)}
                  >
                    <span className="export-option-check" aria-hidden="true">
                      {checked && <Check size={13} />}
                    </span>
                    <span>{option}</span>
                  </button>
                );
              })}
              {!visibleOptions.length && (
                <span className="export-multiselect__empty">Ничего не найдено</span>
              )}
            </div>
            <div className="export-multiselect__menu-footer">
              <span>{selected.length ? `Выбрано: ${selected.length}` : "Выбраны все"}</span>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  if (searchable) setQuery("");
                }}
              >
                Готово
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function exportRows(events: readonly ExportEvent[]) {
  return events.map((event) => {
    const occurredAt = new Date(event.occurredAt);
    return [
      dateFormatter.format(occurredAt),
      timeFormatter.format(occurredAt),
      event.employee,
      event.contractor,
      event.object,
      event.type,
      event.details,
    ];
  });
}

const EXPORT_HEADERS = [
  "Дата",
  "Время",
  "Сотрудник",
  "Подрядчик",
  "Объект",
  "Тип события",
  "Метка / отчёт",
];

function downloadBlob(content: BlobPart[], type: string, extension: string) {
  const blob = new Blob(content, { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `export-${new Date().toISOString().slice(0, 10)}.${extension}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function downloadExport(events: readonly ExportEvent[], format: ExportFormat) {
  const rows = exportRows(events);
  if (format === "csv") {
    const csv = [EXPORT_HEADERS, ...rows]
      .map((row) => row.map(csvCell).join(";"))
      .join("\r\n");
    downloadBlob(["\uFEFF", csv], "text/csv;charset=utf-8", "csv");
    return;
  }
  if (format === "json") {
    const json = events.map((event) => ({
      date: event.occurredAt.slice(0, 10),
      time: event.occurredAt.slice(11, 16),
      employee: event.employee,
      contractor: event.contractor,
      object: event.object,
      eventType: event.type,
      details: event.details,
    }));
    downloadBlob(
      [JSON.stringify(json, null, 2)],
      "application/json;charset=utf-8",
      "json",
    );
    return;
  }
  const table = `<!doctype html><html><head><meta charset="utf-8"></head><body><table border="1"><thead><tr>${EXPORT_HEADERS.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></body></html>`;
  downloadBlob(["\uFEFF", table], "application/vnd.ms-excel;charset=utf-8", "xls");
}

function selectionSummary(values: readonly string[], allLabel: string) {
  if (!values.length) return allLabel;
  if (values.length === 1) return values[0];
  return `${values[0]} и ещё ${values.length - 1}`;
}

type ExportPreviewDialogProps = {
  events: readonly ExportEvent[];
  criteria: readonly { label: string; value: string }[];
  onClose: () => void;
};

function ExportPreviewDialog({ events, criteria, onClose }: ExportPreviewDialogProps) {
  const [format, setFormat] = useState<ExportFormat>("xls");
  const dialogRef = useRef<HTMLElement>(null);
  const pagination = usePaginatedItems(
    [...events],
    events.map((event) => event.id).join("|"),
    7,
  );

  useEffect(() => {
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyPaddingRight = body.style.paddingRight;
    const previousBodyOverscroll = body.style.overscrollBehavior;
    const scrollbarGap = Math.max(0, window.innerWidth - root.clientWidth);
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    if (scrollbarGap) body.style.paddingRight = `${scrollbarGap}px`;
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
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
    window.addEventListener("keydown", handleKeyDown);
    const frame = window.requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.paddingRight = previousBodyPaddingRight;
      body.style.overscrollBehavior = previousBodyOverscroll;
      window.requestAnimationFrame(() => previousFocus?.focus());
    };
  }, [onClose]);

  const formatOptions: Array<{
    value: ExportFormat;
    title: string;
    icon: ReactNode;
  }> = [
    {
      value: "xls",
      title: "Excel",
      icon: <FileSpreadsheet size={18} />,
    },
    {
      value: "csv",
      title: "CSV",
      icon: <FileText size={18} />,
    },
    {
      value: "json",
      title: "JSON",
      icon: <Braces size={18} />,
    },
  ];

  return (
    <motion.div
      className="export-preview-layer"
      role="presentation"
      initial="closed"
      animate="open"
      exit="closed"
    >
      <motion.button
        type="button"
        className="export-preview-backdrop"
        aria-label="Закрыть предпросмотр"
        onClick={onClose}
        variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
        transition={{ duration: 0.2 }}
      />
      <motion.section
        ref={dialogRef}
        className="export-preview-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-preview-title"
        variants={{
          closed: { opacity: 0, y: 18, scale: 0.975 },
          open: { opacity: 1, y: 0, scale: 1 },
        }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="export-preview-dialog__header">
          <div>
            <span className="export-preview-kicker"><Eye size={15} /> Предпросмотр</span>
            <h2 id="export-preview-title">Проверьте состав выгрузки</h2>
            <p>{events.length} записей будут добавлены в файл</p>
          </div>
          <button type="button" className="export-preview-close" aria-label="Закрыть" onClick={onClose}>
            <X size={19} />
          </button>
        </header>

        <div className="export-preview-dialog__body">
          <div className="export-preview-main">
            <div className="export-preview-criteria" aria-label="Условия экспорта">
              {criteria.map((item) => (
                <span key={item.label}>
                  <small>{item.label}</small>
                  <strong title={item.value}>{item.value}</strong>
                </span>
              ))}
            </div>
            <div className="export-preview-table-wrap">
              <table className="export-preview-table">
                <thead>
                  <tr>
                    <th>Дата и время</th>
                    <th>Сотрудник</th>
                    <th>Подрядчик</th>
                    <th>Объект</th>
                    <th>Событие</th>
                  </tr>
                </thead>
                <tbody>
                  {pagination.pageItems.map((event) => (
                    <tr key={event.id}>
                      <td><time dateTime={event.occurredAt}>{formatDateTime(event.occurredAt)}</time></td>
                      <td><strong>{event.employee}</strong></td>
                      <td title={event.contractor}>{event.contractor}</td>
                      <td title={event.object}>{event.object}</td>
                      <td><span className={`op-event-badge ${eventTone(event.type)}`}>{event.type}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <DataPagination
                page={pagination.page}
                pageCount={pagination.pageCount}
                pageSize={pagination.pageSize}
                totalItems={events.length}
                onPageChange={pagination.setPage}
              />
            </div>
          </div>

          <aside className="export-format-panel">
            <div>
              <h3>Формат файла</h3>
            </div>
            <div className="export-format-options" role="radiogroup" aria-label="Формат экспорта">
              {formatOptions.map((option) => (
                <button
                  type="button"
                  role="radio"
                  aria-checked={format === option.value}
                  className={format === option.value ? "is-selected" : ""}
                  key={option.value}
                  onClick={() => setFormat(option.value)}
                >
                  <span className="export-format-icon" aria-hidden="true">{option.icon}</span>
                  <strong>{option.title}</strong>
                  <span className="export-format-radio" aria-hidden="true">
                    {format === option.value && <span />}
                  </span>
                </button>
              ))}
            </div>
            <div className="export-format-panel__footer">
              <span><strong>{events.length}</strong> записей</span>
              <button
                type="button"
                className="op-primary-button export-download-button"
                onClick={() => downloadExport(events, format)}
              >
                <Download size={17} aria-hidden="true" />
                Скачать файл
              </button>
            </div>
          </aside>
        </div>
      </motion.section>
    </motion.div>
  );
}

type ExportWorkspaceProps = {
  events: readonly ExportEvent[];
  allowedObjectNames?: readonly string[];
  onOpenEmployee?: (name: string) => void;
};

function ExportWorkspace({ events, allowedObjectNames, onOpenEmployee }: ExportWorkspaceProps) {
  const [periods, setPeriods] = useState<ExportDatePeriod[]>([
    { id: 1, from: "", to: "" },
  ]);
  const nextPeriodId = useRef(2);
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<ExportEventType[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [resetIconTurns, setResetIconTurns] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedExportReport, setSelectedExportReport] = useState<ExportEvent | null>(null);
  const exportReportDrawerRef = useRef<HTMLElement>(null);

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
    () => unique(
      scopedEvents
        .filter((event) =>
          !selectedObjects.length || selectedObjects.includes(event.object),
        )
        .map((event) => event.contractor),
    ),
    [scopedEvents, selectedObjects],
  );
  const employeeOptions = useMemo(
    () => unique(
      scopedEvents
        .filter(
          (event) =>
            selectedContractors.includes(event.contractor) &&
            (!selectedObjects.length || selectedObjects.includes(event.object)),
        )
        .map((event) => event.employee),
    ),
    [scopedEvents, selectedObjects, selectedContractors],
  );
  const roomOptions = useMemo(
    () => unique(
      scopedEvents
        .filter((event) =>
          event.type !== "Отчёт" &&
          (!selectedObjects.length || selectedObjects.includes(event.object)),
        )
        .map((event) => event.details),
    ),
    [scopedEvents, selectedObjects],
  );

  useEffect(() => {
    const available = new Set(contractorOptions);
    setSelectedContractors((current) =>
      current.filter((contractor) => available.has(contractor)),
    );
  }, [contractorOptions]);

  useEffect(() => {
    const available = new Set(employeeOptions);
    setSelectedEmployees((current) => current.filter((employee) => available.has(employee)));
  }, [employeeOptions]);

  useEffect(() => {
    const availableRooms = new Set(roomOptions);
    setSelectedRooms((current) => current.filter((room) => availableRooms.has(room)));
  }, [roomOptions]);

  useEffect(() => {
    if (!selectedObjects.length) {
      setSelectedRooms([]);
    }
  }, [selectedObjects]);

  const activePeriods = periods.filter((period) => period.from || period.to);
  const periodsAreValid = periods.every(
    (period) =>
      (!period.from || exportPeriodValuePattern.test(period.from)) &&
      (!period.to || exportPeriodValuePattern.test(period.to)) &&
      (!period.from || !period.to || period.from <= period.to),
  );

  const filteredEvents = useMemo(() => {
    if (!periodsAreValid) return [];
    return scopedEvents
      .filter((event) => {
        const matchesPeriod = !activePeriods.length || activePeriods.some((period) =>
          (!period.from || event.occurredAt >= exportPeriodBoundary(period.from, false)) &&
          (!period.to || event.occurredAt <= exportPeriodBoundary(period.to, true)),
        );
        return (
          matchesPeriod &&
          (!selectedObjects.length || selectedObjects.includes(event.object)) &&
          (!selectedContractors.length || selectedContractors.includes(event.contractor)) &&
          (!selectedEmployees.length || selectedEmployees.includes(event.employee)) &&
          (!selectedTypes.length || selectedTypes.includes(event.type)) &&
          (!selectedRooms.length || selectedRooms.includes(event.details))
        );
      })
      .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  }, [
    activePeriods,
    periodsAreValid,
    scopedEvents,
    selectedContractors,
    selectedEmployees,
    selectedObjects,
    selectedRooms,
    selectedTypes,
  ]);

  const appliedFilterCount = [
    activePeriods.length > 0,
    selectedObjects.length > 0,
    selectedContractors.length > 0,
    selectedEmployees.length > 0,
    selectedTypes.length > 0,
    selectedRooms.length > 0,
  ].filter(Boolean).length;

  const tablePagination = usePaginatedItems(
    filteredEvents,
    [
      ...periods.flatMap((period) => [period.from, period.to]),
      ...selectedObjects,
      ...selectedContractors,
      ...selectedEmployees,
      ...selectedTypes,
      ...selectedRooms,
    ].join("|"),
  );

  const periodSummary = !activePeriods.length
    ? "За всё доступное время"
    : activePeriods
        .map((period) => {
          const fromDate = exportPeriodDate(period.from);
          const toDate = exportPeriodDate(period.to);
          const formattedFrom = fromDate ? fromDate.split("-").reverse().join(".") : "";
          const formattedTo = toDate ? toDate.split("-").reverse().join(".") : "";
          if (fromDate && toDate && fromDate === toDate && period.from.includes("T")) {
            return `${formattedFrom}, ${period.from.slice(11, 16)} — ${period.to.slice(11, 16)}`;
          }
          if (fromDate && toDate) return `${formattedFrom} — ${formattedTo}`;
          if (fromDate) return `С ${formattedFrom}`;
          return `До ${formattedTo}`;
        })
        .join("; ");

  const criteria = [
    { label: "Период", value: periodSummary },
    { label: "Объекты", value: selectionSummary(selectedObjects, "Все объекты") },
    { label: "Подрядчики", value: selectionSummary(selectedContractors, "Все подрядчики") },
    { label: "Сотрудники", value: selectionSummary(selectedEmployees, "Все сотрудники") },
    { label: "События", value: selectionSummary(selectedTypes, "Все типы") },
    ...(selectedRooms.length
      ? [{ label: "Метки", value: selectionSummary(selectedRooms, "Все метки") }]
      : []),
  ];

  const updatePeriod = (id: number, value: { from: string; to: string }) => {
    const fromDate = exportPeriodDate(value.from);
    const toDate = exportPeriodDate(value.to);
    const nextValue = fromDate && toDate && fromDate !== toDate
      ? { from: fromDate, to: toDate }
      : value;
    setPeriods((current) => current.map((period) =>
      period.id === id ? { ...period, ...nextValue } : period,
    ));
  };

  const addPeriod = () => {
    const id = nextPeriodId.current++;
    setPeriods((current) => [...current, { id, from: "", to: "" }]);
  };

  const removePeriod = (id: number) => {
    setPeriods((current) => current.filter((period) => period.id !== id));
  };

  const clearAll = () => {
    setPeriods([{ id: nextPeriodId.current++, from: "", to: "" }]);
    setSelectedObjects([]);
    setSelectedContractors([]);
    setSelectedEmployees([]);
    setSelectedTypes([]);
    setSelectedRooms([]);
  };

  const openTableEvent = (event: ExportEvent) => {
    if (event.type === "Отчёт") setSelectedExportReport(event);
    else onOpenEmployee?.(event.employee);
  };

  useEffect(() => {
    if (!selectedExportReport) return;
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setSelectedExportReport(null);
        return;
      }
      if (event.key !== "Tab" || !exportReportDrawerRef.current) return;
      const focusable = Array.from(
        exportReportDrawerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
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
    const frame = window.requestAnimationFrame(() => {
      exportReportDrawerRef.current?.querySelector<HTMLElement>("button")?.focus();
    });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", closeOnEscape);
      window.requestAnimationFrame(() => previousFocus?.focus());
    };
  }, [selectedExportReport]);

  return (
    <section className="operations-page export-workspace" aria-label="Экспорт данных">
      <section className="export-data-table-card">
        <header className="export-data-table-card__header">
          <div className="export-data-table-title">
            <span className="export-section-icon"><FileSpreadsheet size={17} /></span>
            <div>
              <h2>Данные для экспорта</h2>
            </div>
          </div>
          <div className="export-table-actions">
            {appliedFilterCount > 0 && (
              <span className="export-active-filter-count">
                <Filter size={13} /> {appliedFilterCount}
              </span>
            )}
            <button
              type="button"
              className="export-table-reset-button"
              onClick={() => {
                clearAll();
                setResetIconTurns((turns) => turns + 1);
              }}
              aria-label="Сбросить все фильтры"
              title="Сбросить все фильтры"
            >
              <motion.span
                initial={false}
                animate={{
                  rotate: resetIconTurns * -360,
                  scale: resetIconTurns ? [1, 0.88, 1.06, 1] : 1,
                }}
                transition={{
                  rotate: { duration: 1.25, ease: [0.18, 0.72, 0.22, 1] },
                  scale: {
                    duration: 1.25,
                    ease: [0.18, 0.72, 0.22, 1],
                    times: [0, 0.18, 0.68, 1],
                  },
                }}
                aria-hidden="true"
              >
                <RefreshCw size={16} />
              </motion.span>
            </button>
            <button
              type="button"
              className="op-primary-button export-table-export-button"
              disabled={!periodsAreValid || !filteredEvents.length}
              onClick={() => setPreviewOpen(true)}
            >
              <Download size={16} aria-hidden="true" />
              Экспортировать
            </button>
          </div>
        </header>

        <div className="export-table-filter-panel">
          <div className="export-primary-filter-grid">
            <div className="export-primary-period-filter">
              <span className="export-field-label">Период</span>
              <div className="export-primary-period-control">
                <DateRangePicker
                  from={periods[0]?.from ?? ""}
                  to={periods[0]?.to ?? ""}
                  withTime={Boolean(periods[0] && exportPeriodHasSingleDay(periods[0]))}
                  allowEmpty
                  ariaLabel="Основной период"
                  onChange={(value) => updatePeriod(periods[0].id, value)}
                />
                <button
                  type="button"
                  aria-label="Добавить ещё период"
                  title="Добавить ещё период"
                  onClick={addPeriod}
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>
            <ExportMultiSelect
              label="Объекты"
              ariaLabel="Выбрать объекты"
              placeholder="Все объекты"
              options={objectOptions}
              selected={selectedObjects}
              icon={<MapPinned size={16} />}
              searchable
              searchPlaceholder="Введите название объекта"
              onChange={setSelectedObjects}
            />
            <ExportMultiSelect
              label="Подрядчики"
              ariaLabel="Выбрать подрядчиков"
              placeholder="Все подрядчики"
              options={contractorOptions}
              selected={selectedContractors}
              icon={<Building2 size={16} />}
              searchable
              searchPlaceholder="Введите подрядчика"
              onChange={setSelectedContractors}
            />
            <ExportMultiSelect
              label="Сотрудники"
              ariaLabel="Выбрать сотрудников"
              placeholder="Все сотрудники"
              options={employeeOptions}
              selected={selectedEmployees}
              icon={<UserRound size={16} />}
              disabled={!selectedContractors.length}
              searchable
              searchPlaceholder="Введите сотрудника"
              onChange={setSelectedEmployees}
            />
            <ExportMultiSelect
              label="Тип события"
              ariaLabel="Выбрать типы событий"
              placeholder="Все типы"
              options={["Вход", "Выход", "Отчёт"]}
              selected={selectedTypes}
              icon={<FileText size={16} />}
              onChange={(values) => setSelectedTypes(values as ExportEventType[])}
            />
          </div>

          <div className="export-table-advanced-motion">
            <div className="export-table-advanced-panel">
              <div className="export-advanced-fields">
                <ExportMultiSelect
                  label="Метка"
                  ariaLabel="Выбрать метки"
                  placeholder="Все метки"
                  options={roomOptions}
                  selected={selectedRooms}
                  icon={<MapPinned size={16} />}
                  disabled={!selectedObjects.length}
                  searchable
                  searchPlaceholder="Введите метку"
                  compactOptions
                  onChange={setSelectedRooms}
                />
              </div>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {periods.length > 1 && (
              <motion.div
                className="export-extra-periods-motion"
                initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  overflow: "visible",
                }}
                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                transition={{
                  height: { duration: 0.44, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.24, ease: "easeOut" },
                }}
              >
                <div className="export-extra-periods">
                  <span className="export-extra-periods__label">Дополнительные периоды</span>
                  <div className="export-extra-periods__list">
                    <AnimatePresence initial={false} mode="popLayout">
                      {periods.slice(1).map((period, index) => (
                        <motion.div
                          layout
                          className="export-extra-period"
                          key={period.id}
                          initial={{ opacity: 0, y: -8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, x: 18, scale: 0.98 }}
                          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <span>{index + 2}</span>
                          <DateRangePicker
                            from={period.from}
                            to={period.to}
                            withTime={exportPeriodHasSingleDay(period)}
                            allowEmpty
                            ariaLabel={`Дополнительный период ${index + 1}`}
                            onChange={(value) => updatePeriod(period.id, value)}
                          />
                          <button
                            type="button"
                            aria-label={`Удалить дополнительный период ${index + 1}`}
                            onClick={() => removePeriod(period.id)}
                          >
                            <X size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        <div className="op-table-scroll export-main-table-wrap">
          <table className="op-table op-export-table export-main-table">
            <thead>
              <tr>
                <th>Дата и время</th>
                <th>Сотрудник</th>
                <th>Подрядчик</th>
                <th>Объект</th>
                <th className="op-type-column">Тип</th>
                <th>Метка / отчёт</th>
              </tr>
            </thead>
            <tbody>
              {tablePagination.pageItems.map((event) => (
                <tr
                  key={event.id}
                  className={onOpenEmployee || event.type === "Отчёт" ? "op-clickable-row" : undefined}
                  tabIndex={onOpenEmployee || event.type === "Отчёт" ? 0 : undefined}
                  onClick={() => openTableEvent(event)}
                  onKeyDown={(keyboardEvent) => {
                    if (
                      (onOpenEmployee || event.type === "Отчёт") &&
                      (keyboardEvent.key === "Enter" || keyboardEvent.key === " ")
                    ) {
                      keyboardEvent.preventDefault();
                      openTableEvent(event);
                    }
                  }}
                >
                  <td data-label="Дата и время"><time dateTime={event.occurredAt}>{formatDateTime(event.occurredAt)}</time></td>
                  <td data-label="Сотрудник">
                    <div className="op-person op-person--compact"><span><strong>{event.employee}</strong></span></div>
                  </td>
                  <td data-label="Подрядчик"><span className="op-cell-main" title={event.contractor}>{event.contractor}</span></td>
                  <td data-label="Объект"><span className="op-cell-main" title={event.object}>{event.object}</span></td>
                  <td className="op-type-column" data-label="Тип">
                    <span className="op-type-column__content">
                      <span className={`op-event-badge ${eventTone(event.type)}`}>{event.type}</span>
                    </span>
                  </td>
                  <td data-label="Метка / отчёт"><span className="op-cell-main op-export-details" title={event.details}>{event.details}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filteredEvents.length && (
            <div className="op-empty-state export-table-empty">
              <Filter aria-hidden="true" size={22} />
              <strong>По выбранным фильтрам данных нет</strong>
              <span>Измените условия или сбросьте фильтры.</span>
            </div>
          )}
        </div>
        <DataPagination
          page={tablePagination.page}
          pageCount={tablePagination.pageCount}
          pageSize={tablePagination.pageSize}
          totalItems={filteredEvents.length}
          onPageChange={tablePagination.setPage}
        />
      </section>

      <AnimatePresence>
        {previewOpen && (
          <ExportPreviewDialog
            events={filteredEvents}
            criteria={criteria}
            onClose={() => setPreviewOpen(false)}
          />
        )}
        {selectedExportReport && (
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
              onClick={() => setSelectedExportReport(null)}
              variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            />
            <motion.aside
              ref={exportReportDrawerRef}
              className="op-report-drawer"
              role="dialog"
              aria-modal="true"
              aria-labelledby="export-report-title"
              variants={{ closed: { x: "100%" }, open: { x: 0 } }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              style={{ willChange: "transform" }}
            >
              <header>
                <div>
                  <small>Отчёт сотрудника</small>
                  <h2 id="export-report-title">{selectedExportReport.details}</h2>
                </div>
                <button aria-label="Закрыть отчёт" onClick={() => setSelectedExportReport(null)}><X size={17} /></button>
              </header>
              <div className="op-report-body">
                <section className="op-report-details" aria-labelledby="export-report-details-title">
                  <h3 id="export-report-details-title">Сведения об отчёте</h3>
                  <dl className="op-report-meta">
                    <div className="op-report-meta__person">
                      <dt>Сотрудник</dt>
                      <dd><strong>{selectedExportReport.employee}</strong></dd>
                    </div>
                    <div className="op-report-meta__contractor"><dt>Подрядчик</dt><dd>{selectedExportReport.contractor}</dd></div>
                    <div className="op-report-meta__time"><dt>Дата и время</dt><dd><time>{formatDateTime(selectedExportReport.occurredAt)}</time></dd></div>
                    <div className="op-report-meta__object"><dt>Объект</dt><dd>{selectedExportReport.object}</dd></div>
                  </dl>
                </section>
                <section className="op-report-content">
                  <div className="op-report-content__head"><small>Содержание отчёта</small><h3>Результат выполненных работ</h3></div>
                  <p>Работы за смену выполнены по плану. Отклонения и замечания, требующие срочного решения, не зафиксированы.</p>
                </section>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
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
  const [journalResetTurns, setJournalResetTurns] = useState(0);
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
  const dateFromDay = dateFrom.slice(0, 10);
  const dateToDay = dateTo.slice(0, 10);
  const journalHasSingleDay = Boolean(
    dateFromDay && dateToDay && dateFromDay === dateToDay,
  );
  const dateFromBoundary = dateFrom
    ? dateFrom.includes("T")
      ? `${dateFrom}:00`
      : `${dateFrom}T00:00:00`
    : "";
  const dateToBoundary = dateTo
    ? dateTo.includes("T")
      ? `${dateTo}:59`
      : `${dateTo}T23:59:59`
    : "";
  const dateRangeIsValid =
    !dateFromBoundary || !dateToBoundary || dateFromBoundary <= dateToBoundary;

  const visibleEvents = useMemo(() => {
    const search = normalize(query);
    if (!dateRangeIsValid) return [];
    return scopedEvents
      .filter((event) => {
        const matchesSearch =
          !search ||
          normalize(
            `${event.employee} ${event.role} ${event.contractor} ${event.object} ${event.details}`,
          ).includes(search);
        return (
          (!dateFromBoundary || event.occurredAt >= dateFromBoundary) &&
          (!dateToBoundary || event.occurredAt <= dateToBoundary) &&
          (!selectedObject || event.object === selectedObject) &&
          (!selectedContractor || event.contractor === selectedContractor) &&
          (!typeFilter || event.type === typeFilter) &&
          matchesSearch
        );
      })
      .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  }, [
    dateRangeIsValid,
    dateFromBoundary,
    dateToBoundary,
    scopedEvents,
    selectedContractor,
    selectedObject,
    query,
    typeFilter,
  ]);

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
      "Метка / отчёт",
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

  if (exportEnabled) {
    return (
      <ExportWorkspace
        events={events}
        allowedObjectNames={allowedObjectNames}
        onOpenEmployee={onOpenEmployee}
      />
    );
  }

  return (
    <section className="operations-page journal-page" aria-label={title}>
      <div className="op-filter-card">
        <div className="op-filter-grid op-filter-grid--export journal-filter-grid">
          <div className="op-field op-field--date-range">
            <span>Дата или период</span>
            <DateRangePicker
              from={dateFrom}
              to={dateTo}
              withTime={journalHasSingleDay}
              allowEmpty
              ariaLabel="Дата или период событий"
              onChange={(value) => {
                const nextFromDay = value.from.slice(0, 10);
                const nextToDay = value.to.slice(0, 10);
                const nextIsSingleDay = Boolean(
                  nextFromDay && nextToDay && nextFromDay === nextToDay,
                );
                setDateFrom(nextIsSingleDay ? value.from : nextFromDay);
                setDateTo(nextIsSingleDay ? value.to : nextToDay);
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
          <button
            type="button"
            className="journal-reset-button"
            onClick={() => {
              clearFilters();
              setJournalResetTurns((turns) => turns + 1);
            }}
            aria-label="Сбросить все фильтры"
            title="Сбросить все фильтры"
          >
            <motion.span
              initial={false}
              animate={{ rotate: journalResetTurns * -360 }}
              transition={{ duration: 0.7, ease: [0.18, 0.72, 0.22, 1] }}
              aria-hidden="true"
            >
              <RefreshCw size={16} />
            </motion.span>
          </button>
        </div>
        {!dateRangeIsValid && (
          <p className="op-filter-error" role="alert">
            Начало периода должно быть раньше окончания.
          </p>
        )}
      </div>

      <div className="op-table-card">
        <div className="op-table-scroll">
          <table className="op-table op-export-table">
            <thead>
              <tr>
                <th>Дата и время</th>
                <th>Сотрудник</th>
                <th>Подрядчик</th>
                <th>Объект</th>
                <th className="op-type-column">Тип</th>
                <th>Метка / отчёт</th>
              </tr>
            </thead>
            <tbody>
              {visibleEvents.map((event) => (
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
                  <td className="op-type-column" data-label="Тип">
                    <span className="op-type-column__content">
                      <span className={`op-event-badge ${eventTone(event.type)}`}>
                        {event.type}
                      </span>
                    </span>
                  </td>
                  <td data-label="Метка / отчёт">
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
