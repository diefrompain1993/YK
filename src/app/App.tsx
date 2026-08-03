import {
  Fragment,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type DragEvent,
  type ReactNode,
} from "react";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  ChevronLeft,
  ClipboardList,
  DoorClosed,
  DoorOpen,
  Download,
  Home,
  LayoutDashboard,
  MapPin,
  Menu,
  Pencil,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Tag,
  Trash2,
  Users,
  X,
  Upload,
  LogOut,
  RefreshCw,
  GripVertical,
  KeyRound,
  Eye,
  EyeOff,
  Activity,
  ArrowUpRight,
  Clock3,
  Radio,
  ShieldCheck,
  UserCheck,
  BarChart3,
  FileCheck2,
  TrendingUp,
  ScrollText,
  Check,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";

type Employee = {
  name: string;
  initials: string;
  role: string;
  dept: string;
  phone: string;
  email: string;
  added: string;
  status: "Активен" | "Неактивен";
  contractor: string;
};
type ObjectItem = {
  name: string;
  address: string;
  code: string;
  status: "Активен" | "Неактивен";
};
type AppPage =
  | "home"
  | "contractors"
  | "contractor"
  | "objects"
  | "object"
  | "settings"
  | "tags";
type TagItem = {
  id: string;
  uid: string;
  color: string;
  owner?: string;
  action?: "Вход" | "Выход";
};
type TagType = "Не выбран" | "Посещение" | "Журнал";
type ManagedTag = TagItem & {
  business: string;
  title: string;
  type: TagType;
  contractors: string[];
  active: boolean;
  isNew?: boolean;
};

const contractors = [
  "ООО «Альфа Строй»",
  "ООО «ТехСервис»",
  "ООО «МонтажПро»",
  "ООО «СтройГрупп»",
];
const staff: Employee[] = [
  {
    name: "Александр Петров",
    initials: "АП",
    role: "Инженер ПТО",
    dept: "Технический отдел",
    phone: "+7 926 418-26-54",
    email: "a.petrov@alfastroi.ru",
    added: "14.05.2026",
    status: "Активен",
    contractor: contractors[0],
  },
  {
    name: "Елена Соколова",
    initials: "ЕС",
    role: "Специалист по ОТ",
    dept: "Администрация",
    phone: "+7 916 706-19-80",
    email: "e.sokolova@alfastroi.ru",
    added: "11.05.2026",
    status: "Неактивен",
    contractor: contractors[0],
  },
  {
    name: "Сергей Иванов",
    initials: "СИ",
    role: "Прораб",
    dept: "Производственный отдел",
    phone: "+7 985 120-48-11",
    email: "s.ivanov@alfastroi.ru",
    added: "04.05.2026",
    status: "Активен",
    contractor: contractors[0],
  },
  {
    name: "Марина Орлова",
    initials: "МО",
    role: "Электромонтажник",
    dept: "Монтажный отдел",
    phone: "+7 903 551-07-29",
    email: "m.orlova@alfastroi.ru",
    added: "26.04.2026",
    status: "Неактивен",
    contractor: contractors[0],
  },
  {
    name: "Дмитрий Крылов",
    initials: "ДК",
    role: "Мастер участка",
    dept: "Производственный отдел",
    phone: "+7 977 333-68-20",
    email: "d.krylov@techservice.ru",
    added: "21.04.2026",
    status: "Активен",
    contractor: contractors[1],
  },
  {
    name: "Ольга Лебедева",
    initials: "ОЛ",
    role: "Инженер по качеству",
    dept: "Технический отдел",
    phone: "+7 916 440-31-76",
    email: "o.lebedeva@techservice.ru",
    added: "18.04.2026",
    status: "Активен",
    contractor: contractors[1],
  },
  {
    name: "Илья Воронов",
    initials: "ИВ",
    role: "Сервисный инженер",
    dept: "Производственный отдел",
    phone: "+7 985 318-52-09",
    email: "i.voronov@techservice.ru",
    added: "12.04.2026",
    status: "Активен",
    contractor: contractors[1],
  },
  {
    name: "Максим Волков",
    initials: "МВ",
    role: "Начальник участка",
    dept: "Производственный отдел",
    phone: "+7 903 208-41-65",
    email: "m.volkov@montazhpro.ru",
    added: "09.04.2026",
    status: "Активен",
    contractor: contractors[2],
  },
  {
    name: "Наталья Белова",
    initials: "НБ",
    role: "Инженер-сметчик",
    dept: "Технический отдел",
    phone: "+7 977 615-20-47",
    email: "n.belova@montazhpro.ru",
    added: "02.04.2026",
    status: "Активен",
    contractor: contractors[2],
  },
  {
    name: "Роман Тихонов",
    initials: "РТ",
    role: "Монтажник",
    dept: "Монтажный отдел",
    phone: "+7 926 390-16-22",
    email: "r.tikhonov@montazhpro.ru",
    added: "28.03.2026",
    status: "Неактивен",
    contractor: contractors[2],
  },
  {
    name: "Виктор Смирнов",
    initials: "ВС",
    role: "Руководитель проекта",
    dept: "Администрация",
    phone: "+7 916 201-73-84",
    email: "v.smirnov@stroygroup.ru",
    added: "22.03.2026",
    status: "Активен",
    contractor: contractors[3],
  },
  {
    name: "Антон Зуев",
    initials: "АЗ",
    role: "Прораб",
    dept: "Производственный отдел",
    phone: "+7 985 412-86-05",
    email: "a.zuev@stroygroup.ru",
    added: "18.03.2026",
    status: "Активен",
    contractor: contractors[3],
  },
  {
    name: "Ксения Фролова",
    initials: "КФ",
    role: "Специалист по ОТ",
    dept: "Администрация",
    phone: "+7 903 540-19-68",
    email: "k.frolova@stroygroup.ru",
    added: "11.03.2026",
    status: "Активен",
    contractor: contractors[3],
  },
];
const objectsInitial: ObjectItem[] = [
  {
    name: "Логистический центр «Запад»",
    address: "г. Москва, ул. Рябиновая, 22",
    code: "LC-ZAP-01",
    status: "Активен",
  },
  {
    name: "БЦ «Орион»",
    address: "г. Москва, Ленинградский пр-т, 80",
    code: "BC-OR-02",
    status: "Активен",
  },
  {
    name: "Склад № 3",
    address: "г. Химки, Коммунальный проезд, 16",
    code: "SKL-03",
    status: "Неактивен",
  },
  {
    name: "Производственная площадка «Север»",
    address: "г. Мытищи, Олимпийский пр-т, 42",
    code: "PP-SEV-04",
    status: "Активен",
  },
];
const UNASSIGNED_BUSINESS = "Без бизнес-центра";
const tagBusinessGroups: ObjectItem[] = [
  ...objectsInitial,
  {
    name: UNASSIGNED_BUSINESS,
    address: "Метки, которые ещё не назначены объекту",
    code: "NO-LINK",
    status: "Неактивен",
  },
];
const initialTags: TagItem[] = [
  { id: "NFC-001", uid: "04:A7:2C:9F", color: "bg-blue-500" },
  { id: "NFC-002", uid: "04:6D:58:11", color: "bg-violet-500" },
  { id: "NFC-003", uid: "04:BA:21:EE", color: "bg-emerald-500" },
  {
    id: "NFC-004",
    uid: "04:19:63:74",
    color: "bg-orange-500",
    owner: contractors[0],
    action: "Вход",
  },
  {
    id: "NFC-005",
    uid: "04:90:F1:2B",
    color: "bg-rose-500",
    owner: contractors[1],
    action: "Выход",
  },
];

type LogRecord = {
  id: string;
  date: string;
  time: string;
  employee: string;
  initials: string;
  event: "Вход" | "Выход" | "Отчёт";
  object: string;
  details: string;
  status: "Успешно" | "Принято" | "На проверке";
};

type ContractorProfile = {
  visits: number[];
  visitedToday: number;
  assignedObjects: number;
  onSite: number;
  weeklyReports: number;
  growth: string;
  logs: LogRecord[];
};

type ObjectProfile = {
  visits: number[];
  visitsToday: number;
  onSite: number;
  activeTags: number;
  growth: string;
  contractors: string[];
  logs: LogRecord[];
};

const contractorMetricSets = [
  {
    visits: [186, 204, 198, 224, 238, 252, 269],
    visitedToday: 3,
    assignedObjects: 4,
    onSite: 24,
    weeklyReports: 69,
    growth: "+6,7%",
  },
  {
    visits: [74, 81, 89, 86, 98, 106, 114],
    visitedToday: 2,
    assignedObjects: 3,
    onSite: 11,
    weeklyReports: 31,
    growth: "+7,5%",
  },
  {
    visits: [112, 108, 126, 139, 147, 143, 158],
    visitedToday: 3,
    assignedObjects: 4,
    onSite: 17,
    weeklyReports: 44,
    growth: "+10,5%",
  },
  {
    visits: [58, 66, 63, 72, 79, 91, 96],
    visitedToday: 2,
    assignedObjects: 2,
    onSite: 9,
    weeklyReports: 26,
    growth: "+5,4%",
  },
];

function getContractorProfile(contractor: string): ContractorProfile {
  const contractorIndex = Math.max(0, contractors.indexOf(contractor));
  const metrics = contractorMetricSets[contractorIndex];
  const employees = staff.filter(
    (employee) => employee.contractor === contractor,
  );
  const eventTemplates: Array<
    Omit<LogRecord, "id" | "employee" | "initials" | "object"> & {
      objectOffset: number;
    }
  > = [
    {
      date: "Сегодня",
      time: ["08:12", "08:27", "07:54", "08:41"][contractorIndex],
      event: "Вход",
      objectOffset: 0,
      details: "Вход на объект зафиксирован NFC-меткой",
      status: "Успешно",
    },
    {
      date: "Сегодня",
      time: ["09:05", "09:18", "08:46", "09:22"][contractorIndex],
      event: "Вход",
      objectOffset: 1,
      details: "Вход на объект зафиксирован NFC-меткой",
      status: "Успешно",
    },
    {
      date: "Сегодня",
      time: ["12:36", "12:18", "13:04", "12:51"][contractorIndex],
      event: "Отчёт",
      objectOffset: 0,
      details: "Ежедневный отчёт по выполненным работам отправлен",
      status: "Принято",
    },
    {
      date: "Сегодня",
      time: ["17:48", "18:02", "17:36", "17:55"][contractorIndex],
      event: "Выход",
      objectOffset: 1,
      details: "Выход с объекта зафиксирован NFC-меткой",
      status: "Успешно",
    },
    {
      date: "Вчера",
      time: ["18:21", "17:49", "18:14", "17:38"][contractorIndex],
      event: "Выход",
      objectOffset: 0,
      details: "Выход с объекта зафиксирован NFC-меткой",
      status: "Успешно",
    },
    {
      date: "Вчера",
      time: ["16:40", "15:58", "16:22", "16:08"][contractorIndex],
      event: "Отчёт",
      objectOffset: 2,
      details: "Отчёт по технике безопасности заполнен и отправлен",
      status: "На проверке",
    },
    {
      date: "Вчера",
      time: ["08:34", "08:11", "08:29", "07:58"][contractorIndex],
      event: "Вход",
      objectOffset: 2,
      details: "Вход на объект зафиксирован NFC-меткой",
      status: "Успешно",
    },
    {
      date: "26 июля",
      time: ["17:16", "17:42", "18:06", "17:27"][contractorIndex],
      event: "Отчёт",
      objectOffset: 1,
      details: "Сменный отчёт о ходе работ заполнен и отправлен",
      status: "Принято",
    },
  ];
  const logs = eventTemplates
    .map((template, index) => {
      const employee =
        employees[index % Math.max(employees.length, 1)] || staff[0];
      const object =
        objectsInitial[
          (contractorIndex + template.objectOffset) % objectsInitial.length
        ].name;
      return {
        ...template,
        id: `${contractorIndex}-${index}`,
        employee: employee.name,
        initials: employee.initials,
        object,
      };
    })
    .map(({ objectOffset: _objectOffset, ...record }) => record);
  return { ...metrics, logs };
}

const objectMetricSets = [
  {
    visits: [52, 61, 58, 69, 75, 84, 91],
    visitsToday: 91,
    onSite: 18,
    activeTags: 48,
    growth: "+8,3%",
    contractorIndexes: [0, 1, 3],
  },
  {
    visits: [31, 36, 42, 39, 47, 51, 56],
    visitsToday: 56,
    onSite: 9,
    activeTags: 29,
    growth: "+9,8%",
    contractorIndexes: [1, 2],
  },
  {
    visits: [12, 9, 8, 6, 5, 3, 0],
    visitsToday: 0,
    onSite: 0,
    activeTags: 0,
    growth: "0%",
    contractorIndexes: [0],
  },
  {
    visits: [44, 48, 53, 61, 64, 71, 79],
    visitsToday: 79,
    onSite: 14,
    activeTags: 37,
    growth: "+11,2%",
    contractorIndexes: [0, 2, 3],
  },
];

function getObjectProfile(object: ObjectItem): ObjectProfile {
  const objectIndex = Math.max(
    0,
    objectsInitial.findIndex((item) => item.code === object.code),
  );
  const metrics = objectMetricSets[objectIndex];
  const assignedContractors = metrics.contractorIndexes.map(
    (index) => contractors[index],
  );
  const employees = staff.filter((employee) =>
    assignedContractors.includes(employee.contractor),
  );
  const eventTemplates: Array<
    Omit<LogRecord, "id" | "employee" | "initials" | "object">
  > = [
    {
      date: "Сегодня",
      time: ["07:48", "08:03", "08:26", "07:55"][objectIndex],
      event: "Вход",
      details: "Вход на объект зафиксирован NFC-меткой",
      status: "Успешно",
    },
    {
      date: "Сегодня",
      time: ["08:12", "08:31", "09:04", "08:18"][objectIndex],
      event: "Вход",
      details: "Сотрудник допущен на территорию объекта",
      status: "Успешно",
    },
    {
      date: "Сегодня",
      time: ["10:36", "11:08", "12:14", "10:51"][objectIndex],
      event: "Отчёт",
      details: "Ежедневный отчёт по объекту отправлен",
      status: "Принято",
    },
    {
      date: "Сегодня",
      time: ["13:22", "14:17", "15:06", "13:48"][objectIndex],
      event: "Вход",
      details: "Повторный вход после перерыва",
      status: "Успешно",
    },
    {
      date: "Сегодня",
      time: ["17:42", "18:02", "16:38", "17:51"][objectIndex],
      event: "Выход",
      details: "Выход с объекта зафиксирован NFC-меткой",
      status: "Успешно",
    },
    {
      date: "Вчера",
      time: ["18:21", "17:49", "16:14", "18:08"][objectIndex],
      event: "Выход",
      details: "Рабочая смена на объекте завершена",
      status: "Успешно",
    },
    {
      date: "Вчера",
      time: ["15:40", "16:18", "14:22", "16:35"][objectIndex],
      event: "Отчёт",
      details: "Отчёт по технике безопасности отправлен",
      status: "На проверке",
    },
    {
      date: "Вчера",
      time: ["08:04", "08:19", "09:11", "07:58"][objectIndex],
      event: "Вход",
      details: "Вход на объект зафиксирован NFC-меткой",
      status: "Успешно",
    },
  ];
  const logs = eventTemplates.map((template, index) => {
    const employee = employees[index % Math.max(employees.length, 1)] || staff[0];
    return {
      ...template,
      id: `object-${objectIndex}-${index}`,
      employee: employee.name,
      initials: employee.initials,
      object: object.name,
    };
  });
  return {
    visits: metrics.visits,
    visitsToday: metrics.visitsToday,
    onSite: metrics.onSite,
    activeTags: metrics.activeTags,
    growth: metrics.growth,
    contractors: assignedContractors,
    logs,
  };
}

const statusStyle = {
  Активен: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Неактивен: "bg-slate-100 text-slate-600 border-slate-200",
};

function pluralizeRu(
  value: number,
  one: string,
  few: string,
  many: string,
) {
  const mod100 = value % 100;
  const mod10 = value % 10;
  if (mod100 >= 11 && mod100 <= 14) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

function downloadEmployees(rows: Employee[]) {
  const header = [
    "ФИО",
    "Подрядчик",
    "Должность",
    "Подразделение",
    "Телефон",
    "Email",
    "Статус",
  ];
  const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const csv = [
    header,
    ...rows.map((employee) => [
      employee.name,
      employee.contractor,
      employee.role,
      employee.dept,
      employee.phone,
      employee.email,
      employee.status,
    ]),
  ]
    .map((row) => row.map(escape).join(";"))
    .join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(
    new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }),
  );
  link.download = "employees.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}

