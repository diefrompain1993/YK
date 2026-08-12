import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Search,
  UserRound,
  UsersRound,
} from "lucide-react";
import {
  formatDuration,
  roomForRecord,
  type PresenceRecord,
} from "./OperationsPages";
import { DataPagination, usePaginatedItems } from "./DataPagination";
import { DateRangePicker } from "./DateRangePicker";
import { TimePicker } from "./TimePicker";
import "../styles/contractor-presence-matrix.css";

type GroupMode = "employees" | "objects";

export type ContractorPresenceMatrixProps = {
  contractor: string;
  allowedObjectNames: readonly string[];
  records: readonly PresenceRecord[];
  onOpenEmployee: (name: string) => void;
};

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
});

function startOfDay(value: Date) {
  const result = new Date(value);
  result.setHours(0, 0, 0, 0);
  return result;
}

function addDays(value: Date, amount: number) {
  const result = new Date(value);
  result.setDate(result.getDate() + amount);
  return result;
}

function toDateInput(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function latestRecordDate(records: readonly PresenceRecord[]) {
  if (!records.length) return startOfDay(new Date());
  return startOfDay(
    new Date(
      Math.max(...records.map((record) => new Date(record.enteredAt).getTime())),
    ),
  );
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("ru-RU");
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

function visitTime(record: PresenceRecord) {
  const entered = timeFormatter.format(new Date(record.enteredAt));
  const left = record.leftAt
    ? timeFormatter.format(new Date(record.leftAt))
    : "сейчас";
  return `${entered} — ${left}`;
}

function pluralize(value: number, one: string, few: string, many: string) {
  const lastTwo = value % 100;
  const last = value % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return many;
  if (last === 1) return one;
  if (last >= 2 && last <= 4) return few;
  return many;
}

export function ContractorPresenceMatrix({
  contractor,
  allowedObjectNames,
  records,
  onOpenEmployee,
}: ContractorPresenceMatrixProps) {
  const scopedRecords = useMemo(() => {
    const allowed = new Set(allowedObjectNames);
    return records.filter(
      (record) =>
        record.contractor === contractor && allowed.has(record.object),
    );
  }, [allowedObjectNames, contractor, records]);

  const initialEnd = latestRecordDate(scopedRecords);
  const [mode, setMode] = useState<GroupMode>("employees");
  const [periodFrom, setPeriodFrom] = useState(() =>
    toDateInput(addDays(initialEnd, -6)),
  );
  const [periodTo, setPeriodTo] = useState(() => toDateInput(initialEnd));
  const [timeFrom, setTimeFrom] = useState("00:00");
  const [timeTo, setTimeTo] = useState("23:59");
  const [query, setQuery] = useState("");
  const [onlyActive, setOnlyActive] = useState(false);

  useEffect(() => {
    const end = latestRecordDate(scopedRecords);
    setPeriodFrom(toDateInput(addDays(end, -6)));
    setPeriodTo(toDateInput(end));
    setTimeFrom("00:00");
    setTimeTo("23:59");
    setQuery("");
    setOnlyActive(false);
  }, [contractor]);

  const isValidTime = (value: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
  const timeFromIsValid = isValidTime(timeFrom);
  const timeToIsValid = isValidTime(timeTo);
  const hasPeriod = Boolean(periodFrom && periodTo);
  const effectiveFrom = hasPeriod && timeFromIsValid
    ? new Date(`${periodFrom}T${timeFrom}`)
    : new Date(0);
  const effectiveTo = hasPeriod && timeToIsValid
    ? new Date(`${periodTo}T${timeTo}`)
    : new Date(8640000000000000);
  const periodOrderIsValid = !hasPeriod || effectiveFrom <= effectiveTo;
  const filtersAreValid = timeFromIsValid && timeToIsValid && periodOrderIsValid;
  const normalizedQuery = normalize(query);

  const filteredRecords = useMemo(
    () =>
      scopedRecords
        .filter((record) => {
          if (!filtersAreValid) return false;
          const entered = new Date(record.enteredAt);
          const left = record.leftAt ? new Date(record.leftAt) : new Date();
          const overlapsPeriod = entered <= effectiveTo && left >= effectiveFrom;
          if (!overlapsPeriod || (onlyActive && record.leftAt)) return false;
          if (!normalizedQuery) return true;
          return normalize(
            [
              record.employee,
              record.role,
              record.object,
              roomForRecord(record),
            ].join(" "),
          ).includes(normalizedQuery);
        })
        .sort(
          (a, b) =>
            new Date(b.enteredAt).getTime() - new Date(a.enteredAt).getTime(),
        ),
    [
      effectiveFrom,
      effectiveTo,
      filtersAreValid,
      normalizedQuery,
      onlyActive,
      scopedRecords,
    ],
  );

  const pagination = usePaginatedItems(
    filteredRecords,
    [contractor, mode, periodFrom, periodTo, timeFrom, timeTo, query, String(onlyActive)].join("|"),
  );

  const pageObjects = useMemo(() => {
    const grouped = new Map<string, PresenceRecord[]>();
    pagination.pageItems.forEach((record) => {
      grouped.set(record.object, [
        ...(grouped.get(record.object) ?? []),
        record,
      ]);
    });
    return [...grouped.entries()]
      .map(([name, objectRecords]) => ({
        name,
        records: objectRecords,
        people: new Set(objectRecords.map((record) => record.employee)).size,
        active: new Set(
          objectRecords
            .filter((record) => !record.leftAt)
            .map((record) => record.employee),
        ).size,
      }))
      .sort(
        (a, b) =>
          b.active - a.active || a.name.localeCompare(b.name, "ru-RU"),
      );
  }, [pagination.pageItems]);

  return (
    <section className="cpm" aria-label="История посещений">
      <div className="cpm__heading cpm__heading--controls">
        <div
          className="segmented-switch cpm__mode"
          role="tablist"
          aria-label="Группировка присутствия"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "employees"}
            className={mode === "employees" ? "is-active" : undefined}
            onClick={() => setMode("employees")}
          >
            <UsersRound size={16} aria-hidden="true" />
            По сотрудникам
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "objects"}
            className={mode === "objects" ? "is-active" : undefined}
            onClick={() => setMode("objects")}
          >
            <MapPin size={16} aria-hidden="true" />
            По объектам
          </button>
        </div>
      </div>

      <div className="cpm__toolbar">
        <label className="cpm__search">
          <Search size={17} aria-hidden="true" />
          <span className="cpm-sr-only">Поиск</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Сотрудник, объект или помещение"
          />
        </label>

        <div className="cpm__filter-field cpm__filter-field--date">
          <span>Дата или период</span>
          <DateRangePicker
            from={periodFrom}
            to={periodTo}
            allowEmpty
            ariaLabel="Дата или период посещений"
            onChange={(value) => {
              setPeriodFrom(value.from);
              setPeriodTo(value.to);
            }}
          />
        </div>

        <label className="cpm__filter-field">
          <span>Время с</span>
          <TimePicker
            placeholder="00:00"
            value={timeFrom}
            ariaLabel="Время с"
            invalid={!timeFromIsValid}
            onChange={setTimeFrom}
          />
        </label>

        <label className="cpm__filter-field">
          <span>Время по</span>
          <TimePicker
            placeholder="23:59"
            value={timeTo}
            ariaLabel="Время по"
            invalid={!timeToIsValid}
            onChange={setTimeTo}
          />
        </label>

        <label className="cpm__active-control">
          <input
            type="checkbox"
            checked={onlyActive}
            onChange={(event) => setOnlyActive(event.target.checked)}
          />
          <span className="cpm__checkbox" aria-hidden="true" />
          Только сейчас
        </label>
        {(!timeFromIsValid || !timeToIsValid) && (
          <small className="cpm__filter-error" role="alert">
            Укажите время от 00:00 до 23:59.
          </small>
        )}
        {timeFromIsValid && timeToIsValid && !periodOrderIsValid && (
          <small className="cpm__filter-error" role="alert">
            Начало периода должно быть раньше его окончания.
          </small>
        )}
      </div>

      {mode === "employees" ? (
        <div className="cpm__people-table-wrap" role="tabpanel">
          {pagination.pageItems.length ? (
            <table className="cpm__people-table">
              <thead>
                <tr>
                  <th>Сотрудник</th>
                  <th>Объект и помещение</th>
                  <th>Дата и время</th>
                  <th>Длительность</th>
                </tr>
              </thead>
              <tbody>
                {pagination.pageItems.map((record) => (
                    <tr
                      key={record.id}
                      tabIndex={0}
                      role="button"
                      aria-label={`Открыть сотрудника: ${record.employee}`}
                      onClick={() => onOpenEmployee(record.employee)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onOpenEmployee(record.employee);
                        }
                      }}
                    >
                      <td data-label="Сотрудник">
                        <span className="cpm__table-person">
                          <span className="cpm__avatar" aria-hidden="true">
                            {initials(record.employee)}
                          </span>
                          <span className="cpm__person-copy">
                            <strong>{record.employee}</strong>
                            <small>{record.role}</small>
                          </span>
                        </span>
                      </td>
                      <td data-label="Объект и помещение">
                        <span className="cpm__table-place">
                          <strong>{record.object}</strong>
                          <small><MapPin size={13} aria-hidden="true" />{roomForRecord(record)}</small>
                        </span>
                      </td>
                      <td data-label="Дата и время">
                        <span className="cpm__table-time">
                          <strong>{dateFormatter.format(new Date(record.enteredAt))}</strong>
                          <small>{visitTime(record)}</small>
                        </span>
                      </td>
                      <td data-label="Длительность">
                        <span className={record.leftAt ? "cpm__visit-status" : "cpm__visit-status is-active"}>
                          {formatDuration(record)}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <EmptyState />
          )}
        </div>
      ) : (
        <div className="cpm__object-list" role="tabpanel">
          {pageObjects.length ? (
            pageObjects.map((object) => (
              <article className="cpm__object" key={object.name}>
                <header className="cpm__object-head">
                  <span className="cpm__object-icon" aria-hidden="true">
                    <MapPin size={18} />
                  </span>
                  <div>
                    <h3>{object.name}</h3>
                    <p>
                      {object.people} {pluralize(object.people, "сотрудник", "сотрудника", "сотрудников")}
                      <span aria-hidden="true"> · </span>
                      {object.records.length} {pluralize(object.records.length, "посещение", "посещения", "посещений")}
                    </p>
                  </div>
                  {object.active > 0 && (
                    <span className="cpm__object-active">Сейчас: {object.active}</span>
                  )}
                </header>
                <div className="cpm__object-visits">
                  {object.records.map((record) => (
                    <button
                      type="button"
                      className="cpm__object-visit"
                      key={record.id}
                      onClick={() => onOpenEmployee(record.employee)}
                    >
                      <span className="cpm__avatar" aria-hidden="true">
                        {initials(record.employee)}
                      </span>
                      <span className="cpm__object-person">
                        <strong>{record.employee}</strong>
                        <small>{record.role}</small>
                      </span>
                      <span className="cpm__object-room">
                        <MapPin size={14} aria-hidden="true" />
                        {roomForRecord(record)}
                      </span>
                      <span className="cpm__object-time">
                        <CalendarDays size={14} aria-hidden="true" />
                        {dateFormatter.format(new Date(record.enteredAt))}
                        <span aria-hidden="true">·</span>
                        {visitTime(record)}
                      </span>
                      <span
                        className={
                          record.leftAt
                            ? "cpm__visit-status"
                            : "cpm__visit-status is-active"
                        }
                      >
                        {formatDuration(record)}
                      </span>
                    </button>
                  ))}
                </div>
              </article>
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      )}
      <DataPagination
        page={pagination.page}
        pageCount={pagination.pageCount}
        pageSize={pagination.pageSize}
        totalItems={filteredRecords.length}
        onPageChange={pagination.setPage}
      />
    </section>
  );
}

function EmptyState() {
  return (
    <div className="cpm__empty">
      <span aria-hidden="true">
        <UserRound size={22} />
      </span>
      <strong>Нет данных за этот период</strong>
      <p>Измените даты или очистите поиск.</p>
    </div>
  );
}