function downloadLogs(rows: LogRecord[], fileName = "contractor-log.csv") {
  const header = [
    "Дата",
    "Время",
    "Сотрудник",
    "Событие",
    "Объект",
    "Описание",
    "Статус",
  ];
  const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const csv = [
    header,
    ...rows.map((record) => [
      record.date,
      record.time,
      record.employee,
      record.event,
      record.object,
      record.details,
      record.status,
    ]),
  ]
    .map((row) => row.map(escape).join(";"))
    .join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(
    new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }),
  );
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
}

function Field({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  type?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13.5px] font-medium text-[#40516d]">
        {label}
      </span>
      <input
        type={type}
        {...(onChange
          ? {
              value: value ?? "",
              onChange: (event: ChangeEvent<HTMLInputElement>) =>
                onChange(event.target.value),
            }
          : { defaultValue: value })}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-[#dce5f0] bg-white px-3 text-[15px] text-[#16223a] outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}
function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, options.indexOf(value)),
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selectedIndex = Math.max(0, options.indexOf(value));

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  useEffect(() => {
    if (open) setActiveIndex(selectedIndex);
  }, [open, selectedIndex]);

  const choose = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(selectedIndex);
        return;
      }
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current) =>
        (current + direction + options.length) % options.length,
      );
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(event.key === "Home" ? 0 : options.length - 1);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) choose(options[activeIndex]);
      else setOpen(true);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`custom-select ${open ? "is-open" : ""}`}
    >
      <button
        type="button"
        className="custom-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
      >
        <span>{value}</span>
        <ChevronDown size={15} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={listboxId}
            role="listbox"
            className="custom-select-menu"
            initial={{ opacity: 0, y: -5, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.99 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          >
            {options.map((option, index) => {
              const selected = option === value;
              const active = index === activeIndex;
              return (
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  key={option}
                  className={`custom-select-option ${selected ? "is-selected" : ""} ${active ? "is-active" : ""}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => choose(option)}
                >
                  <span>{option}</span>
                  <span className="custom-select-check" aria-hidden="true">
                    <Check size={12} strokeWidth={2.6} />
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
function Nav({
  icon,
  label,
  active,
  compact,
  onClick,
  end,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  compact: boolean;
  onClick: () => void;
  end?: ReactNode;
}) {
  return (
    <button
      title={compact ? label : undefined}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={`flex h-[52px] w-full items-center gap-3 rounded-2xl px-3.5 text-left transition ${active ? "border border-[#cfe2ff] bg-[#f1f7ff] text-[#17223a] shadow-[0_0_0_1px_rgba(219,234,254,.45)]" : "text-[#50617c] hover:bg-[#f6f9fd]"} ${compact ? "justify-center px-0" : ""}`}
    >
      <span
        className={`grid size-9 shrink-0 place-items-center rounded-xl ${active ? "bg-[#2563eb] text-white" : "border border-[#e0e8f2] text-[#667b99]"}`}
      >
        {icon}
      </span>
      <span
        className={`nav-label flex-1 text-[16px] font-semibold ${compact ? "is-collapsed" : ""}`}
      >
        {label}
      </span>
      {!compact && end}
    </button>
  );
}

function useOverlayLock(close: () => void) {
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const scrollbarGap = Math.max(0, window.innerWidth - root.clientWidth);
    const previous = {
      bodyOverscroll: body.style.overscrollBehavior,
      bodyPaddingRight: body.style.paddingRight,
      rootScrollBehavior: root.style.scrollBehavior,
    };
    const rootAlreadyLocked = root.classList.contains("overlay-open");
    const isInsideScrollableOverlay = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest(".overlay-scroll-region"));
    const stopBackgroundWheel = (event: WheelEvent) => {
      if (!isInsideScrollableOverlay(event.target)) event.preventDefault();
    };
    const stopBackgroundTouch = (event: TouchEvent) => {
      if (!isInsideScrollableOverlay(event.target)) event.preventDefault();
    };
    const keepPagePosition = () => {
      if (window.scrollX !== scrollX || window.scrollY !== scrollY)
        window.scrollTo(scrollX, scrollY);
    };
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        closeRef.current();
        return;
      }
      const target = event.target;
      const editable =
        target instanceof HTMLElement &&
        (target.matches("input, textarea, select") || target.isContentEditable);
      if (
        !editable &&
        !isInsideScrollableOverlay(target) &&
        ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(
          event.key,
        )
      )
        event.preventDefault();
    };

    root.classList.add("overlay-open");
    root.style.scrollBehavior = "auto";
    body.style.overscrollBehavior = "none";
    if (scrollbarGap) body.style.paddingRight = `${scrollbarGap}px`;
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("scroll", keepPagePosition, { passive: true });
    document.addEventListener("wheel", stopBackgroundWheel, {
      capture: true,
      passive: false,
    });
    document.addEventListener("touchmove", stopBackgroundTouch, {
      capture: true,
      passive: false,
    });

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("scroll", keepPagePosition);
      document.removeEventListener("wheel", stopBackgroundWheel, true);
      document.removeEventListener("touchmove", stopBackgroundTouch, true);
      if (!rootAlreadyLocked) root.classList.remove("overlay-open");
      root.style.scrollBehavior = previous.rootScrollBehavior;
      body.style.overscrollBehavior = previous.bodyOverscroll;
      body.style.paddingRight = previous.bodyPaddingRight;
    };
  }, []);
}

export default function App() {
  const [page, setPage] = useState<AppPage>("home");
  const [sidebar, setSidebar] = useState(true);
  const [selectedContractor, setSelectedContractor] = useState(contractors[0]);
  const [selectedObject, setSelectedObject] = useState(objectsInitial[0]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Все статусы");
  const [detail, setDetail] = useState<Employee | null>(null);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    root.style.scrollBehavior = previousBehavior;
  }, [page]);
  const navigate = (p: typeof page) => {
    setPage(p);
    setDetail(null);
  };
  const toast = (m: string) => {
    setNotice(m);
    window.setTimeout(() => setNotice(""), 2600);
  };
  const rows = useMemo(
    () =>
      staff.filter(
        (e) =>
          e.contractor === selectedContractor &&
          (status === "Все статусы" || e.status === status) &&
          `${e.name} ${e.role} ${e.email}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [selectedContractor, query, status],
  );
  const currentTitle =
    page === "home"
      ? "Главная"
      : page === "objects" || page === "object"
        ? "Объекты"
      : page === "tags"
        ? "Метки"
        : page === "settings"
          ? "Настройки"
          : "Подрядчики";
  return (
    <div className="app-shell min-h-screen bg-[#f5f7fb] font-[Inter,Arial,sans-serif] text-[#101b31]">
      <aside
        className={`app-sidebar fixed bottom-0 left-0 top-0 z-30 border-r border-[#e1e8f1] bg-white px-4 py-4 transition-all duration-300 ${sidebar ? "is-open w-[268px]" : "w-[82px]"}`}
      >
        <div className="flex h-full flex-col">
          <div className={`brand-lockup ${sidebar ? "" : "is-compact"}`}>
            <div className="brand-mark">
              <ShieldCheck size={20} />
            </div>
            {sidebar && (
              <div>
                <strong>Контроль персонала</strong>
              </div>
            )}
          </div>
          <nav className="space-y-1.5">
            <Nav
              icon={<Home size={19} />}
              label="Главная"
              active={page === "home"}
              compact={!sidebar}
              onClick={() => navigate("home")}
            />
            <Nav
              icon={<BriefcaseBusiness size={19} />}
              label="Подрядчики"
              active={page === "contractors" || page === "contractor"}
              compact={!sidebar}
              onClick={() => navigate("contractors")}
            />
            <Nav
              icon={<MapPin size={19} />}
              label="Объекты"
              active={page === "objects" || page === "object"}
              compact={!sidebar}
              onClick={() => navigate("objects")}
            />
            <Nav
              icon={<Tag size={19} />}
              label="Метки"
              active={page === "tags"}
              compact={!sidebar}
              onClick={() => navigate("tags")}
            />
            <Nav
              icon={<Settings size={19} />}
              label="Настройки"
              active={page === "settings"}
              compact={!sidebar}
              onClick={() => navigate("settings")}
            />
          </nav>
          <button
            aria-label="Свернуть меню"
            onClick={() => setSidebar(!sidebar)}
            className="sidebar-toggle absolute -right-4 top-1/2 z-40 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-[#dbe5f0] bg-white text-[#657895] shadow-sm hover:bg-[#f4f8ff]"
          >
            {sidebar ? <ChevronLeft size={16} /> : <Menu size={16} />}
          </button>
          <div
            className={`profile-card mt-auto rounded-[22px] border border-[#e1e8f1] bg-[#fafcff] p-3 ${sidebar ? "" : "is-compact"}`}
          >
            <div
              className={`profile-summary flex items-center gap-2.5 rounded-xl bg-white p-2.5 ${!sidebar ? "justify-center" : ""}`}
            >
              <div className="profile-avatar grid size-9 place-items-center rounded-xl text-xs font-semibold text-white">
                АМ
              </div>
              {sidebar && (
                <div>
                  <p className="text-[13.5px] font-semibold">Анна Морозова</p>
                  <p className="text-[12.5px] text-[#74839b]">Администратор</p>
                </div>
              )}
            </div>
            <button
              aria-label="Выйти из аккаунта"
              title={!sidebar ? "Выйти" : undefined}
              onClick={() => toast("Сеанс будет завершён")}
              className={`mt-2 flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13.5px] font-medium text-[#61728e] hover:bg-white ${!sidebar ? "justify-center" : ""}`}
            >
              <LogOut size={17} />
              {sidebar && "Выйти"}
            </button>
          </div>
        </div>
      </aside>
      <main
        className={`app-main min-h-screen transition-all duration-300 ${sidebar ? "ml-[268px]" : "ml-[82px]"}`}
      >
        <header className="app-header sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[#e1e8f1] bg-white/90 px-10 backdrop-blur-xl">
          <div>
            <div className="text-[12.5px] font-medium uppercase tracking-[.08em] text-[#8a99ae]">
              Система управления
            </div>
            <div className="mt-0.5 text-[16px] font-semibold text-[#22324b]">
              {currentTitle}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              aria-label="Уведомления"
              className="notification-button relative grid size-10 place-items-center rounded-xl border border-[#e1e8f1] text-[#5e718e]"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#2563eb]" />
            </button>
          </div>
        </header>
        <AnimatePresence mode="wait">
          <motion.div
            className="page-stage"
            key={page}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            {page === "home" ? (
              <HomePage navigate={navigate} />
            ) : page === "settings" ? (
              <SettingsPage toast={toast} />
            ) : page === "tags" ? (
              <TagsPage toast={toast} />
            ) : page === "objects" ? (
              <ObjectsPage
                open={(object) => {
                  setSelectedObject(object);
                  navigate("object");
                }}
              />
            ) : page === "object" ? (
              <ObjectDetailPage
                object={selectedObject}
                openEmployee={setDetail}
                goObjects={() => navigate("objects")}
                openContractor={(contractor) => {
                  setSelectedContractor(contractor);
                  navigate("contractor");
                }}
              />
            ) : page === "contractors" ? (
              <ContractorsPage
                open={(name) => {
                  setSelectedContractor(name);
                  navigate("contractor");
                }}
              />
            ) : (
              <EmployeesPage
                page={page}
                selected={selectedContractor}
                rows={rows}
                query={query}
                setQuery={setQuery}
                status={status}
                setStatus={setStatus}
                open={setDetail}
                goContractors={() => navigate("contractors")}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      <AnimatePresence>
        {detail && (
          <EmployeePanel employee={detail} close={() => setDetail(null)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-2xl bg-[#111b31] px-5 py-3 text-[15px] font-medium text-white shadow-2xl"
          >
            {notice}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
function HomePage({
  navigate,
}: {
  navigate: (page: AppPage) => void;
}) {
  const metrics = [
    {
      label: "Сотрудники",
      value: "128",
      change: "+12 за месяц",
      icon: <Users size={20} />,
      tone: "blue",
    },
    {
      label: "Сейчас на объектах",
      value: "46",
      change: "36% персонала",
      icon: <UserCheck size={20} />,
      tone: "green",
    },
    {
      label: "Подрядчики",
      value: "12",
      change: "10 активных",
      icon: <Building2 size={20} />,
      tone: "violet",
    },
    {
      label: "Активные метки",
      value: "184",
      change: "98,4% в сети",
      icon: <Radio size={20} />,
      tone: "orange",
    },
  ];
  const activity = [
    {
      name: "Александр Петров",
      place: "ЛЦ «Запад»",
      time: "08:42",
      type: "Вход",
      initials: "АП",
    },
    {
      name: "Дмитрий Крылов",
      place: "БЦ «Орион»",
      time: "08:36",
      type: "Вход",
      initials: "ДК",
    },
    {
      name: "Марина Орлова",
      place: "Площадка «Север»",
      time: "08:21",
      type: "Вход",
      initials: "МО",
    },
    {
      name: "Елена Соколова",
      place: "ЛЦ «Запад»",
      time: "18:17",
      type: "Выход",
      initials: "ЕС",
    },
  ];
  return (
    <section className="dashboard-page px-10 py-8">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Обзор системы</p>
          <h1>Доброе утро</h1>
          <p>Актуальная картина по объектам и персоналу на сегодня.</p>
        </div>
        <div className="date-chip">
          <Clock3 size={16} />
          <span>Вторник, 28 июля</span>
        </div>
      </div>
      <div className="metric-grid">
        {metrics.map((metric, index) => (
          <motion.button
            key={metric.label}
            onClick={() =>
              navigate(index === 3 ? "tags" : index === 1 ? "objects" : "contractors")
            }
            className={`metric-card tone-${metric.tone}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + index * 0.06 }}
            whileHover={{ y: -4 }}
          >
            <span className="metric-icon">{metric.icon}</span>
            <span className="metric-label">{metric.label}</span>
            <strong>{metric.value}</strong>
            <span className="metric-change">
              {metric.change}
              <ArrowUpRight size={13} />
            </span>
          </motion.button>
        ))}
      </div>
      <div className="dashboard-grid">
        <motion.article
          className="occupancy-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
        >
          <div className="card-heading">
            <div>
              <span className="section-kicker">
                <Activity size={14} />
                Загрузка объектов
              </span>
              <h2>Присутствие персонала</h2>
            </div>
            <button onClick={() => navigate("objects")}>
              Все объекты
              <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="occupancy-content">
            <div className="radial-wrap">
              <div className="radial">
                <div>
                  <strong>46</strong>
                  <span>на объектах</span>
                </div>
              </div>
            </div>
            <div className="site-bars">
              {[
                ["ЛЦ «Запад»", "18 чел.", 82, "blue"],
                ["Площадка «Север»", "14 чел.", 66, "violet"],
                ["БЦ «Орион»", "9 чел.", 48, "green"],
                ["Склад № 3", "5 чел.", 28, "orange"],
              ].map(([name, count, width, tone]) => (
                <div className="site-bar" key={name as string}>
                  <div>
                    <span>{name}</span>
                    <b>{count}</b>
                  </div>
                  <div className="bar-track">
                    <motion.i
                      className={`bar-${tone}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{
                        delay: 0.4,
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.article>
        <motion.article
          className="activity-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
        >
          <div className="card-heading">
            <div>
              <span className="section-kicker">
                <Radio size={14} />
                Live
              </span>
              <h2>Последние события</h2>
            </div>
            <span className="live-indicator">
              <i />
              Обновляется
            </span>
          </div>
          <div className="activity-list">
            {activity.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.38 + index * 0.05 }}
              >
                <span className="activity-avatar">{item.initials}</span>
                <span className="activity-copy">
                  <strong>{item.name}</strong>
                  <small>{item.place}</small>
                </span>
                <span
                  className={`event-type ${item.type === "Вход" ? "is-entry" : "is-exit"}`}
                >
                  {item.type}
                </span>
                <time>{item.time}</time>
              </motion.div>
            ))}
          </div>
        </motion.article>
      </div>
    </section>
  );
}
function EmployeesPage({
  page,
  selected,
  rows,
  query,
  setQuery,
  status,
  setStatus,
  open,
  goContractors,
}: {
  page: string;
  selected: string;
  rows: Employee[];
  query: string;
  setQuery: (x: string) => void;
  status: string;
  setStatus: (x: string) => void;
  open: (x: Employee) => void;
  goContractors: () => void;
}) {
  const all = page === "employees";
  const profile = useMemo(() => getContractorProfile(selected), [selected]);
  const [mode, setMode] = useState<"employees" | "log">("employees");
  const [draftQuery, setDraftQuery] = useState(query);
  const [draftStatus, setDraftStatus] = useState(status);
  const [draftDepartment, setDraftDepartment] = useState("Все подразделения");
  const [department, setDepartment] = useState("Все подразделения");
  const [logQuery, setLogQuery] = useState("");
  const [draftLogEvent, setDraftLogEvent] = useState("Все события");
  const [logEvent, setLogEvent] = useState("Все события");
  const [draftLogObject, setDraftLogObject] = useState("Все объекты");
  const [logObject, setLogObject] = useState("Все объекты");
  const filteredRows = useMemo(
    () =>
      rows.filter(
        (employee) =>
          department === "Все подразделения" || employee.dept === department,
      ),
    [rows, department],
  );
  const filteredLogs = useMemo(() => {
    const normalized = logQuery.toLowerCase();
    return profile.logs.filter(
      (record) =>
        (!normalized ||
          `${record.employee} ${record.object} ${record.details}`
            .toLowerCase()
            .includes(normalized)) &&
        (logEvent === "Все события" || record.event === logEvent) &&
        (logObject === "Все объекты" || record.object === logObject),
    );
  }, [profile, logQuery, logEvent, logObject]);
  const applyFilters = () => {
    if (mode === "employees") {
      setQuery(draftQuery.trim());
      setStatus(draftStatus);
      setDepartment(draftDepartment);
    } else {
      setLogQuery(draftQuery.trim());
      setLogEvent(draftLogEvent);
      setLogObject(draftLogObject);
    }
  };
  const resetFilters = () => {
    setDraftQuery("");
    if (mode === "employees") {
      setDraftStatus("Все статусы");
      setDraftDepartment("Все подразделения");
      setQuery("");
      setStatus("Все статусы");
      setDepartment("Все подразделения");
    } else {
      setDraftLogEvent("Все события");
      setLogEvent("Все события");
      setDraftLogObject("Все объекты");
      setLogObject("Все объекты");
      setLogQuery("");
    }
  };
  const switchMode = () => {
    const nextMode = mode === "employees" ? "log" : "employees";
    setMode(nextMode);
    setDraftQuery(nextMode === "log" ? logQuery : query);
  };
  const logObjects = Array.from(
    new Set(profile.logs.map((record) => record.object)),
  );
  return (
    <section className="px-10 py-8">
      <div className="mb-7 flex items-start justify-between">
        <div>
          {all ? (
            <p className="mb-1 text-[13.5px] text-[#7b8ba3]">
              Управление персоналом / Сотрудники
            </p>
          ) : (
            <p className="mb-1 text-[13.5px] text-[#7b8ba3]">
              <button
                onClick={goContractors}
                className="hover:text-[#2563eb] hover:underline"
              >
                Подрядчики
              </button>
              <span className="px-1.5">/</span>
              {selected}
            </p>
          )}
          <h1 className="text-[34px] font-bold tracking-[-.025em]">
            {all ? "Управление сотрудниками" : selected}
          </h1>
          <p className="mt-2 text-[16px] text-[#71819b]">
            {all
              ? "Список сотрудников всех подрядных организаций"
              : "Сотрудники, посещаемость и отчётность подрядной организации"}
          </p>
        </div>
      </div>
      {!all && <ContractorAnalytics contractor={selected} profile={profile} />}
      <div className="contractor-filters rounded-xl border border-[#dfe6ef] bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-[#5d7394]" />
          <h2 className="text-[16px] font-semibold">Фильтры</h2>
          <span className="filter-context">
            {mode === "employees" ? "Сотрудники" : "История событий"}
          </span>
        </div>
        <div className="grid grid-cols-[minmax(260px,2fr)_1fr_1fr_auto_auto] gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8293ad]"
              size={17}
            />
            <input
              value={draftQuery}
              onChange={(event) => setDraftQuery(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && applyFilters()}
              placeholder={
                mode === "employees"
                  ? "Введите ФИО, должность или email"
                  : "Сотрудник, объект или описание события"
              }
              className="h-10 w-full rounded-lg border border-[#dce5f0] pl-10 pr-3 text-[13.5px] outline-none focus:border-[#3b82f6]"
            />
          </div>
          {mode === "employees" ? (
            <>
              <Select
                value={draftStatus}
                onChange={setDraftStatus}
                options={["Все статусы", "Активен", "Неактивен"]}
              />
              <Select
                value={draftDepartment}
                onChange={setDraftDepartment}
                options={[
                  "Все подразделения",
                  "Администрация",
                  "Производственный отдел",
                  "Монтажный отдел",
                  "Технический отдел",
                ]}
              />
            </>
          ) : (
            <>
              <Select
                value={draftLogEvent}
                onChange={setDraftLogEvent}
                options={["Все события", "Вход", "Выход", "Отчёт"]}
              />
              <Select
                value={draftLogObject}
                onChange={setDraftLogObject}
                options={["Все объекты", ...logObjects]}
              />
            </>
          )}
          <button
            onClick={applyFilters}
            className="h-10 rounded-lg bg-[#2563eb] px-4 text-[13.5px] font-semibold text-white"
          >
            Применить
          </button>
          <button
            onClick={resetFilters}
            className="h-10 rounded-lg border border-[#dbe4ef] px-4 text-[13.5px] font-medium text-[#50637f]"
          >
            Сбросить
          </button>
        </div>
      </div>
      <div className="mt-5 overflow-hidden rounded-xl border border-[#dfe6ef] bg-white">
        <div className="flex items-center justify-between px-6 py-5">
          <div>
            <h2 className="text-[18px] font-semibold">
              {mode === "employees"
                ? "Список сотрудников"
                : "История сотрудников"}
            </h2>
            <p className="mt-1 text-[13.5px] text-[#7788a1]">
              {mode === "employees"
                ? `Найдено: ${filteredRows.length}`
                : `Событий: ${filteredLogs.length} · входы и выходы привязаны к объектам`}
            </p>
          </div>
          <div className="table-header-actions">
            <button
              onClick={switchMode}
              className={`table-mode-button ${mode === "log" ? "is-active" : ""}`}
            >
              {mode === "employees" ? (
                <ScrollText size={15} />
              ) : (
                <Users size={15} />
              )}{" "}
              {mode === "employees" ? "История" : "Сотрудники"}
            </button>
            <button
              onClick={() =>
                mode === "employees"
                  ? downloadEmployees(filteredRows)
                  : downloadLogs(filteredLogs)
              }
              disabled={
                mode === "employees"
                  ? !filteredRows.length
                  : !filteredLogs.length
              }
              className="flex h-9 items-center gap-2 rounded-lg border border-[#dce5ef] px-3 text-[13.5px] font-medium text-[#47607f] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download size={15} />
              Экспорт
            </button>
          </div>
        </div>
        {mode === "employees" ? (
          <EmployeeTable rows={filteredRows} all={all} open={open} />
        ) : (
          <EmployeeLogTable rows={filteredLogs} openEmployee={open} />
        )}
      </div>
    </section>
  );
}

function ContractorAnalytics({
  contractor,
  profile,
}: {
  contractor: string;
  profile: ContractorProfile;
}) {
  const dayLabels = [
    "22 июл",
    "23 июл",
    "24 июл",
    "25 июл",
    "26 июл",
    "27 июл",
    "28 июл",
  ];
  const chartData = profile.visits.map((visits, index) => ({
    week: dayLabels[index],
    visits,
  }));
  const visitedPercent = Math.round(
    (profile.visitedToday / profile.assignedObjects) * 100,
  );
  return (
    <div className="contractor-analytics">
      <motion.article
        className="contractor-chart-card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="analytics-heading">
          <div>
            <span>
              <BarChart3 size={14} />
              Посещаемость
            </span>
            <h2>Посещения за 7 дней</h2>
            <p>Все входы на объекты подрядчика</p>
          </div>
          <div className="analytics-delta">
            <span className="analytics-delta-value">
              <TrendingUp size={14} />
              <strong>{profile.growth}</strong>
            </span>
            <small>к прошлому дню</small>
          </div>
        </div>
        <div className="contractor-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 8, left: -22, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id={`visits-${contractors.indexOf(contractor)}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#2b68ee" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#2b68ee" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="#edf1f6"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="week"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#8291a6", fontSize: 13.5 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9aa7b8", fontSize: 12.5 }}
              />
              <ChartTooltip
                cursor={{ stroke: "#8cb0f5", strokeDasharray: "3 3" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #dce6f2",
                  boxShadow: "0 12px 30px rgba(28,48,82,.12)",
                  fontSize: 13.5,
                }}
                formatter={(value) => [`${value} посещений`, ""]}
              />
              <Area
                type="monotone"
                dataKey="visits"
                stroke="#2b68ee"
                strokeWidth={2.5}
                fill={`url(#visits-${contractors.indexOf(contractor)})`}
                activeDot={{
                  r: 4,
                  fill: "#2b68ee",
                  stroke: "white",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.article>
      <motion.article
        className="contractor-report-card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="analytics-heading">
          <div>
            <span>
              <MapPin size={14} />
              Объекты сегодня
            </span>
            <h2>Посещённые объекты</h2>
            <p>Активность подрядчика за текущий день</p>
          </div>
        </div>
        <div className="report-overview">
          <div
            className="report-ring"
            style={{
              background: `conic-gradient(#22a979 0 ${visitedPercent}%, #eaf0f5 ${visitedPercent}% 100%)`,
            }}
          >
            <div>
              <strong>
                {profile.visitedToday} / {profile.assignedObjects}
              </strong>
              <span>посещено</span>
            </div>
          </div>
          <div className="report-stats">
            <span>
              <i className="is-complete" />
              <b>{profile.visitedToday}</b> посещено сегодня
            </span>
            <span>
              <i className="is-pending" />
              <b>{profile.assignedObjects - profile.visitedToday}</b> без
              посещений
            </span>
            <span>
              <i className="is-total" />
              <b>{profile.onSite}</b> сотрудников на объектах
            </span>
          </div>
        </div>
      </motion.article>
      <div className="contractor-kpis">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="kpi-icon is-blue">
            <UserCheck size={17} />
          </span>
          <div>
            <small>Сейчас на объектах</small>
            <strong>{profile.onSite} сотрудников</strong>
            <em>Данные обновлены сейчас</em>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
        >
          <span className="kpi-icon is-violet">
            <FileCheck2 size={17} />
          </span>
          <div>
            <small>Отчётов за неделю</small>
            <strong>{profile.weeklyReports} отчётов</strong>
            <em>За последние 7 дней</em>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          <span className="kpi-icon is-orange">
            <Building2 size={17} />
          </span>
          <div>
            <small>Закреплено объектов</small>
            <strong>{profile.assignedObjects} объекта</strong>
            <em>Доступны подрядчику</em>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function EmployeeLogTable({
  rows,
  openEmployee,
}: {
  rows: LogRecord[];
  openEmployee: (employee: Employee) => void;
}) {
  const eventIcon = (event: LogRecord["event"]) =>
    event === "Вход" ? (
      <DoorOpen size={14} />
    ) : event === "Выход" ? (
      <DoorClosed size={14} />
    ) : (
      <FileText size={14} />
    );
  return (
    <div className="responsive-table-wrap overflow-x-auto">
      <table className="employee-log-table responsive-table w-full min-w-[1120px] text-left">
        <thead>
          <tr>
            <th className="px-6 py-3.5">Дата и время</th>
            <th className="px-3 py-3.5">Сотрудник</th>
            <th className="px-3 py-3.5">Событие</th>
            <th className="px-3 py-3.5">Объект</th>
            <th className="px-3 py-3.5">Описание</th>
            <th className="px-6 py-3.5">Статус</th>
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((record) => {
              const employee = staff.find(
                (item) => item.name === record.employee,
              );
              return (
                <tr key={record.id}>
                  <td data-label="Дата и время" className="px-6 py-4">
                    <strong className="log-date">{record.date}</strong>
                    <time>{record.time}</time>
                  </td>
                  <td data-label="Сотрудник" className="px-3">
                    <button
                      className="log-employee"
                      onClick={() => employee && openEmployee(employee)}
                    >
                      <span>{record.initials}</span>
                      <strong>{record.employee}</strong>
                    </button>
                  </td>
                  <td data-label="Событие" className="px-3">
                    <span
                      className={`log-event is-${record.event === "Вход" ? "entry" : record.event === "Выход" ? "exit" : "report"}`}
                    >
                      {eventIcon(record.event)}
                      {record.event}
                    </span>
                  </td>
                  <td data-label="Объект" className="px-3">
                    <div className="log-object">
                      <MapPin size={14} />
                      <span>{record.object}</span>
                    </div>
                  </td>
                  <td data-label="Описание" className="px-3">
                    <span className="log-details">{record.details}</span>
                  </td>
                  <td data-label="Статус" className="px-6">
                    <span
                      className={`log-status ${record.status === "Успешно" || record.status === "Принято" ? "is-success" : "is-review"}`}
                    >
                      {record.status === "На проверке" ? (
                        <AlertTriangle size={12} />
                      ) : (
                        <CheckCircle2 size={12} />
                      )}{" "}
                      {record.status}
                    </span>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6}>
                <div className="empty-filter-state">
                  <ScrollText size={20} />
                  <strong>События не найдены</strong>
                  <span>Измените параметры фильтрации</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
function EmployeeTable({
  rows,
  all,
  open,
}: {
  rows: Employee[];
  all: boolean;
  open: (e: Employee) => void;
}) {
  return (
    <div className="responsive-table-wrap overflow-x-auto">
      <table className="employee-table responsive-table w-full min-w-[990px] text-left">
        <thead className="bg-[#f8fafc] text-[12.5px] uppercase tracking-[.06em] text-[#7485a0]">
          <tr>
            <th className="px-6 py-3.5">Сотрудник</th>
            {all && <th className="px-3 py-3.5">Подрядчик</th>}
            <th className="px-3 py-3.5">Должность</th>
            <th className="px-3 py-3.5">Подразделение</th>
            <th className="px-3 py-3.5">Контакты</th>
            <th className="px-3 py-3.5">Статус</th>
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((e) => (
              <tr
                key={e.email}
                onClick={() => open(e)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    open(e);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Открыть карточку сотрудника ${e.name}`}
                className="cursor-pointer border-t border-[#e8edf4] hover:bg-[#f9fbfe]"
              >
                <td data-label="Сотрудник" className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-xl bg-[#e9f2ff] text-[12.5px] font-bold text-[#2563eb]">
                      {e.initials}
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold">{e.name}</p>
                      <p className="mt-0.5 text-[12.5px] text-[#8190a7]">
                        Добавлен {e.added}
                      </p>
                    </div>
                  </div>
                </td>
                {all && (
                  <td data-label="Подрядчик" className="px-3 text-[12.5px] text-[#5e718e]">
                    {e.contractor.replace("ООО ", "")}
                  </td>
                )}
                <td data-label="Должность" className="px-3 text-[13.5px] text-[#30425e]">{e.role}</td>
                <td data-label="Подразделение" className="px-3 text-[13.5px] text-[#627590]">{e.dept}</td>
                <td data-label="Контакты" className="px-3 text-[12.5px] text-[#526783]">
                  <p>{e.phone}</p>
                  <p className="mt-1 text-[#7e8da4]">{e.email}</p>
                </td>
                <td data-label="Статус" className="px-3">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[12.5px] font-semibold ${statusStyle[e.status]}`}
                  >
                    {e.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={all ? 6 : 5}>
                <div className="empty-filter-state">
                  <Search size={20} />
                  <strong>Сотрудники не найдены</strong>
                  <span>Измените параметры фильтрации</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
function ContractorsPage({ open }: { open: (x: string) => void }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      contractors.filter((contractor) =>
        contractor.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query],
  );
  return (
    <section className="px-10 py-8">
      <p className="mb-1 text-[13.5px] text-[#7b8ba3]">
        Управление персоналом / Подрядчики
      </p>
      <h1 className="text-[34px] font-bold tracking-[-.025em]">Подрядчики</h1>
      <p className="mt-2 text-[16px] text-[#71819b]">
        Список подрядных организаций и сотрудников
      </p>
      <div className="mt-7 overflow-hidden rounded-xl border border-[#dfe6ef] bg-white">
        <div className="flex items-center justify-between border-b border-[#e6ebf2] px-6 py-5">
          <div>
            <h2 className="text-[18px] font-semibold">Подрядные организации</h2>
            <p className="mt-1 text-[13.5px] text-[#7788a1]">
              Найдено: {filtered.length}
            </p>
          </div>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8293ad]"
              size={16}
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Поиск подрядчика"
              className="h-9 rounded-lg border border-[#dce5ef] pl-9 pr-3 text-[13.5px] outline-none"
            />
          </div>
        </div>
        <div className="divide-y divide-[#e8edf4]">
          {filtered.length ? (
            filtered.map((item) => {
              const index = contractors.indexOf(item);
              return (
                <button
                  key={item}
                  onClick={() => open(item)}
                  className="flex w-full items-center gap-4 px-6 py-4 text-left hover:bg-[#f8fbff]"
                >
                  <div className="grid size-10 place-items-center rounded-xl bg-[#e9f2ff] text-[#2563eb]">
                    <Building2 size={19} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-semibold">{item}</p>
                    <p className="mt-1 text-[12.5px] text-[#7b8ca5]">
                      ИНН 7704{index + 218}000 ·{" "}
                      {index === 0 ? 24 : 6 + index * 3} сотрудников
                    </p>
                  </div>
                  <ChevronDown
                    className="-rotate-90 text-[#6f819c]"
                    size={18}
                  />
                </button>
              );
            })
          ) : (
            <div className="empty-filter-state">
              <Search size={20} />
              <strong>Подрядчики не найдены</strong>
              <span>Измените поисковый запрос</span>
              <button onClick={() => setQuery("")}>Сбросить поиск</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ObjectsPage({ open }: { open: (object: ObjectItem) => void }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return objectsInitial.filter((object) =>
      `${object.name} ${object.address} ${object.code}`
        .toLowerCase()
        .includes(normalized),
    );
  }, [query]);
  return (
    <section className="objects-page px-10 py-8">
      <p className="mb-1 text-[13.5px] text-[#7b8ba3]">
        Управление персоналом / Объекты
      </p>
      <h1 className="text-[34px] font-bold tracking-[-.025em]">Объекты</h1>
      <p className="mt-2 text-[16px] text-[#71819b]">
        Объекты, привязанные подрядчики и история посещений
      </p>
      <div className="entity-list mt-7 overflow-hidden rounded-xl border border-[#dfe6ef] bg-white">
        <div className="entity-list-header flex items-center justify-between border-b border-[#e6ebf2] px-6 py-5">
          <div>
            <h2 className="text-[18px] font-semibold">Все объекты</h2>
            <p className="mt-1 text-[13.5px] text-[#7788a1]">
              Найдено: {filtered.length}
            </p>
          </div>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8293ad]"
              size={16}
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Название, адрес или код"
              className="h-9 w-[270px] rounded-lg border border-[#dce5ef] pl-9 pr-3 text-[13.5px] outline-none"
            />
          </div>
        </div>
        <div className="divide-y divide-[#e8edf4]">
          {filtered.length ? (
            filtered.map((object) => {
              return (
                <button
                  key={object.code}
                  aria-label={`Открыть объект ${object.name}`}
                  onClick={() => open(object)}
                  className="object-list-item flex w-full items-center gap-4 px-6 py-4 text-left hover:bg-[#f8fbff]"
                >
                  <span className="object-list-icon grid size-11 place-items-center rounded-xl bg-[#e9f2ff] text-[#2563eb]">
                    <MapPin size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-[#1d2c44]">
                      {object.name}
                    </span>
                    <span className="mt-1 block text-[12.5px] text-[#7b8ca5]">
                      {object.address} · {object.code}
                    </span>
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[12.5px] font-semibold ${statusStyle[object.status]}`}
                  >
                    {object.status}
                  </span>
                  <ChevronDown
                    className="-rotate-90 text-[#6f819c]"
                    size={18}
                  />
                </button>
              );
            })
          ) : (
            <div className="empty-filter-state">
              <Search size={20} />
              <strong>Объекты не найдены</strong>
              <span>Измените поисковый запрос</span>
              <button onClick={() => setQuery("")}>Сбросить поиск</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ObjectDetailPage({
  object,
  openEmployee,
  goObjects,
  openContractor,
}: {
  object: ObjectItem;
  openEmployee: (employee: Employee) => void;
  goObjects: () => void;
  openContractor: (contractor: string) => void;
}) {
  const profile = useMemo(() => getObjectProfile(object), [object]);
  const objectEmployees = useMemo(
    () =>
      staff.filter((employee) =>
        profile.contractors.includes(employee.contractor),
      ),
    [profile],
  );
  const [mode, setMode] = useState<"employees" | "log">("employees");
  const [draftQuery, setDraftQuery] = useState("");
  const [query, setQuery] = useState("");
  const [draftStatus, setDraftStatus] = useState("Все статусы");
  const [status, setStatus] = useState("Все статусы");
  const [draftContractor, setDraftContractor] = useState("Все подрядчики");
  const [contractor, setContractor] = useState("Все подрядчики");
  const [draftEvent, setDraftEvent] = useState("Все события");
  const [event, setEvent] = useState("Все события");
  const filteredEmployees = useMemo(() => {
    const normalized = query.toLowerCase();
    return objectEmployees.filter(
      (employee) =>
        (!normalized ||
          `${employee.name} ${employee.role} ${employee.email}`
            .toLowerCase()
            .includes(normalized)) &&
        (status === "Все статусы" || employee.status === status) &&
        (contractor === "Все подрядчики" ||
          employee.contractor === contractor),
    );
  }, [objectEmployees, query, status, contractor]);
  const filteredLogs = useMemo(() => {
    const normalized = query.toLowerCase();
    return profile.logs.filter((record) => {
      const employee = staff.find((item) => item.name === record.employee);
      return (
        (!normalized ||
          `${record.employee} ${record.details}`
            .toLowerCase()
            .includes(normalized)) &&
        (event === "Все события" || record.event === event) &&
        (contractor === "Все подрядчики" ||
          employee?.contractor === contractor)
      );
    });
  }, [profile, query, event, contractor]);
  const applyFilters = () => {
    setQuery(draftQuery.trim());
    setContractor(draftContractor);
    if (mode === "employees") setStatus(draftStatus);
    else setEvent(draftEvent);
  };
  const resetFilters = () => {
    setDraftQuery("");
    setQuery("");
    setDraftContractor("Все подрядчики");
    setContractor("Все подрядчики");
    setDraftStatus("Все статусы");
    setStatus("Все статусы");
    setDraftEvent("Все события");
    setEvent("Все события");
  };
  const switchMode = () => {
    setMode((current) => (current === "employees" ? "log" : "employees"));
    setDraftQuery(query);
  };
  return (
    <section className="object-detail-page px-10 py-8">
      <div className="object-detail-intro mb-7 flex items-start justify-between">
        <div>
          <p className="mb-1 text-[13.5px] text-[#7b8ba3]">
            <button
              onClick={goObjects}
              className="hover:text-[#2563eb] hover:underline"
            >
              Объекты
            </button>
            <span className="px-1.5">/</span>
            {object.name}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[34px] font-bold tracking-[-.025em]">
              {object.name}
            </h1>
            <span
              className={`rounded-full border px-2.5 py-1 text-[12.5px] font-semibold ${statusStyle[object.status]}`}
            >
              {object.status}
            </span>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-[16px] text-[#71819b]">
            <MapPin size={15} />
            {object.address}
            <span className="px-1 text-[#b2bdcb]">·</span>
            {object.code}
          </p>
        </div>
      </div>
      <ObjectAnalytics object={object} profile={profile} />
      <ObjectContractors
        profile={profile}
        openContractor={openContractor}
      />
      <div className="contractor-filters rounded-xl border border-[#dfe6ef] bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-[#5d7394]" />
          <h2 className="text-[16px] font-semibold">Фильтры</h2>
          <span className="filter-context">
            {mode === "employees" ? "Сотрудники объекта" : "Журнал объекта"}
          </span>
        </div>
        <div className="grid grid-cols-[minmax(260px,2fr)_1fr_1fr_auto_auto] gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8293ad]"
              size={17}
            />
            <input
              value={draftQuery}
              onChange={(e) => setDraftQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              placeholder={
                mode === "employees"
                  ? "ФИО, должность или email"
                  : "Сотрудник или описание события"
              }
              className="h-10 w-full rounded-lg border border-[#dce5f0] pl-10 pr-3 text-[13.5px] outline-none focus:border-[#3b82f6]"
            />
          </div>
          {mode === "employees" ? (
            <Select
              value={draftStatus}
              onChange={setDraftStatus}
              options={["Все статусы", "Активен", "Неактивен"]}
            />
          ) : (
            <Select
              value={draftEvent}
              onChange={setDraftEvent}
              options={["Все события", "Вход", "Выход", "Отчёт"]}
            />
          )}
          <Select
            value={draftContractor}
            onChange={setDraftContractor}
            options={["Все подрядчики", ...profile.contractors]}
          />
          <button
            onClick={applyFilters}
            className="h-10 rounded-lg bg-[#2563eb] px-4 text-[13.5px] font-semibold text-white"
          >
            Применить
          </button>
          <button
            onClick={resetFilters}
            className="h-10 rounded-lg border border-[#dbe4ef] px-4 text-[13.5px] font-medium text-[#50637f]"
          >
            Сбросить
          </button>
        </div>
      </div>
      <div className="mt-5 overflow-hidden rounded-xl border border-[#dfe6ef] bg-white">
        <div className="flex items-center justify-between px-6 py-5">
          <div>
            <h2 className="text-[18px] font-semibold">
              {mode === "employees"
                ? "Сотрудники объекта"
                : "Журнал посещений"}
            </h2>
            <p className="mt-1 text-[13.5px] text-[#7788a1]">
              {mode === "employees"
                ? `Найдено: ${filteredEmployees.length}`
                : `Событий: ${filteredLogs.length}`}
            </p>
          </div>
          <div className="table-header-actions">
            <button
              onClick={switchMode}
              className={`table-mode-button ${mode === "log" ? "is-active" : ""}`}
            >
              {mode === "employees" ? (
                <ScrollText size={15} />
              ) : (
                <Users size={15} />
              )}
              {mode === "employees" ? "История" : "Сотрудники"}
            </button>
            <button
              onClick={() =>
                mode === "employees"
                  ? downloadEmployees(filteredEmployees)
                  : downloadLogs(filteredLogs, "object-log.csv")
              }
              disabled={
                mode === "employees"
                  ? !filteredEmployees.length
                  : !filteredLogs.length
              }
              className="flex h-9 items-center gap-2 rounded-lg border border-[#dce5ef] px-3 text-[13.5px] font-medium text-[#47607f] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download size={15} />
              Экспорт
            </button>
          </div>
        </div>
        {mode === "employees" ? (
          <EmployeeTable
            rows={filteredEmployees}
            all
            open={openEmployee}
          />
        ) : (
          <EmployeeLogTable rows={filteredLogs} openEmployee={openEmployee} />
        )}
      </div>
    </section>
  );
}

function ObjectAnalytics({
  object,
  profile,
}: {
  object: ObjectItem;
  profile: ObjectProfile;
}) {
  const dayLabels = [
    "22 июл",
    "23 июл",
    "24 июл",
    "25 июл",
    "26 июл",
    "27 июл",
    "28 июл",
  ];
  const chartData = profile.visits.map((visits, index) => ({
    day: dayLabels[index],
    visits,
  }));
  const contractorPercent = Math.round(
    (profile.contractors.length / contractors.length) * 100,
  );
  return (
    <div className="contractor-analytics object-analytics">
      <motion.article
        className="contractor-chart-card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="analytics-heading">
          <div>
            <span>
              <BarChart3 size={14} />
              Посещаемость объекта
            </span>
            <h2>Посещения за 7 дней</h2>
            <p>Все входы сотрудников на территорию объекта</p>
          </div>
          <div className="analytics-delta">
            <span className="analytics-delta-value">
              <TrendingUp size={14} />
              <strong>{profile.growth}</strong>
            </span>
            <small>к прошлому дню</small>
          </div>
        </div>
        <div className="contractor-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 8, left: -22, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id={`object-visits-${object.code}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#2b68ee" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#2b68ee" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="#edf1f6"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#8291a6", fontSize: 13.5 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9aa7b8", fontSize: 12.5 }}
              />
              <ChartTooltip
                cursor={{ stroke: "#8cb0f5", strokeDasharray: "3 3" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #dce6f2",
                  boxShadow: "0 12px 30px rgba(28,48,82,.12)",
                  fontSize: 13.5,
                }}
                formatter={(value) => [`${value} посещений`, ""]}
              />
              <Area
                type="monotone"
                dataKey="visits"
                stroke="#2b68ee"
                strokeWidth={2.5}
                fill={`url(#object-visits-${object.code})`}
                activeDot={{
                  r: 4,
                  fill: "#2b68ee",
                  stroke: "white",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.article>
      <motion.article
        className="contractor-report-card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="analytics-heading">
          <div>
            <span>
              <Building2 size={14} />
              Доступ к объекту
            </span>
            <h2>Привязанные подрядчики</h2>
            <p>Организации с доступом на объект</p>
          </div>
        </div>
        <div className="report-overview">
          <div
            className="report-ring"
            style={{
              background: `conic-gradient(#22a979 0 ${contractorPercent}%, #eaf0f5 ${contractorPercent}% 100%)`,
            }}
          >
            <div>
              <strong>
                {profile.contractors.length} / {contractors.length}
              </strong>
              <span>подрядчика</span>
            </div>
          </div>
          <div className="report-stats">
            <span>
              <i className="is-complete" />
              <b>{profile.contractors.length}</b> имеют доступ
            </span>
            <span>
              <i className="is-pending" />
              <b>{contractors.length - profile.contractors.length}</b> не
              привязаны
            </span>
            <span>
              <i className="is-total" />
              <b>{profile.onSite}</b> сейчас на объекте
            </span>
          </div>
        </div>
      </motion.article>
      <div className="contractor-kpis">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="kpi-icon is-blue">
            <UserCheck size={17} />
          </span>
          <div>
            <small>Сейчас на объекте</small>
            <strong>{profile.onSite} сотрудников</strong>
            <em>Данные обновлены сейчас</em>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
        >
          <span className="kpi-icon is-violet">
            <DoorOpen size={17} />
          </span>
          <div>
            <small>Посещений сегодня</small>
            <strong>{profile.visitsToday} посещений</strong>
            <em>Входы на текущую дату</em>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          <span className="kpi-icon is-orange">
            <Radio size={17} />
          </span>
          <div>
            <small>Активные метки</small>
            <strong>{profile.activeTags} меток</strong>
            <em>Закреплены за объектом</em>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ObjectContractors({
  profile,
  openContractor,
}: {
  profile: ObjectProfile;
  openContractor: (contractor: string) => void;
}) {
  return (
    <section className="object-contractors-card">
      <div className="object-contractors-heading">
        <div>
          <span>
            <Building2 size={14} />
            Организации на объекте
          </span>
          <h2>Привязанные подрядчики</h2>
          <p>Нажмите на организацию, чтобы открыть её карточку</p>
        </div>
        <strong>{profile.contractors.length}</strong>
      </div>
      <div className="object-contractor-grid">
        {profile.contractors.map((contractor, index) => {
          const employees = staff.filter(
            (employee) => employee.contractor === contractor,
          );
          const visits = Math.max(
            1,
            Math.round(profile.visitsToday / profile.contractors.length) -
              index * 3,
          );
          return (
            <button
              key={contractor}
              aria-label={`Открыть подрядчика ${contractor}`}
              onClick={() => openContractor(contractor)}
              className="object-contractor-card"
            >
              <span className="object-contractor-icon">
                <Building2 size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <strong>{contractor}</strong>
                <small>
                  {employees.length}{" "}
                  {pluralizeRu(
                    employees.length,
                    "сотрудник",
                    "сотрудника",
                    "сотрудников",
                  )}{" "}
                  · {visits}{" "}
                  {pluralizeRu(
                    visits,
                    "посещение",
                    "посещения",
                    "посещений",
                  )}{" "}
                  сегодня
                </small>
              </span>
              <ChevronDown size={17} className="-rotate-90" />
            </button>
          );
        })}
      </div>
    </section>
  );
}

function SettingsPage({ toast }: { toast: (m: string) => void }) {
  const [tab, setTab] = useState<"objects" | "contractors">("objects");
  const [objects, setObjects] = useState(objectsInitial);
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [chosen, setChosen] = useState<ObjectItem | null>(null);
  const [contractorModal, setContractorModal] = useState(false);
  return (
    <section className="px-10 py-8">
      <p className="mb-1 text-[13.5px] text-[#7b8ba3]">
        Управление персоналом / Настройки
      </p>
      <h1 className="text-[34px] font-bold tracking-[-.025em]">Настройки</h1>
      <p className="mt-2 text-[16px] text-[#71819b]">
        Управление объектами и подрядными организациями
      </p>
      <div className="settings-tabs mt-7 flex w-fit rounded-xl border border-[#dce5ef] bg-white p-1">
        <button
          onClick={() => setTab("objects")}
          className={`rounded-lg px-4 py-2 text-[15px] font-semibold ${tab === "objects" ? "bg-[#2563eb] text-white" : "text-[#61738f]"}`}
        >
          Объекты
        </button>
        <button
          onClick={() => setTab("contractors")}
          className={`rounded-lg px-4 py-2 text-[15px] font-semibold ${tab === "contractors" ? "bg-[#2563eb] text-white" : "text-[#61738f]"}`}
        >
          Подрядчики
        </button>
      </div>
      {tab === "objects" ? (
        <div className="mt-5 overflow-hidden rounded-xl border border-[#dfe6ef] bg-white">
          <div className="flex items-center justify-between border-b border-[#e6ebf2] px-6 py-5">
            <div>
              <h2 className="text-[18px] font-semibold">Объекты</h2>
              <p className="mt-1 text-[13.5px] text-[#7788a1]">
                Создание, редактирование и управление объектами
              </p>
            </div>
            <button
              onClick={() => {
                setChosen(null);
                setModal("add");
              }}
              className="settings-add-button flex h-10 items-center gap-2 rounded-lg bg-[#2563eb] px-4 text-[15px] font-semibold text-white"
            >
              <Plus size={16} />
              Добавить объект
            </button>
          </div>
          <div className="divide-y divide-[#e8edf4]">
            {objects.map((item) => (
              <div
                key={item.code}
                className="flex items-center gap-4 px-6 py-4"
              >
                <div className="grid size-10 place-items-center rounded-xl bg-[#e9f2ff] text-[#2563eb]">
                  <MapPin size={19} />
                </div>
                <div className="flex-1">
                  <p className="text-[15px] font-semibold">{item.name}</p>
                  <p className="mt-1 text-[12.5px] text-[#7b8ca5]">
                    {item.address} · {item.code}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-1 text-[12.5px] font-semibold ${statusStyle[item.status]}`}
                >
                  {item.status}
                </span>
                <button
                  aria-label={`Редактировать ${item.name}`}
                  onClick={() => {
                    setChosen(item);
                    setModal("edit");
                  }}
                  className="grid size-9 place-items-center rounded-lg text-[#617894] hover:bg-blue-50 hover:text-blue-600"
                >
                  <Pencil size={16} />
                </button>
                <button
                  aria-label={`Удалить ${item.name}`}
                  onClick={() => {
                    setChosen(item);
                    setModal("delete");
                  }}
                  className="grid size-9 place-items-center rounded-lg text-[#617894] hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-xl border border-[#dfe6ef] bg-white">
          <div className="flex items-center justify-between border-b border-[#e6ebf2] px-6 py-5">
            <div>
              <h2 className="text-[18px] font-semibold">
                Подрядные организации
              </h2>
              <p className="mt-1 text-[13.5px] text-[#7788a1]">
                Контакты и данные для входа подрядчиков
              </p>
            </div>
            <button
              onClick={() => setContractorModal(true)}
              className="settings-add-button flex h-10 items-center gap-2 rounded-lg bg-[#2563eb] px-4 text-[15px] font-semibold text-white"
            >
              <Plus size={16} />
              Добавить подрядчика
            </button>
          </div>
          <div className="divide-y divide-[#e8edf4]">
            {contractors.map((item, i) => (
              <div key={item} className="flex items-center gap-4 px-6 py-4">
                <div className="grid size-10 place-items-center rounded-xl bg-[#e9f2ff] text-[#2563eb]">
                  <Building2 size={19} />
                </div>
                <div className="flex-1">
                  <p className="text-[15px] font-semibold">{item}</p>
                  <p className="mt-1 text-[12.5px] text-[#7b8ca5]">
                    ИНН 7704{i + 218}000 · 2 контактных лица
                  </p>
                </div>
                <button
                  aria-label={`Редактировать ${item}`}
                  onClick={() => setContractorModal(true)}
                  className="grid size-9 place-items-center rounded-lg text-[#617894] hover:bg-blue-50 hover:text-blue-600"
                >
                  <Pencil size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <AnimatePresence>
        {modal && (
          <ObjectModal
            key={`${modal}-${chosen?.code ?? "new"}`}
            type={modal}
            item={chosen}
            close={() => setModal(null)}
            done={(message, saved) => {
              if (modal === "delete" && chosen)
                setObjects((items) =>
                  items.filter((value) => value.code !== chosen.code),
                );
              if (modal === "add" && saved)
                setObjects((items) => [...items, saved]);
              if (modal === "edit" && saved && chosen)
                setObjects((items) =>
                  items.map((value) =>
                    value.code === chosen.code ? saved : value,
                  ),
                );
              setModal(null);
              toast(message);
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {contractorModal && (
          <ContractorModal
            key="contractor-modal"
            close={() => setContractorModal(false)}
            done={(m) => {
              setContractorModal(false);
              toast(m);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
function ObjectModal({
  type,
  item,
  close,
  done,
}: {
  type: "add" | "edit" | "delete";
  item: ObjectItem | null;
  close: () => void;
  done: (m: string, saved?: ObjectItem) => void;
}) {
  const [drawer, setDrawer] = useState(false);
  const [linked, setLinked] = useState([contractors[0], contractors[1]]);
  const [find, setFind] = useState("");
  const [name, setName] = useState(item?.name || "");
  const [code, setCode] = useState(item?.code || "");
  const [address, setAddress] = useState(item?.address || "");
  const [objectStatus, setObjectStatus] = useState<"Активен" | "Неактивен">(
    item?.status || "Активен",
  );
  useOverlayLock(close);
  const shown = contractors.filter((contractor) =>
    contractor.toLowerCase().includes(find.toLowerCase()),
  );
  const toggle = (contractor: string) =>
    setLinked((current) =>
      current.includes(contractor)
        ? current.filter((x) => x !== contractor)
        : [...current, contractor],
    );
  const saveObject = () => {
    if (!name.trim() || !code.trim()) return;
    done(type === "add" ? "Объект добавлен" : "Изменения сохранены", {
      name: name.trim(),
      code: code.trim(),
      address: address.trim() || "Адрес не указан",
      status: objectStatus,
    });
  };
  if (type === "delete")
    return (
      <Confirm
        title="Удалить объект?"
        text={`Объект «${item?.name}» будет удалён из справочника.`}
        close={close}
        action={() => done("Объект удалён")}
      />
    );
  return (
    <motion.div
      className="overlay-layer fixed inset-0 z-[60] isolate"
      initial="closed"
      animate="open"
      exit="closed"
    >
      <motion.button
        aria-label="Закрыть окно объекта"
        onClick={close}
        className="absolute inset-0 z-0 cursor-default bg-[#15233a]/30"
        variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      />
      <motion.aside
        aria-label={
          type === "add" ? "Добавление объекта" : "Редактирование объекта"
        }
        aria-modal="true"
        role="dialog"
        className="overlay-drawer-panel fixed bottom-0 right-0 top-0 z-10 flex w-[480px] flex-col border-l border-[#dfe6ef] bg-white shadow-[-14px_0_36px_rgba(34,51,84,.18)]"
        variants={{ closed: { x: "100%" }, open: { x: 0 } }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: "transform" }}
      >
        <ModalHead
          title={
            type === "add" ? "Добавление объекта" : "Редактирование объекта"
          }
          sub="Основные данные объекта"
          close={close}
        />
        <div className="overlay-scroll-region flex-1 overflow-y-auto space-y-6 px-7 py-6">
          <div className="space-y-4">
            <Field
              label="Название объекта *"
              value={name}
              onChange={setName}
              placeholder="Название объекта"
            />
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Внутренний код *"
                value={code}
                onChange={setCode}
                placeholder="OBJ-001"
              />
              <label className="block">
                <span className="mb-1.5 block text-[13.5px] font-medium text-[#40516d]">
                  Статус
                </span>
                <Select
                  value={objectStatus}
                  onChange={(value) =>
                    setObjectStatus(value as "Активен" | "Неактивен")
                  }
                  options={["Активен", "Неактивен"]}
                />
              </label>
            </div>
            <Field
              label="Адрес"
              value={address}
              onChange={setAddress}
              placeholder="Город, улица, дом"
            />
          </div>
          <section className="rounded-xl border border-[#e3eaf3] bg-[#f8fbff] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-[#1e293b]">
                  Подрядные организации
                </h3>
                <p className="mt-1 text-[12.5px] text-[#71839e]">
                  {linked.length
                    ? `Выбрано подрядчиков: ${linked.length}`
                    : "Подрядчики не выбраны"}
                </p>
              </div>
              <div className="relative">
                <button
                  onClick={() => setDrawer(!drawer)}
                  className={`association-picker-button flex items-center border font-semibold transition ${drawer ? "border-[#85b9ff] bg-[#eef5ff] text-[#2563eb] ring-2 ring-blue-100" : "border-[#cfe0f7] bg-white text-[#2563eb] hover:bg-[#eef5ff]"}`}
                >
                  <Plus size={14} />
                  Выбрать
                </button>
                {drawer && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDrawer(false)}
                    />
                    <div className="absolute right-0 bottom-[36px] z-20 w-[300px] overflow-hidden rounded-xl border border-[#d5e1ef] bg-white shadow-[0_-14px_32px_rgba(31,60,102,.16)]">
                      <div className="border-b border-[#e8edf4] p-2.5">
                        <div className="relative">
                          <Search
                            size={13}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8b9ab0]"
                          />
                          <input
                            autoFocus
                            value={find}
                            onChange={(e) => setFind(e.target.value)}
                            placeholder="Найти подрядчика"
                            className="h-8 w-full rounded-md border border-[#dce5ef] pl-8 pr-2 text-[12.5px] outline-none focus:border-[#3b82f6]"
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto p-1.5">
                        {shown.map((contractor) => (
                          <button
                            key={contractor}
                            onClick={() => toggle(contractor)}
                            aria-pressed={linked.includes(contractor)}
                            className="contractor-choice flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left hover:bg-[#f5f9ff]"
                          >
                            <span
                              className={`contractor-check ${linked.includes(contractor) ? "is-checked" : ""}`}
                            >
                              <Check size={12} strokeWidth={2.7} />
                            </span>
                            <span className="grid size-6 place-items-center rounded-lg bg-[#edf5ff] text-[#2563eb]">
                              <Building2 size={11} />
                            </span>
                            <span className="flex-1 text-[12.5px] font-medium text-[#40516d]">
                              {contractor}
                            </span>
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center justify-between border-t border-[#e8edf4] bg-[#fafcff] px-3 py-2">
                        <button
                          onClick={() =>
                            setLinked(
                              linked.length === contractors.length
                                ? []
                                : contractors,
                            )
                          }
                          className="text-[12.5px] font-medium text-[#61738f] hover:text-[#2563eb]"
                        >
                          {linked.length === contractors.length
                            ? "Снять все"
                            : "Выбрать все"}
                        </button>
                        <button
                          onClick={() => setDrawer(false)}
                          className="text-[12.5px] font-semibold text-[#2563eb]"
                        >
                          Готово
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex min-h-[44px] flex-wrap gap-2 rounded-lg border border-[#dce5ef] bg-white p-2.5">
              {linked.length ? (
                linked.map((contractor) => (
                  <span
                    key={contractor}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[#d6e5f8] bg-[#f8fbff] px-2 py-1 text-[12.5px] font-medium text-[#425a78]"
                  >
                    <Building2 size={12} className="text-[#2563eb]" />
                    {contractor}
                    <button
                      onClick={() => toggle(contractor)}
                      className="ml-0.5 text-[#8191a7] hover:text-rose-600"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))
              ) : (
                <span className="self-center px-1 text-[12.5px] text-[#8493a8]">
                  Выберите подрядные организации для этого объекта
                </span>
              )}
            </div>
          </section>
          <Field label="Комментарий" placeholder="Дополнительная информация" />
        </div>
        <ModalFoot
          close={close}
          save={saveObject}
          label={type === "add" ? "Сохранить" : "Сохранить изменения"}
        />
      </motion.aside>
    </motion.div>
  );
}
function ContractorModal({
  close,
  done,
}: {
  close: () => void;
  done: (m: string) => void;
}) {
  const [contacts, setContacts] = useState([
    {
      name: "Александр Крылов",
      phone: "+7 495 123-45-67",
      email: "office@company.ru",
    },
  ]);
  const [show, setShow] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [linked, setLinked] = useState([
    objectsInitial[0].code,
    objectsInitial[1].code,
  ]);
  const [find, setFind] = useState("");
  useOverlayLock(close);
  const shown = objectsInitial.filter(
    (object) =>
      object.name.toLowerCase().includes(find.toLowerCase()) ||
      object.address.toLowerCase().includes(find.toLowerCase()),
  );
  const toggle = (code: string) =>
    setLinked((x) =>
      x.includes(code) ? x.filter((v) => v !== code) : [...x, code],
    );
  return (
    <motion.div
      className="overlay-layer fixed inset-0 z-[60] isolate"
      initial="closed"
      animate="open"
      exit="closed"
    >
      <motion.button
        aria-label="Закрыть редактирование подрядчика"
        onClick={close}
        className="absolute inset-0 z-0 cursor-default bg-[#15233a]/30"
        variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      />
      <motion.aside
        aria-label="Редактирование подрядчика"
        aria-modal="true"
        role="dialog"
        className="overlay-drawer-panel fixed bottom-0 right-0 top-0 z-10 flex w-[480px] flex-col border-l border-[#dfe6ef] bg-white shadow-[-14px_0_36px_rgba(34,51,84,.18)]"
        variants={{ closed: { x: "100%" }, open: { x: 0 } }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: "transform" }}
      >
        <ModalHead
          title="Редактирование подрядчика"
          sub="Основные данные подрядной организации"
          close={close}
        />
        <div className="overlay-scroll-region flex-1 overflow-y-auto space-y-7 px-7 py-6">
          <div className="space-y-4">
            <Field label="Название организации *" value="ООО «Альфа Строй»" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="ИНН *" value="7704218000" />
            </div>
          </div>
          <section className="rounded-xl border border-[#e3eaf3] bg-[#f8fbff] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-[#1e293b]">
                Контактные лица
              </h3>
              <button
                onClick={() =>
                  setContacts([...contacts, { name: "", phone: "", email: "" }])
                }
                className="flex h-8 items-center gap-1.5 rounded-lg border border-[#cfe0f7] bg-white px-2.5 text-[12.5px] font-semibold text-[#2563eb] transition hover:bg-[#eef5ff]"
              >
                <Plus size={14} />
                Добавить
              </button>
            </div>
            <div className="space-y-3">
              {contacts.map((c, i) => (
                <div
                  key={i}
                  className="relative rounded-lg border border-[#dce5ef] bg-white p-3.5"
                >
                  <div className="space-y-3">
                    <div className="pr-8">
                      <Field
                        label="ФИО"
                        value={c.name}
                        placeholder="Контактное лицо"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field
                        label="Телефон"
                        value={c.phone}
                        placeholder="+7 999 000-00-00"
                      />
                      <Field
                        label="Email"
                        value={c.email}
                        placeholder="email@company.ru"
                      />
                    </div>
                  </div>
                  <button
                    disabled={contacts.length === 1}
                    onClick={() =>
                      setContacts(contacts.filter((_, x) => x !== i))
                    }
                    className="absolute right-2 top-2 grid size-7 place-items-center rounded-md text-[#9aa8b9] hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-xl border border-[#dce8fa] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="grid size-7 place-items-center rounded-lg bg-[#eef5ff] text-[#2563eb]">
                <KeyRound size={14} />
              </div>
              <h3 className="text-[15px] font-semibold">Данные для входа</h3>
            </div>
            <p className="mt-1.5 text-[12.5px] text-[#71839e]">
              Пароль выдаётся представителю подрядной организации.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Field label="Логин" value="alfa-stroy" />
              <label className="block">
                <span className="mb-1.5 block text-[13.5px] font-medium text-[#40516d]">
                  Пароль
                </span>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    defaultValue="Contractor-2026"
                    className="h-10 w-full rounded-lg border border-[#dce5f0] bg-white px-3 pr-12 text-[15px] outline-none"
                  />
                  <button
                    type="button"
                    aria-label={show ? "Скрыть пароль" : "Показать пароль"}
                    onClick={() => setShow(!show)}
                    className="password-visibility absolute inset-y-0 right-1 grid w-9 place-items-center rounded-lg text-[#71839e]"
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>
            </div>
          </section>
          <section className="rounded-xl border border-[#e3eaf3] bg-[#f8fbff] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-[#1e293b]">
                  Привязанные объекты
                </h3>
                <p className="mt-1 text-[12.5px] text-[#71839e]">
                  {linked.length
                    ? `Выбрано объектов: ${linked.length}`
                    : "Объекты не выбраны"}
                </p>
              </div>
              <div className="relative">
                <button
                  onClick={() => setDrawer(!drawer)}
                  className={`association-picker-button flex items-center border font-semibold transition ${drawer ? "border-[#85b9ff] bg-[#eef5ff] text-[#2563eb] ring-2 ring-blue-100" : "border-[#cfe0f7] bg-white text-[#2563eb] hover:bg-[#eef5ff]"}`}
                >
                  <Plus size={14} />
                  Выбрать
                </button>
                {drawer && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDrawer(false)}
                    />
                    <div className="absolute right-0 bottom-[36px] z-20 w-[300px] overflow-hidden rounded-xl border border-[#d5e1ef] bg-white shadow-[0_-14px_32px_rgba(31,60,102,.16)]">
                      <div className="border-b border-[#e8edf4] p-2.5">
                        <div className="relative">
                          <Search
                            size={13}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8b9ab0]"
                          />
                          <input
                            autoFocus
                            value={find}
                            onChange={(e) => setFind(e.target.value)}
                            placeholder="Поиск по названию или адресу"
                            className="h-8 w-full rounded-md border border-[#dce5ef] pl-8 pr-2 text-[12.5px] outline-none focus:border-[#3b82f6]"
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto p-1.5">
                        {shown.map((item) => (
                          <button
                            key={item.code}
                            onClick={() => toggle(item.code)}
                            className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left hover:bg-[#f5f9ff]"
                          >
                            <span
                              className={`grid size-3.5 place-items-center rounded-sm border text-[12.5px] ${linked.includes(item.code) ? "border-[#2563eb] bg-[#2563eb] text-white" : "border-[#cbd7e6] bg-white text-transparent"}`}
                            >
                              ✓
                            </span>
                            <span className="grid size-6 place-items-center rounded-lg bg-[#edf5ff] text-[#2563eb]">
                              <MapPin size={11} />
                            </span>
                            <span className="flex-1">
                              <span className="block text-[12.5px] font-medium text-[#40516d]">
                                {item.name}
                              </span>
                            </span>
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center justify-between border-t border-[#e8edf4] bg-[#fafcff] px-3 py-2">
                        <button
                          onClick={() =>
                            setLinked(
                              linked.length === objectsInitial.length
                                ? []
                                : objectsInitial.map((x) => x.code),
                            )
                          }
                          className="text-[12.5px] font-medium text-[#61738f] hover:text-[#2563eb]"
                        >
                          {linked.length === objectsInitial.length
                            ? "Снять все"
                            : "Выбрать все"}
                        </button>
                        <button
                          onClick={() => setDrawer(false)}
                          className="text-[12.5px] font-semibold text-[#2563eb]"
                        >
                          Готово
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex min-h-[44px] flex-wrap gap-2 rounded-lg border border-[#dce5ef] bg-white p-2.5">
              {linked.length ? (
                linked.map((code) => {
                  const item = objectsInitial.find((x) => x.code === code)!;
                  return (
                    <span
                      key={code}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[#d6e5f8] bg-[#f8fbff] px-2 py-1 text-[12.5px] font-medium text-[#425a78]"
                    >
                      <MapPin size={12} className="text-[#2563eb]" />
                      {item.name}
                      <button
                        onClick={() => toggle(code)}
                        className="ml-0.5 text-[#8191a7] hover:text-rose-600"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  );
                })
              ) : (
                <span className="self-center px-1 text-[12.5px] text-[#8493a8]">
                  Выберите объекты для этого подрядчика
                </span>
              )}
            </div>
          </section>
        </div>
        <ModalFoot
          close={close}
          save={() => done("Данные подрядчика сохранены")}
          label="Сохранить"
        />
      </motion.aside>
    </motion.div>
  );
}
function TagsPage({
  toast,
}: {
  toast: (m: string) => void;
}) {
  const [tags, setTags] = useState<ManagedTag[]>(() =>
    initialTags.map((tag, index) => ({
      ...tag,
      business:
        index % 2 ? "БЦ «Орион»" : "Логистический центр «Запад»",
      title: ["Архив", "Комната 1", "Комната 2", "Переговорная", "Склад"][
        index
      ],
      type:
        index === 1
          ? "Журнал"
          : index === 2
            ? "Не выбран"
            : "Посещение",
      contractors:
        index === 0
          ? [contractors[0], contractors[1]]
          : index === 1
            ? [contractors[2]]
            : [],
      active: index !== 2,
    })),
  );
  const [editingTag, setEditingTag] = useState<ManagedTag | null>(null);
  const [view, setView] = useState<"tags" | "businesses">("tags");
  const [expandedBusiness, setExpandedBusiness] = useState<string | null>(null);
  const [business, setBusiness] = useState("Все бизнес-центры");
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const visibleGroups = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return tagBusinessGroups
      .filter(
        (object) =>
          business === "Все бизнес-центры" || object.name === business,
      )
      .map((object) => {
        const objectTags = tags.filter((tag) => tag.business === object.name);
        const businessMatches =
          !normalized ||
          `${object.name} ${object.address} ${object.code}`
            .toLowerCase()
            .includes(normalized);
        const hasTagMatch = objectTags.some((tag) =>
          `${tag.id} ${tag.uid} ${tag.title} ${tag.type} ${tag.contractors.join(" ")}`
            .toLowerCase()
            .includes(normalized),
        );
        return {
          object,
          tags: objectTags,
          matches: businessMatches || hasTagMatch,
        };
      })
      .filter((group) => !normalized || group.matches);
  }, [tags, business, query]);

  const totalVisibleTags = visibleGroups.reduce(
    (total, group) => total + group.tags.length,
    0,
  );
  const visibleTags = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return tags.filter(
      (tag) =>
        (business === "Все бизнес-центры" || tag.business === business) &&
        (!normalized ||
          `${tag.id} ${tag.uid} ${tag.title} ${tag.type} ${tag.business} ${tag.contractors.join(" ")}`
            .toLowerCase()
            .includes(normalized)),
    );
  }, [tags, business, query]);
  const toneFor = (type: TagType) =>
    type === "Посещение"
      ? "is-visit"
      : type === "Журнал"
        ? "is-journal"
        : "is-neutral";
  const tagCountLabel = (count: number) => {
    const lastTwo = count % 100;
    const last = count % 10;
    if (lastTwo >= 11 && lastTwo <= 14) return `${count} меток`;
    if (last === 1) return `${count} метка`;
    if (last >= 2 && last <= 4) return `${count} метки`;
    return `${count} меток`;
  };
  const openNewTag = (businessName: string) => {
    const nextNumber =
      Math.max(
        0,
        ...tags.map((tag) => Number(tag.id.replace(/\D/g, "")) || 0),
      ) + 1;
    const uidParts = [
      (151 + nextNumber * 17) % 256,
      (44 + nextNumber * 29) % 256,
      (93 + nextNumber * 37) % 256,
    ].map((value) => value.toString(16).padStart(2, "0").toUpperCase());
    setEditingTag({
      id: `NFC-${String(nextNumber).padStart(3, "0")}`,
      uid: `04:${uidParts.join(":")}`,
      color: "bg-slate-400",
      business: businessName,
      title: "",
      type: "Не выбран",
      contractors: [],
      active: true,
      isNew: true,
    });
  };
  const toggleTag = (tagId: string) => {
    setTags((items) =>
      items.map((tag) =>
        tag.id === tagId ? { ...tag, active: !tag.active } : tag,
      ),
    );
    toast("Статус метки изменён");
  };
  const removeTag = (tagId: string) => {
    setTags((items) => items.filter((tag) => tag.id !== tagId));
    toast("Метка удалена из бизнес-центра");
  };
  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      toast("Данные обновлены");
    }, 550);
  };
  return (
    <section className="px-10 py-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-1 text-[13.5px] text-[#7b8ba3]">
            Управление персоналом / Метки
          </p>
          <h1 className="text-[34px] font-bold tracking-[-.025em]">Метки</h1>
          <p className="mt-2 text-[16px] text-[#71819b]">
            Список NFC-меток и управление привязками к бизнес-центрам
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={refreshing}
          className="flex h-10 items-center gap-2 rounded-lg border border-[#dce5ef] bg-white px-4 text-[15px] font-medium text-[#4f617b] disabled:opacity-60"
        >
          <RefreshCw className={refreshing ? "animate-spin" : ""} size={15} />
          Обновить
        </button>
      </div>
      <div className="business-tags-toolbar mt-6 flex items-center gap-3 rounded-xl border border-[#dfe6ef] bg-white p-4">
        <div className="w-72">
          <Select
            value={business}
            onChange={setBusiness}
            options={[
              "Все бизнес-центры",
              ...tagBusinessGroups.map((x) => x.name),
            ]}
          />
        </div>
        <div className="relative max-w-xl flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8293ad]"
            size={15}
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Поиск по названию, ID или UID"
            className="h-10 w-full rounded-lg border border-[#dce5f0] pl-9 pr-3 text-[13.5px] outline-none"
          />
        </div>
        <div className="ml-auto flex items-center gap-4 text-[12.5px] text-[#71839e]">
          <span className="flex items-center gap-1.5">
            <i className="size-2.5 rounded-full bg-[#a5b1c2]" />
            Тип не выбран
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-2.5 rounded-full bg-[#2563eb]" />
            Посещение
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-2.5 rounded-full bg-[#e87918]" />
            Журнал
          </span>
        </div>
      </div>
      <div
        className={`business-tags-workspace mt-5 overflow-visible rounded-xl border border-[#dfe6ef] bg-white ${view === "tags" ? "is-tags" : "is-businesses"}`}
      >
        <div className="business-tags-header flex items-center justify-between border-b border-[#e6ebf2] px-6 py-5">
          <div>
            <h2 className="text-[18px] font-semibold">
              {view === "tags" ? "Все метки" : "Связь с бизнес-центрами"}
            </h2>
            <p className="mt-1 text-[13.5px] text-[#7788a1]">
              {view === "tags"
                ? "Цвет метки соответствует выбранному типу"
                : "Выберите БЦ, чтобы посмотреть или изменить связанные метки"}
            </p>
          </div>
          <div className="tag-view-controls">
            <div
              className="tag-view-switcher"
              role="group"
              aria-label="Режим отображения меток"
            >
              <button
                type="button"
                className={view === "tags" ? "is-active" : ""}
                aria-pressed={view === "tags"}
                onClick={() => setView("tags")}
              >
                <Tag size={14} />
                Все метки
              </button>
              <button
                type="button"
                className={view === "businesses" ? "is-active" : ""}
                aria-pressed={view === "businesses"}
                onClick={() => setView("businesses")}
              >
                <Building2 size={14} />
                Связь с БЦ
              </button>
            </div>
            <span className="tag-view-count">
              {view === "tags"
                ? `Найдено: ${visibleTags.length}`
                : `${visibleGroups.filter((group) => group.object.code !== "NO-LINK").length} БЦ · ${tagCountLabel(totalVisibleTags)}`}
            </span>
          </div>
        </div>
        {view === "tags" ? (
          <TagsListTable
            tags={visibleTags}
            edit={setEditingTag}
            reset={() => {
              setBusiness("Все бизнес-центры");
              setQuery("");
            }}
          />
        ) : (
          <table className="business-tags-table w-full text-left">
          <thead className="bg-[#f8fafc] text-[12.5px] uppercase tracking-[.06em] text-[#7485a0]">
            <tr>
              <th className="px-6 py-3">Бизнес-центр</th>
              <th className="px-3 py-3">Связанные метки</th>
              <th className="px-6 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {visibleGroups.length ? (
              visibleGroups.map(({ object, tags: objectTags }) => {
                const expanded = expandedBusiness === object.name;
                const isUnassigned = object.code === "NO-LINK";
                const activeTags = objectTags.filter((tag) => tag.active);
                return (
                  <Fragment key={object.name}>
                    <tr
                      className={`business-center-row border-t border-[#e8edf4] ${expanded ? "is-expanded" : ""} ${isUnassigned ? "is-unassigned" : ""}`}
                      role="button"
                      tabIndex={0}
                      aria-expanded={expanded}
                      onClick={() =>
                        setExpandedBusiness(expanded ? null : object.name)
                      }
                      onKeyDown={(event) => {
                        if (
                          event.target === event.currentTarget &&
                          (event.key === "Enter" || event.key === " ")
                        ) {
                          event.preventDefault();
                          setExpandedBusiness(expanded ? null : object.name);
                        }
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="business-center-name">
                          <span className="business-center-icon">
                            {isUnassigned ? (
                              <AlertTriangle size={17} />
                            ) : (
                              <Building2 size={17} />
                            )}
                          </span>
                          <span>
                            <strong>{object.name}</strong>
                            <small>
                              {isUnassigned
                                ? object.address
                                : `${object.code} · ${object.address}`}
                            </small>
                          </span>
                        </div>
                      </td>
                      <td className="px-3">
                        <div className="tag-summary-wrap">
                          <button
                            type="button"
                            className="tag-summary"
                            aria-expanded={expanded}
                            onClick={(event) => {
                              event.stopPropagation();
                              setExpandedBusiness(
                                expanded ? null : object.name,
                              );
                            }}
                          >
                            <span className="tag-dot-stack">
                              {objectTags.slice(0, 4).map((tag) => (
                                <i
                                  key={tag.id}
                                  className={`tag-color-dot ${toneFor(tag.type)}`}
                                />
                              ))}
                              {!objectTags.length && (
                                <i className="tag-color-dot is-empty" />
                              )}
                            </span>
                            <span>
                              <strong>{tagCountLabel(objectTags.length)}</strong>
                              <small>
                                {activeTags.length} активных
                              </small>
                            </span>
                          </button>
                          {objectTags.length > 0 && (
                            <div className="tag-hover-preview">
                              <div className="tag-hover-preview-head">
                                <strong>Метки объекта</strong>
                                <span>{tagCountLabel(objectTags.length)}</span>
                              </div>
                              <div className="tag-hover-preview-list">
                                {objectTags.map((tag) => (
                                  <div key={tag.id}>
                                    <i
                                      className={`tag-color-dot ${toneFor(tag.type)}`}
                                    />
                                    <span>
                                      <strong>{tag.id}</strong>
                                      <small>{tag.title || "Без названия"}</small>
                                    </span>
                                    <em>{tag.type}</em>
                                  </div>
                                ))}
                              </div>
                              <small className="tag-hover-preview-hint">
                                Нажмите, чтобы управлять метками
                              </small>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6">
                        <div className="business-tag-actions">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              openNewTag(object.name);
                            }}
                          >
                            <Plus size={14} />
                            {isUnassigned ? "Создать" : "Добавить"}
                          </button>
                          <button
                            type="button"
                            aria-label={
                              expanded
                                ? `Свернуть метки ${object.name}`
                                : `Показать метки ${object.name}`
                            }
                            className="business-expand-button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setExpandedBusiness(
                                expanded ? null : object.name,
                              );
                            }}
                          >
                            <ChevronDown size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="business-tags-expanded-row">
                      <td colSpan={3}>
                        <AnimatePresence initial={false}>
                          {expanded && (
                            <motion.div
                              className="business-tags-expanded"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{
                                duration: 0.22,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                            >
                              <div className="business-tags-expanded-head">
                                <div>
                                  <strong>
                                    {isUnassigned
                                      ? "Метки без привязки"
                                      : "Метки бизнес-центра"}
                                  </strong>
                                  <span>
                                    {isUnassigned
                                      ? "Назначьте бизнес-центр прямо в редакторе метки"
                                      : "Редактируйте данные, статус и привязки без перехода на другой экран"}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => openNewTag(object.name)}
                                >
                                  <Plus size={14} />
                                  {isUnassigned
                                    ? "Создать без привязки"
                                    : "Добавить метку"}
                                </button>
                              </div>
                              {objectTags.length ? (
                                <div className="business-tag-grid">
                                  {objectTags.map((tag) => (
                                    <article
                                      key={tag.id}
                                      className={`business-tag-card ${tag.active ? "" : "is-disabled"}`}
                                    >
                                      <span
                                        className={`business-tag-tone ${toneFor(tag.type)}`}
                                      />
                                      <div className="business-tag-card-main">
                                        <div>
                                          <span>
                                            <strong>{tag.id}</strong>
                                            <em
                                              className={`tag-state-badge ${tag.active ? "is-active" : ""}`}
                                            >
                                              {tag.active
                                                ? "Активна"
                                                : "Отключена"}
                                            </em>
                                          </span>
                                          <small>{tag.uid}</small>
                                        </div>
                                        <h3>{tag.title || "Без названия"}</h3>
                                        <div className="business-tag-meta">
                                          <span
                                            className={`tag-type-pill ${toneFor(tag.type)}`}
                                          >
                                            {tag.type}
                                          </span>
                                          <span>
                                            {tag.contractors.length
                                              ? `${tag.contractors.length} подрядчика`
                                              : "Без подрядчиков"}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="business-tag-card-actions">
                                        <button
                                          type="button"
                                          role="switch"
                                          aria-checked={tag.active}
                                          aria-label={
                                            tag.active
                                              ? `Отключить ${tag.id}`
                                              : `Включить ${tag.id}`
                                          }
                                          className={`tag-toggle ${tag.active ? "is-active" : ""}`}
                                          onClick={() => toggleTag(tag.id)}
                                        >
                                          <i />
                                        </button>
                                        <button
                                          type="button"
                                          aria-label={`Редактировать ${tag.id}`}
                                          onClick={() => setEditingTag(tag)}
                                        >
                                          <Pencil size={14} />
                                        </button>
                                        <button
                                          type="button"
                                          aria-label={`Удалить ${tag.id}`}
                                          className="is-danger"
                                          onClick={() => removeTag(tag.id)}
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    </article>
                                  ))}
                                </div>
                              ) : (
                                <div className="business-tags-empty">
                                  <span>
                                    <Tag size={19} />
                                  </span>
                                  <div>
                                    <strong>У объекта пока нет меток</strong>
                                    <small>
                                      Добавьте первую NFC-метку и настройте её
                                      назначение
                                    </small>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => openNewTag(object.name)}
                                  >
                                    Добавить метку
                                  </button>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </tr>
                  </Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={3}>
                  <div className="empty-filter-state">
                    <Search size={20} />
                    <strong>Бизнес-центры не найдены</strong>
                    <span>Измените фильтр или поисковый запрос</span>
                    <button
                      onClick={() => {
                        setBusiness("Все бизнес-центры");
                        setQuery("");
                      }}
                    >
                      Сбросить фильтры
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        )}
      </div>
      <AnimatePresence>
        {editingTag && (
          <TagDrawer
            key={editingTag.id}
            tag={editingTag}
            close={() => setEditingTag(null)}
            save={(updated) => {
              const { isNew, ...savedTag } = updated;
              setTags((items) => {
                const exists = items.some((item) => item.id === savedTag.id);
                return exists
                  ? items.map((item) =>
                      item.id === savedTag.id ? savedTag : item,
                    )
                  : [...items, savedTag];
              });
              setExpandedBusiness(savedTag.business);
              setEditingTag(null);
              toast(isNew ? "Метка добавлена" : "Метка обновлена");
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function TagsListTable({
  tags,
  edit,
  reset,
}: {
  tags: ManagedTag[];
  edit: (tag: ManagedTag) => void;
  reset: () => void;
}) {
  const colorFor = (type: TagType) =>
    type === "Посещение"
      ? "bg-[#2563eb]"
      : type === "Журнал"
        ? "bg-[#e87918]"
        : "bg-[#a5b1c2]";
  return (
    <table className="tags-table responsive-table w-full text-left">
      <thead className="bg-[#f8fafc] text-[12.5px] uppercase tracking-[.06em] text-[#7485a0]">
        <tr>
          <th className="px-6 py-3">Метка</th>
          <th className="px-3 py-3">Бизнес-центр</th>
          <th className="px-3 py-3">Название</th>
          <th className="px-3 py-3">Тип</th>
          <th className="px-6 py-3">Подрядчики</th>
          <th className="px-6 py-3 text-right">Действия</th>
        </tr>
      </thead>
      <tbody>
        {tags.length ? (
          tags.map((tag) => (
            <tr key={tag.id} className="border-t border-[#e8edf4]">
              <td data-label="Метка" className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`size-3 rounded-full ring-4 ${tag.type === "Посещение" ? "ring-blue-50" : tag.type === "Журнал" ? "ring-orange-50" : "ring-slate-100"} ${colorFor(tag.type)}`}
                  />
                  <div>
                    <p className="text-[13.5px] font-semibold">{tag.id}</p>
                    <p className="font-mono text-[12.5px] text-[#7b8ca3]">
                      {tag.uid}
                    </p>
                  </div>
                </div>
              </td>
              <td
                data-label="Бизнес-центр"
                className="px-3 text-[13.5px] text-[#526783]"
              >
                <span
                  className={`tag-business-cell ${tag.business === UNASSIGNED_BUSINESS ? "is-unassigned" : ""}`}
                >
                  {tag.business === UNASSIGNED_BUSINESS ? (
                    <AlertTriangle size={13} />
                  ) : (
                    <Building2 size={13} />
                  )}
                  {tag.business}
                </span>
              </td>
              <td data-label="Название" className="px-3">
                <span className="text-[13.5px] font-medium text-[#263851]">
                  {tag.title || "—"}
                </span>
              </td>
              <td data-label="Тип" className="px-3">
                <span className="text-[13.5px] text-[#40516d]">
                  {tag.type}
                </span>
              </td>
              <td data-label="Подрядчики" className="px-6">
                <div className="flex min-h-9 items-center gap-2">
                  {tag.contractors.length ? (
                    <>
                      <span className="flex -space-x-1.5">
                        {tag.contractors.slice(0, 3).map((contractor) => (
                          <span
                            key={contractor}
                            className="grid size-5 place-items-center rounded-full border-2 border-white bg-[#eaf3ff] text-[12.5px] font-bold text-[#2563eb]"
                          >
                            {contractor.replace("ООО ", "").slice(0, 1)}
                          </span>
                        ))}
                      </span>
                      <span className="max-w-[130px] truncate text-[12.5px] font-medium text-[#425a78]">
                        {tag.contractors.length === 1
                          ? tag.contractors[0].replace("ООО ", "")
                          : `${tag.contractors.length} подрядчика`}
                      </span>
                    </>
                  ) : (
                    <span className="text-[12.5px] text-[#8493a8]">—</span>
                  )}
                </div>
              </td>
              <td data-label="Действия" className="px-6 text-right">
                <button
                  aria-label={`Редактировать ${tag.id}`}
                  onClick={() => edit(tag)}
                  className="ml-auto grid size-8 place-items-center rounded-lg text-[#8293ad] transition hover:bg-[#edf5ff] hover:text-[#2563eb]"
                >
                  <Pencil size={15} />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6}>
              <div className="empty-filter-state">
                <Search size={20} />
                <strong>Метки не найдены</strong>
                <span>Измените фильтр или поисковый запрос</span>
                <button onClick={reset}>Сбросить фильтры</button>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

function LegacyTagsPage({ toast }: { toast: (m: string) => void }) {
  const [tags, setTags] = useState(
    initialTags.map((tag, i) => ({
      ...tag,
      business: i % 2 ? "БЦ «Орион»" : "Логистический центр «Запад»",
      title: ["Архив", "Комната 1", "Комната 2", "Переговорная", "Склад"][i],
      type: i === 1 ? "Журнал" : i === 2 ? "Не выбран" : "Посещение",
      contractors:
        i === 0
          ? [contractors[0], contractors[1]]
          : i === 1
            ? [contractors[2]]
            : [],
    })),
  );
  const [editingTag, setEditingTag] = useState<any>(null);
  const [business, setBusiness] = useState("Все бизнес-центры");
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const visibleTags = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return tags.filter(
      (tag) =>
        (business === "Все бизнес-центры" || tag.business === business) &&
        (!normalized ||
          `${tag.id} ${tag.uid} ${tag.title} ${tag.type}`
            .toLowerCase()
            .includes(normalized)),
    );
  }, [tags, business, query]);
  const colorFor = (type: string) =>
    type === "Посещение"
      ? "bg-[#2563eb]"
      : type === "Журнал"
        ? "bg-[#e87918]"
        : "bg-[#a5b1c2]";
  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      toast("Данные обновлены");
    }, 550);
  };
  return (
    <section className="px-10 py-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-1 text-[13.5px] text-[#7b8ba3]">
            Управление персоналом / Метки
          </p>
          <h1 className="text-[34px] font-bold tracking-[-.025em]">Метки</h1>
          <p className="mt-2 text-[16px] text-[#71819b]">
            Список NFC-меток и привязок к подрядным организациям
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={refreshing}
          className="flex h-10 items-center gap-2 rounded-lg border border-[#dce5ef] bg-white px-4 text-[15px] font-medium text-[#4f617b] disabled:opacity-60"
        >
          <RefreshCw className={refreshing ? "animate-spin" : ""} size={15} />
          Обновить
        </button>
      </div>
      <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#dfe6ef] bg-white p-4">
        <div className="w-72">
          <Select
            value={business}
            onChange={setBusiness}
            options={[
              "Все бизнес-центры",
              ...objectsInitial.map((x) => x.name),
            ]}
          />
        </div>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8293ad]"
            size={15}
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Поиск по названию, ID или UID"
            className="h-10 rounded-lg border border-[#dce5f0] pl-9 pr-3 text-[13.5px] outline-none"
          />
        </div>
        <div className="ml-auto flex items-center gap-4 text-[12.5px] text-[#71839e]">
          <span className="flex items-center gap-1.5">
            <i className="size-2.5 rounded-full bg-[#a5b1c2]" />
            Тип не выбран
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-2.5 rounded-full bg-[#2563eb]" />
            Посещение
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-2.5 rounded-full bg-[#e87918]" />
            Журнал
          </span>
        </div>
      </div>
      <div className="mt-5 overflow-visible rounded-xl border border-[#dfe6ef] bg-white">
        <div className="flex items-center justify-between border-b border-[#e6ebf2] px-6 py-5">
          <div>
            <h2 className="text-[18px] font-semibold">Все метки</h2>
            <p className="mt-1 text-[13.5px] text-[#7788a1]">
              Цвет метки соответствует выбранному типу
            </p>
          </div>
          <span className="text-[13.5px] text-[#71839e]">
            Найдено: {visibleTags.length}
          </span>
        </div>
        <table className="tags-table responsive-table w-full text-left">
          <thead className="bg-[#f8fafc] text-[12.5px] uppercase tracking-[.06em] text-[#7485a0]">
            <tr>
              <th className="px-6 py-3">Метка</th>
              <th className="px-3 py-3">Бизнес-центр</th>
              <th className="px-3 py-3">Название</th>
              <th className="px-3 py-3">Тип</th>
              <th className="px-6 py-3">Подрядчики</th>
              <th className="px-6 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {visibleTags.length ? (
              visibleTags.map((tag) => (
                <tr key={tag.id} className="border-t border-[#e8edf4]">
                  <td data-label="Метка" className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`size-3 rounded-full ring-4 ${tag.type === "Посещение" ? "ring-blue-50" : tag.type === "Журнал" ? "ring-orange-50" : "ring-slate-100"} ${colorFor(tag.type)}`}
                      />
                      <div>
                        <p className="text-[13.5px] font-semibold">{tag.id}</p>
                        <p className="font-mono text-[12.5px] text-[#7b8ca3]">
                          {tag.uid}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td data-label="Бизнес-центр" className="px-3 text-[13.5px] text-[#526783]">
                    {tag.business}
                  </td>
                  <td data-label="Название" className="px-3">
                    <span className="text-[13.5px] font-medium text-[#263851]">
                      {tag.title || "—"}
                    </span>
                  </td>
                  <td data-label="Тип" className="px-3">
                    <span className="text-[13.5px] text-[#40516d]">
                      {tag.type}
                    </span>
                  </td>
                  <td data-label="Подрядчики" className="px-6">
                    <div className="flex min-h-9 items-center gap-2">
                      {tag.contractors.length ? (
                        <>
                          <span className="flex -space-x-1.5">
                            {tag.contractors
                              .slice(0, 3)
                              .map((contractor: string) => (
                                <span
                                  key={contractor}
                                  className="grid size-5 place-items-center rounded-full border-2 border-white bg-[#eaf3ff] text-[12.5px] font-bold text-[#2563eb]"
                                >
                                  {contractor.replace("ООО ", "").slice(0, 1)}
                                </span>
                              ))}
                          </span>
                          <span className="max-w-[130px] truncate text-[12.5px] font-medium text-[#425a78]">
                            {tag.contractors.length === 1
                              ? tag.contractors[0].replace("ООО ", "")
                              : `${tag.contractors.length} подрядчика`}
                          </span>
                        </>
                      ) : (
                        <span className="text-[12.5px] text-[#8493a8]">—</span>
                      )}
                    </div>
                  </td>
                  <td data-label="Действия" className="px-6 text-right">
                    <button
                      aria-label={`Редактировать ${tag.id}`}
                      onClick={() => setEditingTag(tag)}
                      className="ml-auto grid size-8 place-items-center rounded-lg text-[#8293ad] transition hover:bg-[#edf5ff] hover:text-[#2563eb]"
                    >
                      <Pencil size={15} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>
                  <div className="empty-filter-state">
                    <Search size={20} />
                    <strong>Метки не найдены</strong>
                    <span>Измените фильтр или поисковый запрос</span>
                    <button
                      onClick={() => {
                        setBusiness("Все бизнес-центры");
                        setQuery("");
                      }}
                    >
                      Сбросить фильтры
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <AnimatePresence>
        {editingTag && (
          <TagDrawer
            key={editingTag.id}
            tag={editingTag}
            close={() => setEditingTag(null)}
            save={(updated) => {
              setTags((items) =>
                items.map((item) => (item.id === updated.id ? updated : item)),
              );
              setEditingTag(null);
              toast("Метка обновлена");
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
function TagDrawer({
  tag,
  close,
  save,
}: {
  tag: ManagedTag;
  close: () => void;
  save: (tag: ManagedTag) => void;
}) {
  const [title, setTitle] = useState(tag.title || "");
  const [type, setType] = useState<TagType>(tag.type || "Не выбран");
  const [business, setBusiness] = useState(
    tag.business || UNASSIGNED_BUSINESS,
  );
  const [active, setActive] = useState(tag.active ?? true);
  const [linked, setLinked] = useState<string[]>(tag.contractors || []);
  const [drawer, setDrawer] = useState(false);
  const [find, setFind] = useState("");
  useOverlayLock(close);
  const shown = contractors.filter((c) =>
    c.toLowerCase().includes(find.toLowerCase()),
  );
  const toggle = (c: string) =>
    setLinked((x) => (x.includes(c) ? x.filter((v) => v !== c) : [...x, c]));
  const selectedBusiness = objectsInitial.find(
    (object) => object.name === business,
  );
  return (
    <motion.div
      className="overlay-layer tag-drawer-layer fixed inset-0 z-[60] isolate"
      initial="closed"
      animate="open"
      exit="closed"
    >
      <motion.button
        aria-label="Закрыть редактирование метки"
        onClick={close}
        className="absolute inset-0 z-0 cursor-default bg-[#15233a]/30"
        variants={{
          closed: { opacity: 0 },
          open: { opacity: 1 },
        }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      />
      <motion.aside
        aria-label="Редактирование метки"
        aria-modal="true"
        role="dialog"
        className="overlay-drawer-panel tag-drawer-panel fixed bottom-0 right-0 top-0 z-10 flex w-[480px] flex-col border-l border-[#dfe6ef] bg-white shadow-[-14px_0_36px_rgba(34,51,84,.18)]"
        variants={{
          closed: { x: "100%" },
          open: { x: 0 },
        }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: "transform" }}
      >
        <ModalHead
          title={tag.isNew ? "Добавление метки" : "Редактирование метки"}
          sub={`UID: ${tag.uid}`}
          close={close}
        />
        <div className="overlay-scroll-region tag-drawer-scroll-region flex-1 overflow-y-auto space-y-7 px-7 py-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-1.5 block text-[13.5px] font-medium text-[#40516d]">
                  Идентификатор
                </span>
                <input
                  value={tag.id}
                  disabled
                  className="h-10 w-full rounded-lg border border-[#e2e8f1] bg-[#f8fafc] px-3 text-[15px] text-[#64748b] outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13.5px] font-medium text-[#40516d]">
                  Тип метки
                </span>
              <Select
                value={type}
                  onChange={(value) => setType(value as TagType)}
                  options={["Не выбран", "Посещение", "Журнал"]}
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-[13.5px] font-medium text-[#40516d]">
                Название метки
              </span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например, Комната 1"
                className="h-10 w-full rounded-lg border border-[#dce5f0] bg-white px-3 text-[15px] text-[#16223a] outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13.5px] font-medium text-[#40516d]">
                Привязка к бизнес-центру
              </span>
              <Select
                value={business}
                onChange={setBusiness}
                options={[
                  UNASSIGNED_BUSINESS,
                  ...objectsInitial.map((x) => x.name),
                ]}
              />
              <small className="mt-1.5 block text-[12px] leading-5 text-[#8191a7]">
                Выберите другой БЦ для переноса метки или снимите привязку.
              </small>
            </label>
            <div
              className={`tag-business-link-card ${selectedBusiness ? "is-linked" : "is-unassigned"}`}
            >
              <span>
                {selectedBusiness ? (
                  <Building2 size={17} />
                ) : (
                  <AlertTriangle size={17} />
                )}
              </span>
              <div>
                <strong>
                  {selectedBusiness?.name || "Метка без бизнес-центра"}
                </strong>
                <small>
                  {selectedBusiness
                    ? `${selectedBusiness.code} · ${selectedBusiness.address}`
                    : "Она останется доступна в отдельной группе без привязки"}
                </small>
              </div>
            </div>
            <div className="tag-drawer-status">
              <span
                className={`tag-drawer-status-icon ${active ? "is-active" : ""}`}
              >
                {active ? (
                  <CheckCircle2 size={17} />
                ) : (
                  <AlertTriangle size={17} />
                )}
              </span>
              <span>
                <strong>{active ? "Метка активна" : "Метка отключена"}</strong>
                <small>
                  {active
                    ? "События с метки принимаются системой"
                    : "События временно не учитываются"}
                </small>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={active}
                aria-label={active ? "Отключить метку" : "Включить метку"}
                className={`tag-toggle ${active ? "is-active" : ""}`}
                onClick={() => setActive((value) => !value)}
              >
                <i />
              </button>
            </div>
          </div>
          <section className="rounded-xl border border-[#e3eaf3] bg-[#f8fbff] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-[#1e293b]">
                  Подрядные организации
                </h3>
                <p className="mt-1 text-[12.5px] text-[#71839e]">
                  {linked.length
                    ? `Выбрано подрядчиков: ${linked.length}`
                    : "Подрядчики не выбраны"}
                </p>
              </div>
              <div className="relative">
                <button
                  onClick={() => setDrawer(!drawer)}
                  className={`association-picker-button flex items-center border font-semibold transition ${drawer ? "border-[#85b9ff] bg-[#eef5ff] text-[#2563eb] ring-2 ring-blue-100" : "border-[#cfe0f7] bg-white text-[#2563eb] hover:bg-[#eef5ff]"}`}
                >
                  <Plus size={14} />
                  Выбрать
                </button>
                {drawer && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDrawer(false)}
                    />
                    <div className="absolute right-0 bottom-[36px] z-20 w-[300px] overflow-hidden rounded-xl border border-[#d5e1ef] bg-white shadow-[0_-14px_32px_rgba(31,60,102,.16)]">
                      <div className="border-b border-[#e8edf4] p-2.5">
                        <div className="relative">
                          <Search
                            size={13}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8b9ab0]"
                          />
                          <input
                            autoFocus
                            value={find}
                            onChange={(e) => setFind(e.target.value)}
                            placeholder="Найти подрядчика"
                            className="h-8 w-full rounded-md border border-[#dce5ef] pl-8 pr-2 text-[12.5px] outline-none focus:border-[#3b82f6]"
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto p-1.5">
                        {shown.map((contractor) => (
                          <button
                            key={contractor}
                            onClick={() => toggle(contractor)}
                            aria-pressed={linked.includes(contractor)}
                            className="contractor-choice flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left hover:bg-[#f5f9ff]"
                          >
                            <span
                              className={`contractor-check ${linked.includes(contractor) ? "is-checked" : ""}`}
                            >
                              <Check size={12} strokeWidth={2.7} />
                            </span>
                            <span className="grid size-6 place-items-center rounded-lg bg-[#edf5ff] text-[#2563eb]">
                              <Building2 size={11} />
                            </span>
                            <span className="flex-1 text-[12.5px] font-medium text-[#40516d]">
                              {contractor}
                            </span>
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center justify-between border-t border-[#e8edf4] bg-[#fafcff] px-3 py-2">
                        <button
                          onClick={() =>
                            setLinked(
                              linked.length === contractors.length
                                ? []
                                : contractors,
                            )
                          }
                          className="text-[12.5px] font-medium text-[#61738f] hover:text-[#2563eb]"
                        >
                          {linked.length === contractors.length
                            ? "Снять все"
                            : "Выбрать все"}
                        </button>
                        <button
                          onClick={() => setDrawer(false)}
                          className="text-[12.5px] font-semibold text-[#2563eb]"
                        >
                          Готово
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex min-h-[44px] flex-wrap gap-2 rounded-lg border border-[#dce5ef] bg-white p-2.5">
              {linked.length ? (
                linked.map((contractor) => (
                  <span
                    key={contractor}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[#d6e5f8] bg-[#f8fbff] px-2 py-1 text-[12.5px] font-medium text-[#425a78]"
                  >
                    <Building2 size={12} className="text-[#2563eb]" />
                    {contractor}
                    <button
                      onClick={() => toggle(contractor)}
                      className="ml-0.5 text-[#8191a7] hover:text-rose-600"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))
              ) : (
                <span className="self-center px-1 text-[12.5px] text-[#8493a8]">
                  Выберите подрядные организации
                </span>
              )}
            </div>
          </section>
        </div>
        <ModalFoot
          close={close}
          save={() =>
            save({
              ...tag,
              title,
              type,
              business,
              contractors: linked,
              active,
            })
          }
          label={tag.isNew ? "Добавить метку" : "Сохранить изменения"}
        />
      </motion.aside>
    </motion.div>
  );
}
function DropColumn({
  title,
  sub,
  icon,
  children,
  onDrop,
  small,
}: {
  title: string;
  sub: string;
  icon: ReactNode;
  children: ReactNode;
  onDrop: (e: DragEvent) => void;
  small?: boolean;
}) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className={`min-h-44 rounded-xl border border-dashed border-[#c7d8ef] bg-[#f8fbff] ${small ? "p-3" : "p-4"}`}
    >
      <div className="flex items-center gap-2 text-[#2f5d98]">
        {icon}
        <div>
          <p className="text-[13.5px] font-semibold">{title}</p>
          <p className="text-[12.5px] text-[#7a8ba3]">{sub}</p>
        </div>
      </div>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}
function TagCard({
  tag,
  drag,
}: {
  tag: TagItem;
  drag: (e: DragEvent, id: string) => void;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => drag(e, tag.id)}
      className="flex cursor-grab items-center gap-2 rounded-lg border border-[#dce6f2] bg-white p-2.5 shadow-sm active:cursor-grabbing"
    >
      <GripVertical size={14} className="text-[#a1b0c3]" />
      <span className={`size-2.5 rounded-full ${tag.color}`} />
      <div className="min-w-0">
        <p className="text-[12.5px] font-semibold">{tag.id}</p>
        <p className="font-mono text-[12.5px] text-[#7d8da4]">{tag.uid}</p>
      </div>
    </div>
  );
}
function EmployeePanel({
  employee,
  close,
}: {
  employee: Employee;
  close: () => void;
}) {
  const [tab, setTab] = useState<"profile" | "history">("profile");
  const [object, setObject] = useState("Все объекты");
  const [period, setPeriod] = useState("За всё время");
  useOverlayLock(close);
  const history = [
    {
      object: "Логистический центр «Запад»",
      address: "г. Москва, ул. Рябиновая, 22",
      events: [
        ["Сегодня, 14 мая", "08:42", "Вход", "0"],
        ["Вчера, 13 мая", "18:17", "Выход", "1"],
        ["Вчера, 13 мая", "08:35", "Вход", "1"],
      ],
    },
    {
      object: "БЦ «Орион»",
      address: "г. Москва, Ленинградский пр-т, 80",
      events: [
        ["12 мая 2026", "17:56", "Выход", "2"],
        ["12 мая 2026", "09:03", "Вход", "2"],
        ["8 апреля 2026", "09:18", "Вход", "36"],
      ],
    },
  ];
  const limit =
    period === "Последние 7 дней"
      ? 7
      : period === "Последние 30 дней"
        ? 30
        : Infinity;
  const visibleHistory = history
    .filter((group) => object === "Все объекты" || group.object === object)
    .map((group) => ({
      ...group,
      events: group.events
        .filter((event) => Number(event[3]) <= limit)
        .map((event) => event.slice(0, 3)),
    }))
    .filter((group) => group.events.length);
  return (
    <motion.div
      className="overlay-layer fixed inset-0 z-40 isolate"
      initial="closed"
      animate="open"
      exit="closed"
    >
      <motion.button
        aria-label="Закрыть карточку сотрудника"
        onClick={close}
        className="absolute inset-0 z-0 bg-[#18253b]/15"
        variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      />
      <motion.aside
        aria-label="Карточка сотрудника"
        aria-modal="true"
        role="dialog"
        className="overlay-drawer-panel fixed bottom-0 right-0 top-0 z-10 w-[540px] border-l border-[#dfe6ef] bg-white shadow-[-14px_0_36px_rgba(34,51,84,.14)]"
        variants={{ closed: { x: "100%" }, open: { x: 0 } }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: "transform" }}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-[#e4eaf2] px-6">
          <div>
            <p className="text-[17px] font-semibold">Карточка сотрудника</p>
            <p className="mt-0.5 text-[12.5px] text-[#7a8ca5]">
              Данные сотрудника
            </p>
          </div>
          <button
            aria-label="Закрыть карточку сотрудника"
            onClick={close}
            className="grid size-9 place-items-center rounded-xl border border-[#e0e7f0] text-[#61748f]"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex gap-5 border-b border-[#e5ebf3] px-6">
          <button
            onClick={() => setTab("profile")}
            className={`border-b-2 py-3 text-[13.5px] font-semibold ${tab === "profile" ? "border-[#2563eb] text-[#2563eb]" : "border-transparent text-[#71839e]"}`}
          >
            Основная информация
          </button>
          <button
            onClick={() => setTab("history")}
            className={`border-b-2 py-3 text-[13.5px] font-semibold ${tab === "history" ? "border-[#2563eb] text-[#2563eb]" : "border-transparent text-[#71839e]"}`}
          >
            История посещений
          </button>
        </div>
        {tab === "profile" ? (
          <div className="overlay-scroll-region h-[calc(100%-132px)] overflow-y-auto px-6 py-6">
            <div className="flex items-center gap-4">
              <div className="grid size-16 place-items-center rounded-2xl bg-[#e9f2ff] text-base font-bold text-[#2563eb]">
                {employee.initials}
              </div>
              <div>
                <h2 className="text-[21.5px] font-bold">{employee.name}</h2>
                <p className="mt-1 text-[15px] text-[#687a95]">
                  {employee.role}
                </p>
                <span
                  className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-[12.5px] font-semibold ${statusStyle[employee.status]}`}
                >
                  {employee.status}
                </span>
              </div>
            </div>
            <Info
              title="Основная информация"
              rows={[
                ["Дата рождения", "12.04.1989"],
                ["Дата добавления", employee.added],
              ]}
            />
            <Info
              title="Работа"
              rows={[
                ["Подрядчик", employee.contractor],
                ["Должность", employee.role],
                ["Подразделение", employee.dept],
              ]}
            />
            <Info
              title="Контакты"
              rows={[
                ["Телефон", employee.phone],
                ["Email", employee.email],
              ]}
            />
          </div>
        ) : (
          <div className="overlay-scroll-region h-[calc(100%-132px)] overflow-y-auto px-6 py-5">
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={object}
                onChange={setObject}
                options={[
                  "Все объекты",
                  ...history.map((group) => group.object),
                ]}
              />
              <Select
                value={period}
                onChange={setPeriod}
                options={[
                  "За всё время",
                  "Последние 7 дней",
                  "Последние 30 дней",
                ]}
              />
            </div>
            <div className="mt-5">
              {visibleHistory.length ? (
                visibleHistory.map((group) => (
                  <HistoryGroup
                    key={group.object}
                    object={group.object}
                    address={group.address}
                    events={group.events}
                  />
                ))
              ) : (
                <div className="empty-filter-state">
                  <Clock3 size={20} />
                  <strong>Посещения не найдены</strong>
                  <span>Измените объект или период</span>
                  <button
                    onClick={() => {
                      setObject("Все объекты");
                      setPeriod("За всё время");
                    }}
                  >
                    Сбросить фильтры
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.aside>
    </motion.div>
  );
}
function HistoryGroup({
  object,
  address,
  events,
}: {
  object: string;
  address: string;
  events: string[][];
}) {
  return (
    <div className="relative pb-6 pl-7 before:absolute before:bottom-0 before:left-[7px] before:top-3 before:w-px before:bg-[#dbe5f2]">
      <div className="absolute left-0 top-1 size-[15px] rounded-full border-4 border-[#dcebff] bg-[#2563eb]" />
      <div className="rounded-xl border border-[#e0e8f2] bg-white">
        <div className="border-b border-[#e8edf4] px-4 py-3">
          <p className="text-[15px] font-semibold">{object}</p>
          <p className="mt-1 text-[12.5px] text-[#7a8ba3]">{address}</p>
        </div>
        {events.map(([date, time, type], i) => (
          <div
            key={`${date}${time}`}
            className={`flex items-center gap-3 px-4 py-3 ${i ? "border-t border-[#eef2f6]" : ""}`}
          >
            <span className="grid size-7 place-items-center rounded-lg bg-[#edf5ff] text-[#2563eb]">
              {type === "Вход" ? (
                <DoorOpen size={14} />
              ) : (
                <DoorClosed size={14} />
              )}
            </span>
            <div className="flex-1">
              <p className="text-[13.5px] font-medium">{type}</p>
              <p className="text-[12.5px] text-[#8493a8]">{date}</p>
            </div>
            <span className="font-mono text-[13.5px] font-semibold text-[#435775]">
              {time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
function Info({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <section className="mt-7">
      <h3 className="mb-3 text-[12.5px] font-semibold uppercase tracking-[.08em] text-[#71829c]">
        {title}
      </h3>
      <div className="overflow-hidden rounded-xl border border-[#e2e8f1]">
        {rows.map(([a, b], i) => (
          <div
            key={a}
            className={`flex justify-between gap-4 px-4 py-3 text-[13.5px] ${i ? "border-t border-[#e8edf4]" : ""}`}
          >
            <span className="text-[#7889a2]">{a}</span>
            <span className="text-right font-medium text-[#2d3d57]">{b}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
function ModalHead({
  title,
  sub,
  close,
}: {
  title: string;
  sub: string;
  close: () => void;
}) {
  return (
    <div className="flex items-start justify-between border-b border-[#e4eaf2] px-7 py-6">
      <div>
        <h2 className="text-[23px] font-bold">{title}</h2>
        <p className="mt-1 text-[15px] text-[#74849d]">{sub}</p>
      </div>
      <button
        aria-label="Закрыть окно"
        onClick={close}
        className="grid size-9 place-items-center rounded-xl border border-[#e0e7f0] text-[#60738f]"
      >
        <X size={18} />
      </button>
    </div>
  );
}
function ModalFoot({
  close,
  save,
  label,
}: {
  close: () => void;
  save: () => void;
  label: string;
}) {
  return (
    <div className="flex justify-end gap-3 border-t border-[#e4eaf2] px-7 py-5">
      <button
        onClick={close}
        className="h-10 rounded-lg border border-[#dce5ef] px-5 text-[15px] font-medium text-[#52657f]"
      >
        Отмена
      </button>
      <button
        onClick={save}
        className="h-10 rounded-lg bg-[#2563eb] px-5 text-[15px] font-semibold text-white"
      >
        {label}
      </button>
    </div>
  );
}
function Confirm({
  title,
  text,
  close,
  action,
}: {
  title: string;
  text: string;
  close: () => void;
  action: () => void;
}) {
  return (
    <motion.div
      className="overlay-modal-layer fixed inset-0 z-[60] grid place-items-center p-5"
      initial="closed"
      animate="open"
      exit="closed"
    >
      <motion.div
        className="absolute inset-0 bg-[#15233a]/30"
        variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
      <motion.div
        aria-label={title}
        aria-modal="true"
        role="alertdialog"
        className="relative w-[450px] rounded-2xl bg-white p-7 shadow-2xl"
        variants={{
          closed: { opacity: 0, y: 16, scale: 0.97 },
          open: { opacity: 1, y: 0, scale: 1 },
        }}
        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="grid size-11 place-items-center rounded-xl bg-rose-50 text-rose-600">
          <Trash2 size={21} />
        </div>
        <h2 className="mt-5 text-[23px] font-bold">{title}</h2>
        <p className="mt-2 text-[15px] leading-6 text-[#667892]">{text}</p>
        <div className="mt-7 flex justify-end gap-3">
          <button
            onClick={close}
            className="h-10 rounded-lg border border-[#dce5ef] px-4 text-[15px] font-medium"
          >
            Отмена
          </button>
          <button
            onClick={action}
            className="h-10 rounded-lg bg-rose-600 px-4 text-[15px] font-semibold text-white"
          >
            Удалить
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
