import {
  Fragment,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type DragEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  ChevronLeft,
  ClipboardList,
  Contact,
  DoorClosed,
  DoorOpen,
  FileDown,
  Home,
  LayoutDashboard,
  MapPin,
  Mail,
  Menu,
  Pencil,
  Phone,
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
  Activity,
  ArrowUpRight,
  Clock3,
  Radio,
  UserCheck,
  BarChart3,
  FileCheck2,
  TrendingUp,
  Wrench,
  ScrollText,
  Check,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  ExportPage,
  EXPORT_EVENTS,
  PRESENCE_RECORDS,
  formatDuration,
  roomForRecord,
  type PresenceRecord,
} from "./OperationsPages";
import {
  AdminUsersSettings,
  createInitialAdminUsers,
  type AdminUser,
} from "./UserSettings";
import { ContractorPresenceMatrix } from "./ContractorPresenceMatrix";
import { DataPagination, usePaginatedItems } from "./DataPagination";
import { DateRangePicker } from "./DateRangePicker";
import { TimePicker } from "./TimePicker";
import { OBJECT_CATALOG } from "./objectCatalog";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Line,
  LineChart,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import alphaStroyLogo from "../assets/contractors/alpha-stroy.png";
import cityCleaningLogo from "../assets/contractors/citycleaning.png";
import energyControlLogo from "../assets/contractors/energocontrol.png";
import montazhProLogo from "../assets/contractors/montazhpro.png";
import stroyGroupLogo from "../assets/contractors/stroygroup.png";
import techServiceLogo from "../assets/contractors/techservice.png";

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
  access?: string;
  contacts?: ContactPerson[];
  contractors?: string[];
};
type AppPage =
  | "home"
  | "journal"
  | "export"
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
  "ООО «ЭнергоКонтроль»",
  "ООО «СитиКлининг»",
];
const contractorLogos: Record<string, string> = {
  [contractors[0]]: alphaStroyLogo,
  [contractors[1]]: techServiceLogo,
  [contractors[2]]: montazhProLogo,
  [contractors[3]]: stroyGroupLogo,
  [contractors[4]]: energyControlLogo,
  [contractors[5]]: cityCleaningLogo,
};
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
  {
    name: "Павел Егоров",
    initials: "ПЕ",
    role: "Инженер-энергетик",
    dept: "Технический отдел",
    phone: "+7 916 842-17-39",
    email: "p.egorov@energocontrol.ru",
    added: "06.03.2026",
    status: "Активен",
    contractor: contractors[4],
  },
  {
    name: "Анна Миронова",
    initials: "АМ",
    role: "Менеджер объекта",
    dept: "Администрация",
    phone: "+7 903 775-28-14",
    email: "a.mironova@citycleaning.ru",
    added: "02.03.2026",
    status: "Активен",
    contractor: contractors[5],
  },
];
const objectsInitial: ObjectItem[] = OBJECT_CATALOG.map((object, index) => ({
  ...object,
  status: "Активен",
  contractors: [
    contractors[index % contractors.length],
    contractors[(index + 1) % contractors.length],
    contractors[(index + 3) % contractors.length],
  ],
}));

type ContactPerson = {
  name: string;
  role: string;
  phone: string;
  email?: string;
};

type ContractorDetails = {
  description: string;
  phone: string;
  email: string;
  contactsByObject: Record<string, ContactPerson>;
};

const objectDetails: Record<
  string,
  { access: string; contacts: ContactPerson[]; rooms: string[] }
> = {
  "OBJ-001": {
    access: "Пост охраны, вход 1",
    contacts: [
      {
        name: "Ирина Лебедева",
        role: "Управляющая объектом",
        phone: "+7 495 120-41-18",
        email: "i.lebedeva@zapad.ru",
      },
      {
        name: "Михаил Серов",
        role: "Начальник смены охраны",
        phone: "+7 926 320-18-04",
      },
      {
        name: "Алексей Воронов",
        role: "Заместитель управляющего",
        phone: "+7 916 540-27-11",
        email: "a.voronov@zapad.ru",
      },
      {
        name: "Наталья Орлова",
        role: "Администратор объекта",
        phone: "+7 985 204-16-72",
        email: "n.orlova@zapad.ru",
      },
      {
        name: "Денис Макаров",
        role: "Руководитель эксплуатации",
        phone: "+7 903 118-42-65",
        email: "d.makarov@zapad.ru",
      },
      {
        name: "Елена Громова",
        role: "Специалист по пропускам",
        phone: "+7 925 330-91-08",
        email: "e.gromova@zapad.ru",
      },
      {
        name: "Роман Киселёв",
        role: "Главный инженер",
        phone: "+7 977 612-44-30",
        email: "r.kiselev@zapad.ru",
      },
      {
        name: "Ольга Тихонова",
        role: "Координатор подрядчиков",
        phone: "+7 968 705-12-19",
        email: "o.tikhonova@zapad.ru",
      },
      {
        name: "Павел Назаров",
        role: "Начальник складского комплекса",
        phone: "+7 915 882-37-46",
        email: "p.nazarov@zapad.ru",
      },
      {
        name: "Марина Федотова",
        role: "Специалист по охране труда",
        phone: "+7 926 174-60-53",
        email: "m.fedotova@zapad.ru",
      },
      {
        name: "Антон Беляев",
        role: "Ответственный за пожарную безопасность",
        phone: "+7 999 241-85-70",
        email: "a.belyaev@zapad.ru",
      },
      {
        name: "Светлана Жукова",
        role: "Дежурный администратор",
        phone: "+7 901 628-34-92",
        email: "s.zhukova@zapad.ru",
      },
    ],
    rooms: [
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
  },
  "OBJ-002": {
    access: "Стойка ресепшен, центральный вход",
    contacts: [
      {
        name: "Олег Савельев",
        role: "Управляющий БЦ",
        phone: "+7 495 221-04-82",
        email: "o.saveliev@orion.ru",
      },
    ],
    rooms: [
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
  },
  "OBJ-003": {
    access: "КПП со стороны Коммунального проезда",
    contacts: [
      {
        name: "Андрей Фомин",
        role: "Заведующий складом",
        phone: "+7 985 441-16-03",
      },
    ],
    rooms: [
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
  },
  "OBJ-004": {
    access: "Бюро пропусков, проходная № 2",
    contacts: [
      {
        name: "Татьяна Волкова",
        role: "Руководитель площадки",
        phone: "+7 495 772-38-10",
        email: "t.volkova@sever.ru",
      },
    ],
    rooms: [
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
  },
};

const contractorDetails: Record<string, ContractorDetails> = {
  [contractors[0]]: {
    description: "Строительные и отделочные работы, ремонт ворот и ограждений.",
    phone: "+7 495 410-20-18",
    email: "office@alfastroi.ru",
    contactsByObject: {
      "OBJ-001": {
        name: "Сергей Иванов",
        role: "Прораб",
        phone: "+7 985 120-48-11",
        email: "s.ivanov@alfastroi.ru",
      },
      "OBJ-003": {
        name: "Александр Петров",
        role: "Инженер ПТО",
        phone: "+7 926 418-26-54",
        email: "a.petrov@alfastroi.ru",
      },
      "OBJ-004": {
        name: "Сергей Иванов",
        role: "Прораб",
        phone: "+7 985 120-48-11",
      },
    },
  },
  [contractors[1]]: {
    description: "Слаботочные системы: шлагбаумы, СКУД, видеонаблюдение и связь.",
    phone: "+7 495 771-09-22",
    email: "service@techservice.ru",
    contactsByObject: {
      "OBJ-001": {
        name: "Владимир Крылов",
        role: "Главный инженер",
        phone: "+7 977 333-68-20",
        email: "v.krylov@techservice.ru",
      },
      "OBJ-002": {
        name: "Илья Воронов",
        role: "Сервисный инженер",
        phone: "+7 985 318-52-09",
        email: "i.voronov@techservice.ru",
      },
    },
  },
  [contractors[2]]: {
    description: "Монтаж металлоконструкций, инженерных сетей и оборудования.",
    phone: "+7 495 641-54-30",
    email: "office@montazhpro.ru",
    contactsByObject: {
      "OBJ-002": {
        name: "Максим Волков",
        role: "Начальник участка",
        phone: "+7 903 208-41-65",
      },
      "OBJ-004": {
        name: "Максим Волков",
        role: "Начальник участка",
        phone: "+7 903 208-41-65",
      },
    },
  },
  [contractors[3]]: {
    description: "Эксплуатация зданий, аварийные работы и техническое обслуживание.",
    phone: "+7 495 390-82-11",
    email: "dispatch@stroygroup.ru",
    contactsByObject: {
      "OBJ-001": {
        name: "Виктор Смирнов",
        role: "Руководитель проекта",
        phone: "+7 916 201-73-84",
      },
      "OBJ-004": {
        name: "Антон Зуев",
        role: "Прораб",
        phone: "+7 985 412-86-05",
      },
    },
  },
  [contractors[4]]: {
    description: "Обслуживание электросетей, щитового оборудования и резервного питания.",
    phone: "+7 495 669-42-18",
    email: "service@energocontrol.ru",
    contactsByObject: {
      "OBJ-001": {
        name: "Павел Егоров",
        role: "Инженер-энергетик",
        phone: "+7 916 842-17-39",
        email: "p.egorov@energocontrol.ru",
      },
    },
  },
  [contractors[5]]: {
    description: "Комплексная уборка помещений, территории и зон погрузки.",
    phone: "+7 495 118-76-32",
    email: "office@citycleaning.ru",
    contactsByObject: {
      "OBJ-001": {
        name: "Анна Миронова",
        role: "Менеджер объекта",
        phone: "+7 903 775-28-14",
        email: "a.mironova@citycleaning.ru",
      },
    },
  },
};
const UNASSIGNED_BUSINESS = "Без объекта";
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
  room?: string;
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
  const metricIndex = contractorIndex % contractorMetricSets.length;
  const metrics = contractorMetricSets[metricIndex];
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
      time: ["08:12", "08:27", "07:54", "08:41"][metricIndex],
      event: "Вход",
      objectOffset: 0,
      details: "Вход на объект зафиксирован NFC-меткой",
      status: "Успешно",
    },
    {
      date: "Сегодня",
      time: ["09:05", "09:18", "08:46", "09:22"][metricIndex],
      event: "Вход",
      objectOffset: 1,
      details: "Вход на объект зафиксирован NFC-меткой",
      status: "Успешно",
    },
    {
      date: "Сегодня",
      time: ["12:36", "12:18", "13:04", "12:51"][metricIndex],
      event: "Отчёт",
      objectOffset: 0,
      details: "Ежедневный отчёт по выполненным работам отправлен",
      status: "Принято",
    },
    {
      date: "Сегодня",
      time: ["17:48", "18:02", "17:36", "17:55"][metricIndex],
      event: "Выход",
      objectOffset: 1,
      details: "Выход с объекта зафиксирован NFC-меткой",
      status: "Успешно",
    },
    {
      date: "Вчера",
      time: ["18:21", "17:49", "18:14", "17:38"][metricIndex],
      event: "Выход",
      objectOffset: 0,
      details: "Выход с объекта зафиксирован NFC-меткой",
      status: "Успешно",
    },
    {
      date: "Вчера",
      time: ["16:40", "15:58", "16:22", "16:08"][metricIndex],
      event: "Отчёт",
      objectOffset: 2,
      details: "Отчёт по технике безопасности заполнен и отправлен",
      status: "На проверке",
    },
    {
      date: "Вчера",
      time: ["08:34", "08:11", "08:29", "07:58"][metricIndex],
      event: "Вход",
      objectOffset: 2,
      details: "Вход на объект зафиксирован NFC-меткой",
      status: "Успешно",
    },
    {
      date: "26 июля",
      time: ["17:16", "17:42", "18:06", "17:27"][metricIndex],
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
      const objectItem =
        objectsInitial[
          (contractorIndex + template.objectOffset) % objectsInitial.length
        ];
      const rooms = objectDetails[objectItem.code]?.rooms ?? ["Территория"];
      return {
        ...template,
        id: `${contractorIndex}-${index}`,
        employee: employee.name,
        initials: employee.initials,
        object: objectItem.name,
        room: rooms[index % rooms.length],
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
  const metricIndex = objectIndex % objectMetricSets.length;
  const metrics = objectMetricSets[metricIndex];
  const assignedContractors =
    object.contractors ?? metrics.contractorIndexes.map((index) => contractors[index]);
  const employees = staff.filter((employee) =>
    assignedContractors.includes(employee.contractor),
  );
  const eventTemplates: Array<
    Omit<LogRecord, "id" | "employee" | "initials" | "object">
  > = [
    {
      date: "Сегодня",
      time: ["07:48", "08:03", "08:26", "07:55"][metricIndex],
      event: "Вход",
      details: "Вход на объект зафиксирован NFC-меткой",
      status: "Успешно",
    },
    {
      date: "Сегодня",
      time: ["08:12", "08:31", "09:04", "08:18"][metricIndex],
      event: "Вход",
      details: "Сотрудник допущен на территорию объекта",
      status: "Успешно",
    },
    {
      date: "Сегодня",
      time: ["10:36", "11:08", "12:14", "10:51"][metricIndex],
      event: "Отчёт",
      details: "Ежедневный отчёт по объекту отправлен",
      status: "Принято",
    },
    {
      date: "Сегодня",
      time: ["13:22", "14:17", "15:06", "13:48"][metricIndex],
      event: "Вход",
      details: "Повторный вход после перерыва",
      status: "Успешно",
    },
    {
      date: "Сегодня",
      time: ["17:42", "18:02", "16:38", "17:51"][metricIndex],
      event: "Выход",
      details: "Выход с объекта зафиксирован NFC-меткой",
      status: "Успешно",
    },
    {
      date: "Вчера",
      time: ["18:21", "17:49", "16:14", "18:08"][metricIndex],
      event: "Выход",
      details: "Рабочая смена на объекте завершена",
      status: "Успешно",
    },
    {
      date: "Вчера",
      time: ["15:40", "16:18", "14:22", "16:35"][metricIndex],
      event: "Отчёт",
      details: "Отчёт по технике безопасности отправлен",
      status: "На проверке",
    },
    {
      date: "Вчера",
      time: ["08:04", "08:19", "09:11", "07:58"][metricIndex],
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
      room:
        (objectDetails[object.code]?.rooms ?? ["Территория"])[
          index % (objectDetails[object.code]?.rooms.length ?? 1)
        ],
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
    "Метка",
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
      record.room ?? "",
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
  readOnly = false,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  type?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13.5px] font-medium text-[#40516d]">
        {label}
      </span>
      <input
        type={type}
        readOnly={readOnly}
        {...(onChange
          ? {
              value: value ?? "",
              onChange: (event: ChangeEvent<HTMLInputElement>) =>
                onChange(event.target.value),
            }
          : { defaultValue: value })}
        placeholder={placeholder}
        className={`h-10 w-full rounded-lg border border-[#dce5f0] px-3 text-[15px] text-[#16223a] outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-blue-100 ${readOnly ? "bg-[#f5f8fc] text-[#526783]" : "bg-white"}`}
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
      aria-label={label}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={`app-nav-item flex h-[52px] w-full items-center gap-3 rounded-2xl px-3.5 text-left transition ${active ? "is-active border border-[#cfe2ff] bg-[#f1f7ff] text-[#17223a] shadow-[0_0_0_1px_rgba(219,234,254,.45)]" : "text-[#50617c] hover:bg-[#f6f9fd]"} ${compact ? "is-compact justify-center px-0" : ""}`}
    >
      <span
        className={`app-nav-icon grid size-9 shrink-0 place-items-center rounded-xl ${active ? "bg-[#2563eb] text-white" : "border border-[#e0e8f2] text-[#667b99]"}`}
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

let activeOverlayLocks = 0;
let overlayInitialStyles: {
  bodyOverscroll: string;
  bodyPaddingRight: string;
  rootScrollBehavior: string;
} | null = null;

function useOverlayLock(close: () => void) {
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const scrollbarGap = Math.max(0, window.innerWidth - root.clientWidth);
    const isFirstOverlay = activeOverlayLocks === 0;
    if (isFirstOverlay) {
      overlayInitialStyles = {
        bodyOverscroll: body.style.overscrollBehavior,
        bodyPaddingRight: body.style.paddingRight,
        rootScrollBehavior: root.style.scrollBehavior,
      };
    }
    activeOverlayLocks += 1;
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
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key === "Tab") {
        const panels = document.querySelectorAll<HTMLElement>(
          '.overlay-drawer-panel[role="dialog"]',
        );
        const panel = panels[panels.length - 1];
        if (!panel) return;
        const focusable = Array.from(
          panel.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
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

    if (isFirstOverlay) {
      root.classList.add("overlay-open");
      root.style.scrollBehavior = "auto";
      body.style.overscrollBehavior = "none";
      if (scrollbarGap) body.style.paddingRight = `${scrollbarGap}px`;
    }
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
    const focusFrame = window.requestAnimationFrame(() => {
      const panels = document.querySelectorAll<HTMLElement>(
        '.overlay-drawer-panel[role="dialog"]',
      );
      const panel = panels[panels.length - 1];
      if (panel && !panel.contains(document.activeElement)) {
        panel
          .querySelector<HTMLElement>(
            '[autofocus], button:not([disabled]), a[href], input:not([disabled])',
          )
          ?.focus();
      }
    });

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("scroll", keepPagePosition);
      document.removeEventListener("wheel", stopBackgroundWheel, true);
      document.removeEventListener("touchmove", stopBackgroundTouch, true);
      activeOverlayLocks = Math.max(0, activeOverlayLocks - 1);
      if (activeOverlayLocks === 0) {
        root.classList.remove("overlay-open");
        root.style.scrollBehavior =
          overlayInitialStyles?.rootScrollBehavior || "";
        body.style.overscrollBehavior =
          overlayInitialStyles?.bodyOverscroll || "";
        body.style.paddingRight = overlayInitialStyles?.bodyPaddingRight || "";
        overlayInitialStyles = null;
      }
      window.requestAnimationFrame(() => previousFocus?.focus());
    };
  }, []);
}

export default function App() {
  const [page, setPage] = useState<AppPage>("home");
  const [managedObjects, setManagedObjects] = useState<ObjectItem[]>(objectsInitial);
  const sessionRole: "ukp" | "nsr" = "ukp";
  const [previewRole, setPreviewRole] = useState<"nsr" | null>(null);
  const userRole = previewRole ?? sessionRole;
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() =>
    createInitialAdminUsers(objectsInitial.map((item) => item.name)),
  );
  const [sidebar, setSidebar] = useState(true);
  const [selectedContractor, setSelectedContractor] = useState(contractors[0]);
  const [selectedObject, setSelectedObject] = useState(objectsInitial[0]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Все статусы");
  const [detail, setDetail] = useState<Employee | null>(null);
  const [stickyDetailTitle, setStickyDetailTitle] = useState("");
  const [notice, setNotice] = useState("");
  const updateManagedObjects = (nextObjects: ObjectItem[]) => {
    const previousByName = new Map(
      managedObjects.map((object) => [object.name, object.code]),
    );
    const nextByCode = new Map(
      nextObjects.map((object) => [object.code, object.name]),
    );
    setAdminUsers((current) =>
      current.map((user) => ({
        ...user,
        objects:
          user.accessRole === "УКП"
            ? nextObjects.map((object) => object.name)
            : user.objects.flatMap((name) => {
                const code = previousByName.get(name);
                const nextName = code ? nextByCode.get(code) : undefined;
                return nextName ? [nextName] : [];
              }),
      })),
    );
    setManagedObjects(nextObjects);
  };
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
    setStickyDetailTitle("");
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
          e.name
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [selectedContractor, query, status],
  );
  const nsrObjectNames = useMemo(
    () =>
      adminUsers.find((user) => user.id === "admin-mikhail-volkov")?.objects ?? [],
    [adminUsers],
  );
  const scopedObjects = useMemo(
    () =>
      userRole === "ukp"
        ? managedObjects
        : managedObjects.filter((item) => nsrObjectNames.includes(item.name)),
    [managedObjects, nsrObjectNames, userRole],
  );
  const scopedObjectNames = useMemo(
    () => scopedObjects.map((item) => item.name),
    [scopedObjects],
  );
  const scopedContractors = useMemo(
    () =>
      Array.from(
        new Set(
          scopedObjects.flatMap((item) => getObjectContractors(item)),
        ),
      ),
    [scopedObjects],
  );
  useEffect(() => {
    if (
      scopedObjects.length &&
      !scopedObjects.some((item) => item.code === selectedObject.code)
    ) {
      setSelectedObject(scopedObjects[0]);
    }
    if (scopedContractors.length && !scopedContractors.includes(selectedContractor)) {
      setSelectedContractor(scopedContractors[0]);
    }
    if (!scopedObjects.length && page === "object") setPage("objects");
    if (!scopedContractors.length && page === "contractor") setPage("contractors");
  }, [
    page,
    scopedObjects,
    scopedContractors,
    selectedObject.code,
    selectedContractor,
  ]);
  const selectedObjectInScope = scopedObjects.some(
    (item) => item.code === selectedObject.code,
  );
  const selectedContractorInScope = scopedContractors.includes(selectedContractor);
  const currentTitle =
    page === "home"
      ? "Главная"
      : page === "journal"
        ? "Журнал"
      : page === "export"
        ? "Экспорт"
      : page === "objects" || page === "object"
        ? "Объекты"
      : page === "tags"
        ? "Метки"
        : page === "settings"
          ? "Настройки"
          : "Подрядчики";
  return (
    <div className="app-shell min-h-screen bg-[#f5f7fb] text-[#101b31]">
      <aside
        className={`app-sidebar fixed bottom-0 left-0 top-0 z-30 border-r border-[#e1e8f1] bg-white px-4 py-4 transition-all duration-300 ${sidebar ? "is-open w-[268px]" : "w-[82px]"}`}
      >
        <div className="flex h-full flex-col">
          <div className={`brand-lockup ${sidebar ? "" : "is-compact"}`}>
            <div
              className="brand-mark"
              style={{ background: "transparent", boxShadow: "none" }}
            >
              <img
                src={`${import.meta.env.BASE_URL}brand-logo.svg`}
                alt=""
                aria-hidden="true"
              />
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
              icon={<MapPin size={19} />}
              label="Объекты"
              active={page === "objects" || page === "object"}
              compact={!sidebar}
              onClick={() => navigate("objects")}
            />
            <Nav
              icon={<BriefcaseBusiness size={19} />}
              label="Подрядчики"
              active={page === "contractors" || page === "contractor"}
              compact={!sidebar}
              onClick={() => navigate("contractors")}
            />
            <Nav
              icon={<ClipboardList size={19} />}
              label="Журнал"
              active={page === "journal"}
              compact={!sidebar}
              onClick={() => navigate("journal")}
            />
            <Nav
              icon={<FileDown size={19} />}
              label="Экспорт"
              active={page === "export"}
              compact={!sidebar}
              onClick={() => navigate("export")}
            />
            {userRole === "ukp" && (
              <>
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
              </>
            )}
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
              <div
                className="profile-avatar grid size-9 place-items-center rounded-xl text-white"
                aria-hidden="true"
              >
                {userRole === "ukp" ? "АМ" : "МВ"}
              </div>
              {sidebar && (
                <div>
                  <p className="text-[13.5px] font-semibold">
                    {userRole === "ukp" ? "Анна Морозова" : "Михаил Волков"}
                  </p>
                  <p className="text-[12.5px] text-[#74839b]">
                    {userRole === "ukp" ? "УКП" : "Начальник смены"}
                  </p>
                </div>
              )}
            </div>
            {sidebar && sessionRole === "ukp" && (
              <div className="role-preview">
                <small>Предпросмотр роли</small>
                <div className="role-switch" role="group" aria-label="Предпросмотр интерфейса">
                <button
                  className={userRole === "ukp" ? "is-active" : ""}
                  onClick={() => setPreviewRole(null)}
                >
                  УКП
                </button>
                <button
                  className={userRole === "nsr" ? "is-active" : ""}
                  onClick={() => {
                    setPreviewRole("nsr");
                    if (page === "settings" || page === "tags") navigate("home");
                  }}
                >
                  НСР
                </button>
                </div>
              </div>
            )}
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
        <header className={`app-header sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[#e1e8f1] bg-white/90 px-10 backdrop-blur-xl ${stickyDetailTitle ? "has-detail-title" : ""}`}>
          <div className="app-header-title">
            <small>{userRole === "ukp" ? "Все объекты" : "Объекты НСР"}</small>
            <strong>{stickyDetailTitle || currentTitle}</strong>
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
        <div className="page-stage">
            {page === "home" ? (
              <HomePage
                navigate={navigate}
                objects={scopedObjects}
                openObject={(object) => {
                  setSelectedObject(object);
                  navigate("object");
                }}
              />
            ) : page === "journal" ? (
              <ExportPage
                title="Журнал"
                exportEnabled={false}
                allowedObjectNames={scopedObjectNames}
                onOpenEmployee={(name) => {
                  const employee = staff.find((item) => item.name === name);
                  if (employee) setDetail(employee);
                }}
              />
            ) : page === "export" ? (
              <ExportPage
                title="Экспорт данных"
                allowedObjectNames={scopedObjectNames}
                onOpenEmployee={(name) => {
                  const employee = staff.find((item) => item.name === name);
                  if (employee) setDetail(employee);
                }}
              />
            ) : page === "settings" ? (
              <SettingsPage
                toast={toast}
                objects={managedObjects}
                onObjectsChange={updateManagedObjects}
                users={adminUsers}
                onUsersChange={setAdminUsers}
              />
            ) : page === "tags" ? (
              <TagsPage toast={toast} />
            ) : page === "objects" ? (
              <ObjectsPage
                objects={scopedObjects}
                open={(object) => {
                  setSelectedObject(object);
                  navigate("object");
                }}
              />
            ) : page === "object" && selectedObjectInScope ? (
              <ObjectDetailPage
                object={selectedObject}
                availableContractors={scopedContractors}
                openEmployee={setDetail}
                goObjects={() => navigate("objects")}
                onStickyTitleChange={setStickyDetailTitle}
                openContractor={(contractor) => {
                  setSelectedContractor(contractor);
                  navigate("contractor");
                }}
              />
            ) : page === "contractors" ? (
              <ContractorsPage
                items={scopedContractors}
                objects={scopedObjects}
                open={(name) => {
                  setSelectedContractor(name);
                  navigate("contractor");
                }}
              />
            ) : page === "contractor" && selectedContractorInScope ? (
              <EmployeesPage
                page={page}
                selected={selectedContractor}
                allowedObjectNames={scopedObjectNames}
                rows={rows}
                query={query}
                setQuery={setQuery}
                status={status}
                setStatus={setStatus}
                open={setDetail}
                goContractors={() => navigate("contractors")}
                onStickyTitleChange={setStickyDetailTitle}
              />
            ) : page === "object" ? (
              <ObjectsPage
                objects={scopedObjects}
                open={(object) => {
                  setSelectedObject(object);
                  navigate("object");
                }}
              />
            ) : (
              <ContractorsPage
                items={scopedContractors}
                objects={scopedObjects}
                open={(name) => {
                  setSelectedContractor(name);
                  navigate("contractor");
                }}
              />
            )}
        </div>
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
  objects,
  openObject,
}: {
  navigate: (page: AppPage) => void;
  objects: ObjectItem[];
  openObject: (object: ObjectItem) => void;
}) {
  const scopedObjectItems = objects;
  const objectNames = objects.map((item) => item.name);
  const scopedProfiles = scopedObjectItems.map(getObjectProfile);
  const currentPresence = scopedObjectItems
    .flatMap(getObjectPresenceRecords)
    .filter((record) => !record.leftAt && objectNames.includes(record.object));
  const onSite = currentPresence.length;
  const contractorCount = new Set(
    scopedProfiles.flatMap((item) => item.contractors),
  ).size;
  const metrics = [
    {
      label: "Сейчас на объектах",
      value: String(onSite),
      change: "Выбрать объект",
      icon: <UserCheck size={20} />,
      tone: "blue",
      target: "objects" as AppPage,
    },
    {
      label: "Объекты",
      value: String(scopedObjectItems.length),
      change: "Контакты и подрядчики",
      icon: <MapPin size={20} />,
      tone: "green",
      target: "objects" as AppPage,
    },
    {
      label: "Подрядчики",
      value: String(contractorCount),
      change: "Ответственные и телефоны",
      icon: <Building2 size={20} />,
      tone: "violet",
      target: "contractors" as AppPage,
    },
  ];
  const activity = EXPORT_EVENTS.filter(
    (event) => event.type !== "Отчёт" && objectNames.includes(event.object),
  )
    .slice(0, 4)
    .map((event) => ({
      name: event.employee,
      place: event.object,
      time: new Date(event.occurredAt).toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: event.type,
      initials: event.employee
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join(""),
    }));
  return (
    <section className="dashboard-page px-10 py-8">
      <div className="page-intro">
        <div>
          <h1>Главная</h1>
        </div>
        <div className="date-chip">
          <Clock3 size={16} />
          <span>
            {new Intl.DateTimeFormat("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date())}
          </span>
        </div>
      </div>
      <div className="metric-grid">
        {metrics.map((metric, index) => (
          <motion.button
            key={metric.label}
            onClick={() => navigate(metric.target)}
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
                По объектам
              </span>
              <h2>Кто сейчас на месте</h2>
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
                  <strong>{onSite}</strong>
                  <span>на объектах</span>
                </div>
              </div>
            </div>
            <div className="site-bars">
              {scopedObjectItems.slice(0, 5).map((item, index) => {
                const count = currentPresence.filter(
                  (record) => record.object === item.name,
                ).length;
                const tones = ["blue", "violet", "green", "orange"];
                return (
                <button
                  type="button"
                  className="site-bar clickable-home-row"
                  key={item.code}
                  onClick={() => openObject(item)}
                >
                  <div>
                    <span>{item.name}</span>
                    <b>{count} чел.</b>
                  </div>
                  <div className="bar-track">
                    <motion.i
                      className={`bar-${tones[index % tones.length]}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, count * 24)}%` }}
                      transition={{
                        delay: 0.4,
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                  </div>
                </button>
              )})}
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
              <h2>Последние входы и выходы</h2>
            </div>
            <button onClick={() => navigate("journal")}>Журнал</button>
          </div>
          <div className="activity-list">
            {activity.filter((item) => objectNames.includes(item.place)).map((item, index) => (
              <motion.button
                type="button"
                onClick={() => navigate("journal")}
                key={item.name}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.38 + index * 0.05 }}
              >
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
              </motion.button>
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
  allowedObjectNames,
  rows,
  query,
  setQuery,
  status,
  setStatus,
  open,
  goContractors,
  onStickyTitleChange,
}: {
  page: string;
  selected: string;
  allowedObjectNames: string[];
  rows: Employee[];
  query: string;
  setQuery: (x: string) => void;
  status: string;
  setStatus: (x: string) => void;
  open: (x: Employee) => void;
  goContractors: () => void;
  onStickyTitleChange: (title: string) => void;
}) {
  const all = page === "employees";
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [mode, setMode] = useState<"employees" | "history">("employees");
  const [department, setDepartment] = useState("");
  const [roleQuery, setRoleQuery] = useState("");
  const [contactQuery, setContactQuery] = useState("");
  const [employeeResetIconTurns, setEmployeeResetIconTurns] = useState(0);
  const [contractorContactsOpen, setContractorContactsOpen] = useState(false);
  const [historyView, setHistoryView] = useState<"employees" | "objects">("employees");
  const departmentOptions = useMemo(
    () =>
      Array.from(
        new Set(
          staff
            .filter((employee) => employee.contractor === selected)
            .map((employee) => employee.dept),
        ),
      ).sort((first, second) => first.localeCompare(second, "ru-RU")),
    [selected],
  );
  useEffect(() => setContractorContactsOpen(false), [all, selected]);
  useEffect(() => {
    if (all) {
      onStickyTitleChange("");
      return;
    }
    const title = titleRef.current;
    if (!title) return;
    const observer = new IntersectionObserver(
      ([entry]) => onStickyTitleChange(entry.isIntersecting ? "" : selected),
      { rootMargin: "-76px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(title);
    return () => {
      observer.disconnect();
      onStickyTitleChange("");
    };
  }, [all, onStickyTitleChange, selected]);
  const scopedPresenceRecords = useMemo(
    () =>
      objectsInitial
        .filter((object) => allowedObjectNames.includes(object.name))
        .flatMap(getObjectPresenceRecords),
    [allowedObjectNames],
  );
  const filteredRows = useMemo(
    () =>
      rows.filter((employee) => {
        const worksInScope = scopedPresenceRecords.some(
          (record) =>
            record.employee === employee.name &&
            allowedObjectNames.includes(record.object),
        );
        return (
          worksInScope &&
          employee.dept.toLocaleLowerCase("ru-RU").includes(department.trim().toLocaleLowerCase("ru-RU")) &&
          employee.role.toLocaleLowerCase("ru-RU").includes(roleQuery.trim().toLocaleLowerCase("ru-RU")) &&
          `${employee.phone} ${employee.email}`
            .toLocaleLowerCase("ru-RU")
            .includes(contactQuery.trim().toLocaleLowerCase("ru-RU"))
        );
      }),
    [allowedObjectNames, contactQuery, department, roleQuery, rows, scopedPresenceRecords],
  );
  const resetFilters = () => {
    setQuery("");
    setRoleQuery("");
    setDepartment("");
    setContactQuery("");
    setStatus("Все статусы");
    setEmployeeResetIconTurns((turns) => turns + 1);
  };
  return (
    <section className={all ? "px-10 py-8" : "contractor-detail-page px-10 py-8"}>
      {all ? (
        <div className="mb-7 flex items-start justify-between">
          <div>
            <p className="mb-1 text-[13.5px] text-[#7b8ba3]">
              Сотрудники
            </p>
            <h1 className="text-[34px] font-bold tracking-[-.025em]">
              Управление сотрудниками
            </h1>
          </div>
        </div>
      ) : (
        <>
          <nav className="contractor-breadcrumb" aria-label="Хлебные крошки">
            <button type="button" onClick={goContractors}>Подрядчики</button>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{selected}</span>
          </nav>
          <div className="contractor-overview-panel">
            <header className="contractor-detail-intro">
              <span className="contractor-detail-kicker">Подрядная организация</span>
              <h1 ref={titleRef}>{selected}</h1>
              <p>{contractorDetails[selected].description}</p>
            </header>
            <ContractorContacts
              contractor={selected}
              allowedObjectNames={allowedObjectNames}
              onOpen={() => setContractorContactsOpen(true)}
            />
            <ContractorCompany contractor={selected} />
          </div>
        </>
      )}
      {!all && (
        <div className="contractor-view-bar">
          <div
            className="segmented-switch contractor-section-switch"
            role="tablist"
            aria-label="Раздел подрядчика"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "employees"}
              className={mode === "employees" ? "is-active" : ""}
              onClick={() => setMode("employees")}
            >
              Сотрудники
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "history"}
              className={mode === "history" ? "is-active" : ""}
              onClick={() => setMode("history")}
            >
              История
            </button>
          </div>
          <AnimatePresence initial={false}>
            {mode === "history" && (
              <motion.div
                className="contractor-history-view-control"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <span>Показывать</span>
                <div
                  className="segmented-switch contractor-history-switch"
                  role="tablist"
                  aria-label="Представление истории"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={historyView === "employees"}
                    className={historyView === "employees" ? "is-active" : ""}
                    onClick={() => setHistoryView("employees")}
                  >
                    <Users size={14} aria-hidden="true" />
                    По сотрудникам
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={historyView === "objects"}
                    className={historyView === "objects" ? "is-active" : ""}
                    onClick={() => setHistoryView("objects")}
                  >
                    <MapPin size={14} aria-hidden="true" />
                    По объектам
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      {mode === "employees" ? (
      <div className="contractor-employee-card mt-5 overflow-hidden rounded-xl border border-[#dfe6ef] bg-white">
        <div className="contractor-employee-heading flex items-center justify-between px-6 py-5">
          <div>
            <h2 className="text-[18px] font-semibold">
              Сотрудники подрядчика
            </h2>
            <p className="mt-1 text-[13.5px] text-[#7788a1]">
              {`Найдено: ${filteredRows.length}`}
            </p>
          </div>
        </div>
        <div className="contractor-filters">
          <div>
            <label className="contractor-filter-field">
              <span>Сотрудник</span>
              <span className="contractor-filter-input">
                <Search size={15} aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Введите ФИО"
                />
              </span>
            </label>
            <label className="contractor-filter-field">
              <span>Должность</span>
              <span className="contractor-filter-input">
                <Search size={15} aria-hidden="true" />
                <input
                  type="search"
                  value={roleQuery}
                  onChange={(event) => setRoleQuery(event.target.value)}
                  placeholder="Введите должность"
                />
              </span>
            </label>
            <div className="contractor-filter-field contractor-department-filter">
              <span>Подразделение</span>
              <ObjectPresenceCombobox
                value={department}
                onChange={setDepartment}
                options={departmentOptions}
                placeholder="Введите подразделение"
                ariaLabel="Фильтр по подразделению"
              />
            </div>
            <label className="contractor-filter-field">
              <span>Контакты</span>
              <span className="contractor-filter-input">
                <Search size={15} aria-hidden="true" />
                <input
                  type="search"
                  value={contactQuery}
                  onChange={(event) => setContactQuery(event.target.value)}
                  placeholder="Телефон или email"
                />
              </span>
            </label>
            <div className="contractor-filter-field">
              <span>Статус</span>
              <Select
                value={status}
                onChange={setStatus}
                options={["Все статусы", "Активен", "Неактивен"]}
              />
            </div>
            <button
              type="button"
              className="table-filter-reset"
              onClick={resetFilters}
              aria-label="Сбросить все фильтры"
              title="Сбросить все фильтры"
            >
              <motion.span
                initial={false}
                animate={{
                  rotate: employeeResetIconTurns * -360,
                  scale: employeeResetIconTurns ? [1, 0.88, 1.06, 1] : 1,
                }}
                transition={{
                  rotate: { duration: 1.25, ease: [0.18, 0.72, 0.22, 1] },
                  scale: { duration: 1.25, ease: [0.18, 0.72, 0.22, 1], times: [0, 0.18, 0.68, 1] },
                }}
                aria-hidden="true"
              >
                <RefreshCw size={16} />
              </motion.span>
            </button>
          </div>
        </div>
        <EmployeeTable rows={filteredRows} all={all} open={open} />
      </div>
      ) : (
        <ContractorPresenceMatrix
          contractor={selected}
          allowedObjectNames={allowedObjectNames}
          records={scopedPresenceRecords}
          groupMode={historyView}
          onOpenEmployee={(name) => {
            const employee = staff.find((item) => item.name === name);
            if (employee) open(employee);
          }}
        />
      )}
      <AnimatePresence>
        {!all && contractorContactsOpen && (
          <ContractorContactsModal
            contractor={selected}
            allowedObjectNames={allowedObjectNames}
            close={() => setContractorContactsOpen(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function getObjectContractors(
  object: ObjectItem,
  availableContractors: readonly string[] = contractors,
) {
  if (object.contractors) return object.contractors;
  return availableContractors.filter((contractor) =>
    Object.prototype.hasOwnProperty.call(
      contractorDetails[contractor]?.contactsByObject ?? {},
      object.code,
    ),
  );
}

function getResponsibleForObject(
  object: ObjectItem,
  contractor: string,
): ContactPerson {
  const savedResponsible = contractorDetails[contractor]?.contactsByObject[object.code];
  if (savedResponsible?.name.trim()) return savedResponsible;

  const contractorStaff = staff.filter(
    (employee) => employee.contractor === contractor && employee.status === "Активен",
  );
  const objectIndex = Math.max(
    0,
    objectsInitial.findIndex((item) => item.code === object.code),
  );
  const employee = contractorStaff[objectIndex % Math.max(contractorStaff.length, 1)];
  if (employee) {
    return {
      name: employee.name,
      role: employee.role,
      phone: employee.phone,
      email: employee.email,
    };
  }

  const details = contractorDetails[contractor];
  return {
    name: "Диспетчер подрядчика",
    role: "Ответственный",
    phone: details.phone,
    email: details.email,
  };
}

function getObjectPresenceRecords(object: ObjectItem): PresenceRecord[] {
  const assignedContractors = getObjectContractors(object);
  const existingRecords = PRESENCE_RECORDS.filter(
    (record) =>
      record.object === object.name && assignedContractors.includes(record.contractor),
  );
  const objectIndex = Math.max(
    0,
    objectsInitial.findIndex((item) => item.code === object.code),
  );
  const fallbackRooms = objectDetails[object.code]?.rooms ?? [
    "Главный вход",
    "Техническая зона",
    "Территория",
  ];
  const generatedRecords = assignedContractors.flatMap((contractor, index) => {
    const hasActiveWorker = existingRecords.some(
      (record) => record.contractor === contractor && !record.leftAt,
    );
    if (hasActiveWorker) return [];

    const contractorStaff = staff.filter(
      (employee) => employee.contractor === contractor && employee.status === "Активен",
    );
    const employee = contractorStaff[
      (objectIndex + index) % Math.max(contractorStaff.length, 1)
    ];
    if (!employee) return [];

    return [{
      id: `presence-${object.code}-${index + 1}`,
      employee: employee.name,
      role: employee.role,
      contractor,
      object: object.name,
      room: fallbackRooms[(objectIndex + index) % fallbackRooms.length],
      enteredAt: `2026-08-18T${String(8 + (objectIndex + index) % 3).padStart(2, "0")}:${String(5 + (objectIndex * 7 + index * 11) % 50).padStart(2, "0")}:00`,
      leftAt: null,
    } satisfies PresenceRecord];
  });

  return [...existingRecords, ...generatedRecords];
}

function getObjectContacts(object: ObjectItem): ContactPerson[] {
  const configuredContacts =
    object.contacts ?? objectDetails[object.code]?.contacts ?? [];
  if (configuredContacts.length) return configuredContacts;

  return getObjectContractors(object).map((contractor) =>
    getResponsibleForObject(object, contractor),
  );
}

function getObjectTags(object: ObjectItem): string[] {
  const configuredTags = objectDetails[object.code]?.rooms;
  const objectIndex = objectsInitial.findIndex((item) => item.code === object.code);
  const count = objectIndex >= 0
    ? getObjectProfile(object).activeTags
    : (configuredTags?.length ?? 0);
  return Array.from({ length: count }, (_, index) =>
    configuredTags?.[index] ??
    `NFC-${object.code}-${String(index + 1).padStart(3, "0")}`,
  );
}

function ContractorContacts({
  contractor,
  allowedObjectNames,
  onOpen,
}: {
  contractor: string;
  allowedObjectNames: string[];
  onOpen: () => void;
}) {
  const contacts = getVisibleContractorContacts(contractor, allowedObjectNames);
  return (
    <section className="contractor-people-card" aria-label="Контактные лица подрядчика">
      <header className="contractor-people-heading">
        <h2>Контактные лица</h2>
      </header>
      <button
        type="button"
        className="contractor-contacts-open"
        onClick={onOpen}
        disabled={!contacts.length}
        aria-haspopup="dialog"
      >
        <Contact size={17} aria-hidden="true" />
        <div>
          <strong>{contacts.length ? "Показать контакты" : "Контакты не указаны"}</strong>
          <small>
            {contacts.length
              ? `${contacts.length} ${pluralizeRu(contacts.length, "контакт", "контакта", "контактов")}`
              : "Нет доступных контактов"}
          </small>
        </div>
        <ArrowUpRight size={16} aria-hidden="true" />
      </button>
    </section>
  );
}

function ContractorCompany({ contractor }: { contractor: string }) {
  const details = contractorDetails[contractor];
  return (
    <section className="contractor-dispatcher-card" aria-label="Контакты компании">
      <header>
        <Building2 size={16} aria-hidden="true" />
        <h2>Компания</h2>
      </header>
      <div className="contractor-dispatcher-actions">
        <a href={`mailto:${details.email}`}>
          <Mail size={16} aria-hidden="true" />
          <span>
            <small>Email компании</small>
            <strong>{details.email}</strong>
          </span>
        </a>
        <a href={`tel:${details.phone.replace(/[^+\d]/g, "")}`}>
          <Phone size={16} aria-hidden="true" />
          <span>
            <small>Телефон компании</small>
            <strong>{details.phone}</strong>
          </span>
        </a>
      </div>
    </section>
  );
}

function getVisibleContractorContacts(
  contractor: string,
  allowedObjectNames: readonly string[],
) {
  return Object.entries(contractorDetails[contractor].contactsByObject).flatMap(
    ([code, contact]) => {
      const object = objectsInitial.find((item) => item.code === code);
      if (!object || !allowedObjectNames.includes(object.name)) return [];
      if (!contact.name.trim() && !contact.phone.trim() && !contact.email?.trim()) return [];
      return [{ code, objectName: object.name, contact }];
    },
  );
}

function ContractorContactsModal({
  contractor,
  allowedObjectNames,
  close,
}: {
  contractor: string;
  allowedObjectNames: string[];
  close: () => void;
}) {
  const titleId = useId();
  const contacts = getVisibleContractorContacts(contractor, allowedObjectNames);
  useOverlayLock(close);

  return createPortal(
    <motion.div
      className="overlay-layer object-contacts-modal-layer fixed inset-0 z-[80] isolate"
      initial="closed"
      animate="open"
      exit="closed"
    >
      <motion.button
        type="button"
        aria-label="Закрыть список контактов"
        className="object-contacts-modal-backdrop absolute inset-0 z-0"
        onClick={close}
        variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
      <motion.section
        className="overlay-drawer-panel object-contacts-modal contractor-contacts-modal fixed z-10"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        variants={{
          closed: { opacity: 0, y: 18, scale: 0.965 },
          open: { opacity: 1, y: 0, scale: 1 },
        }}
        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="object-contacts-modal-head">
          <div>
            <span>Контакты подрядчика</span>
            <h2 id={titleId}>Контактные лица</h2>
            <p>{contractor}</p>
          </div>
          <span className="object-contacts-modal-count">
            {contacts.length} {pluralizeRu(contacts.length, "контакт", "контакта", "контактов")}
          </span>
          <button
            type="button"
            className="object-contacts-modal-close"
            onClick={close}
            aria-label="Закрыть"
            autoFocus
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>
        <div className="overlay-scroll-region object-contacts-modal-list">
          {contacts.map(({ code, objectName, contact }) => (
            <article key={`${code}-${contact.phone}`}>
              <div className="object-contact-modal-person">
                <span className="contractor-contact-modal-object">{objectName}</span>
                <strong>{contact.name}</strong>
                <small>{contact.role}</small>
              </div>
              <div className="object-contact-modal-actions">
                <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}>
                  <Phone size={15} aria-hidden="true" />
                  <span>
                    <small>Телефон</small>
                    <strong>{contact.phone}</strong>
                  </span>
                </a>
                {contact.email && (
                  <a href={`mailto:${contact.email}`}>
                    <Mail size={15} aria-hidden="true" />
                    <span>
                      <small>Email</small>
                      <strong>{contact.email}</strong>
                    </span>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </motion.section>
    </motion.div>,
    document.body,
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
                allowEscapeViewBox={{ x: true, y: true }}
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
  const pagination = usePaginatedItems(rows, rows.map((record) => record.id).join("|"));
  const eventIcon = (event: LogRecord["event"]) =>
    event === "Вход" ? (
      <DoorOpen size={14} />
    ) : event === "Выход" ? (
      <DoorClosed size={14} />
    ) : (
      <FileText size={14} />
    );
  return (
    <div className="table-pagination-shell">
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
            pagination.pageItems.map((record) => {
              const employee = staff.find(
                (item) => item.name === record.employee,
              );
              return (
                <tr
                  key={record.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Открыть событие сотрудника ${record.employee}`}
                  onClick={() => employee && openEmployee(employee)}
                  onKeyDown={(event) => {
                    if ((event.key === "Enter" || event.key === " ") && employee) {
                      event.preventDefault();
                      openEmployee(employee);
                    }
                  }}
                  className="cursor-pointer"
                >
                  <td data-label="Дата и время" className="px-6 py-4">
                    <strong className="log-date">{record.date}</strong>
                    <time>{record.time}</time>
                  </td>
                  <td data-label="Сотрудник" className="px-3">
                    <button
                      className="log-employee"
                      onClick={(event) => {
                        event.stopPropagation();
                        if (employee) openEmployee(employee);
                      }}
                    >
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
                  <span>Сбросьте фильтры или измените запрос</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
        </table>
      </div>
      <DataPagination
        page={pagination.page}
        pageCount={pagination.pageCount}
        pageSize={pagination.pageSize}
        totalItems={rows.length}
        onPageChange={pagination.setPage}
      />
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
  const pagination = usePaginatedItems(rows, rows.map((employee) => employee.email).join("|"));
  return (
    <div className="table-pagination-shell">
      <div className="contractor-employee-table-viewport responsive-table-wrap overflow-x-auto">
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
            pagination.pageItems.map((e) => (
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
                  <p className="text-[15px] font-semibold">{e.name}</p>
                </td>
                {all && (
                  <td data-label="Подрядчик" className="px-3 text-[12.5px] text-[#5e718e]">
                    {e.contractor.replace("ООО ", "")}
                  </td>
                )}
                <td data-label="Должность" className="px-3 text-[13.5px] text-[#30425e]">{e.role}</td>
                <td data-label="Подразделение" className="px-3 text-[13.5px] text-[#627590]">{e.dept}</td>
                <td data-label="Контакты" className="px-3 text-[12.5px] text-[#526783]">
                  <a
                    href={`tel:${e.phone.replace(/[^+\d]/g, "")}`}
                    onClick={(event) => event.stopPropagation()}
                    className="block font-medium text-[#245ccb] hover:underline"
                  >
                    {e.phone}
                  </a>
                  <a
                    href={`mailto:${e.email}`}
                    onClick={(event) => event.stopPropagation()}
                    className="mt-1 block text-[#526f96] hover:underline"
                  >
                    {e.email}
                  </a>
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
                  <span>Сбросьте фильтры или измените запрос</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
        </table>
      </div>
      <DataPagination
        page={pagination.page}
        pageCount={pagination.pageCount}
        pageSize={pagination.pageSize}
        totalItems={rows.length}
        onPageChange={pagination.setPage}
      />
    </div>
  );
}
function ContractorsPage({
  open,
  items = contractors,
  objects = objectsInitial,
}: {
  open: (x: string) => void;
  items?: string[];
  objects?: ObjectItem[];
}) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      items.filter((contractor) =>
        `${contractor} ${contractorDetails[contractor].description} ${contractorDetails[contractor].phone} ${contractorDetails[contractor].email}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      ),
    [query, items],
  );
  return (
    <section className="objects-page contractors-page px-10 py-8">
      <h1 className="text-[34px] font-bold tracking-[-.025em]">Подрядчики</h1>
      <div className="objects-table-card mt-7">
        <div className="entity-list-header flex items-center justify-between border-b border-[#e6ebf2] px-6 py-5">
          <div>
            <h2 className="text-[18px] font-semibold">Подрядные организации</h2>
            <p className="mt-1 text-[13.5px] text-[#7788a1]">
              Найдено: {filtered.length}
            </p>
          </div>
          <div className="relative">
            <Search
              className="objects-table-search-icon absolute left-3 top-1/2 -translate-y-1/2 text-[#8293ad]"
              size={16}
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Поиск подрядчика"
              aria-label="Поиск подрядчика"
              className="objects-table-search h-9 rounded-lg border border-[#dce5ef] pl-9 pr-3 text-[13.5px] outline-none"
            />
          </div>
        </div>
        <div className="objects-table-scroll">
          <div className="objects-table-columns contractors-table-columns" aria-hidden="true">
            <span>Подрядчик</span>
            <span>Описание</span>
            <span>Контакты</span>
            <span>Кол-во объектов</span>
          </div>
          {filtered.length ? (
            filtered.map((item) => {
              const details = contractorDetails[item];
              const logo = contractorLogos[item];
              const objectsCount = objects.filter((object) =>
                getObjectContractors(object).includes(item),
              ).length;
              return (
                <button
                  type="button"
                  key={item}
                  aria-label={`Открыть подрядчика ${item}`}
                  onClick={() => open(item)}
                  className="objects-table-row contractors-table-row"
                >
                  <span className="objects-table-name contractors-table-name">
                    <span
                      className={`contractors-table-icon${logo ? " has-logo" : ""}`}
                      aria-hidden="true"
                    >
                      {logo ? (
                        <img src={logo} alt="" />
                      ) : (
                        <Building2 size={17} />
                      )}
                    </span>
                    <strong>{item}</strong>
                  </span>
                  <span className="contractors-table-specialization">
                    {details.description}
                  </span>
                  <span className="contractors-table-contacts">
                    <span>
                      <Phone size={14} aria-hidden="true" />
                      {details.phone}
                    </span>
                    <span>
                      <Mail size={14} aria-hidden="true" />
                      {details.email}
                    </span>
                  </span>
                  <span className="objects-table-count contractors-table-count">
                    <strong>{objectsCount}</strong>
                    <small>объектов</small>
                    <span className="objects-table-open" aria-hidden="true">
                      <ChevronDown size={17} />
                    </span>
                  </span>
                </button>
              );
            })
          ) : (
            <div className="empty-filter-state">
              <Search size={20} />
              <strong>Подрядчики не найдены</strong>
              <button onClick={() => setQuery("")}>Сбросить поиск</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ObjectsPage({
  open,
  objects = objectsInitial,
}: {
  open: (object: ObjectItem) => void;
  objects?: ObjectItem[];
}) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return objects.filter((object) =>
      `${object.name} ${object.address}`.toLowerCase().includes(normalized),
    );
  }, [query, objects]);
  return (
    <section className="objects-page px-10 py-8">
      <h1 className="text-[34px] font-bold tracking-[-.025em]">Объекты</h1>
      <div className="objects-table-card mt-7">
        <div className="entity-list-header flex items-center justify-between border-b border-[#e6ebf2] px-6 py-5">
          <div>
            <h2 className="text-[18px] font-semibold">Все объекты</h2>
            <p className="mt-1 text-[13.5px] text-[#7788a1]">
              Найдено: {filtered.length}
            </p>
          </div>
          <div className="relative">
            <Search
              className="objects-table-search-icon absolute left-3 top-1/2 -translate-y-1/2 text-[#8293ad]"
              size={16}
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Название или адрес"
              aria-label="Поиск объекта по названию или адресу"
              className="objects-table-search h-9 w-[270px] rounded-lg border border-[#dce5ef] pl-9 pr-3 text-[13.5px] outline-none"
            />
          </div>
        </div>
        <div className="objects-table-scroll">
          <div className="objects-table-columns" aria-hidden="true">
            <span>Название</span>
            <span>Адрес</span>
            <span>Кол-во подрядчиков</span>
            <span>Кол-во меток</span>
          </div>
          {filtered.length ? (
            filtered.map((object) => {
              const contractorsCount = getObjectContractors(object).length;
              const tagsCount = getObjectProfile(object).activeTags;
              return (
                <button
                  type="button"
                  key={object.code}
                  aria-label={`Открыть объект ${object.name}`}
                  onClick={() => open(object)}
                  className="objects-table-row"
                >
                  <span className="objects-table-name">
                    <strong>{object.name}</strong>
                  </span>
                  <span className="objects-table-address">
                    <MapPin size={15} aria-hidden="true" />
                    <span>{object.address}</span>
                  </span>
                  <span className="objects-table-count objects-table-count--contractors">
                    <strong>{contractorsCount}</strong>
                    <small>подрядчиков</small>
                  </span>
                  <span className="objects-table-count objects-table-count--tags">
                    <strong>{tagsCount}</strong>
                    <small>меток</small>
                    <span className="objects-table-open" aria-hidden="true">
                      <ChevronDown size={17} />
                    </span>
                  </span>
                </button>
              );
            })
          ) : (
            <div className="empty-filter-state">
              <Search size={20} />
              <strong>Объекты не найдены</strong>
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
  availableContractors,
  openEmployee,
  goObjects,
  openContractor,
  onStickyTitleChange,
}: {
  object: ObjectItem;
  availableContractors: string[];
  openEmployee: (employee: Employee) => void;
  goObjects: () => void;
  openContractor: (contractor: string) => void;
  onStickyTitleChange: (title: string) => void;
}) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [contactsOpen, setContactsOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const onSiteCount = useMemo(
    () =>
      getObjectPresenceRecords(object).filter((record) => !record.leftAt).length,
    [object],
  );
  const profile = useMemo(() => {
    const base = getObjectProfile(object);
    return {
      ...base,
      contractors: getObjectContractors(object, availableContractors),
    };
  }, [availableContractors, object]);
  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    const observer = new IntersectionObserver(
      ([entry]) => onStickyTitleChange(entry.isIntersecting ? "" : object.name),
      { rootMargin: "-76px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(title);
    return () => {
      observer.disconnect();
      onStickyTitleChange("");
    };
  }, [object.name, onStickyTitleChange]);
  useEffect(() => {
    setContactsOpen(false);
    setTagsOpen(false);
  }, [object.code]);
  return (
    <section className="object-detail-page">
      <nav className="object-breadcrumb" aria-label="Хлебные крошки">
        <button type="button" onClick={goObjects}>
          Объекты
        </button>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{object.name}</span>
      </nav>

      <section className="object-cover" aria-labelledby="object-cover-title">
        <div className="object-cover__hero">
          <header className="object-cover__identity object-detail-intro">
            <h1 id="object-cover-title" ref={titleRef}>{object.name}</h1>
            <div className="object-detail-meta">
              <span className="object-address">
                <MapPin size={16} aria-hidden="true" />
                {object.address}
              </span>
            </div>
          </header>

          <aside className="object-cover__presence" aria-label="Сейчас на объекте">
            <span className="object-cover__presence-label">Сейчас на объекте</span>
            <div className="object-cover__presence-row">
              <strong>{onSiteCount}</strong>
              <span>
                {pluralizeRu(onSiteCount, "работник", "работника", "работников")}
              </span>
              <button
                type="button"
                onClick={() =>
                  document
                    .querySelector(".object-presence-card")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                Список
              </button>
            </div>
          </aside>
        </div>

        <ObjectSectionTabs
          objectCode={object.code}
          onOpenTags={() => setTagsOpen(true)}
          onOpenContacts={() => setContactsOpen(true)}
        />
      </section>

      <div className="object-detail-primary">
        <ObjectContractors
          object={object}
          profile={profile}
          openContractor={openContractor}
        />
        <ObjectAnalytics object={object} profile={profile} />
      </div>

      <ObjectPresence
        object={object}
        contractors={profile.contractors}
        openEmployee={openEmployee}
      />
      <AnimatePresence>
        {tagsOpen && (
          <ObjectTagsModal object={object} close={() => setTagsOpen(false)} />
        )}
        {contactsOpen && (
          <ObjectContactsModal object={object} close={() => setContactsOpen(false)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function ObjectSectionTabs({
  objectCode,
  onOpenTags,
  onOpenContacts,
}: {
  objectCode: string;
  onOpenTags: () => void;
  onOpenContacts: () => void;
}) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "contractors" | "tags" | "contacts"
  >("overview");

  useEffect(() => setActiveTab("overview"), [objectCode]);

  const selectTab = (
    tab: "overview" | "contractors" | "tags" | "contacts",
  ) => {
    setActiveTab(tab);
    if (tab === "contacts") {
      onOpenContacts();
      return;
    }
    if (tab === "tags") {
      onOpenTags();
      return;
    }

    const selector =
      tab === "overview"
        ? ".object-cover__hero"
        : tab === "contractors"
          ? ".object-contractors-card"
          : null;
    if (selector) {
      document.querySelector(selector)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <nav
      className="object-section-tabs"
      role="tablist"
      aria-label="Разделы объекта"
    >
      {[
        ["overview", "Обзор"],
        ["contractors", "Подрядчики"],
        ["tags", "Метки"],
        ["contacts", "Контакты"],
      ].map(([tab, label]) => (
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === tab}
          className={activeTab === tab ? "is-active" : ""}
          key={tab}
          onClick={() =>
            selectTab(tab as "overview" | "contractors" | "tags" | "contacts")
          }
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

function ObjectTags({ object }: { object: ObjectItem }) {
  const tags = useMemo(() => getObjectTags(object), [object]);
  const tagsRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [visibleTagCount, setVisibleTagCount] = useState(tags.length);

  useLayoutEffect(() => {
    const tagContainer = tagsRef.current;
    const measureRack = measureRef.current;
    if (!tagContainer || !measureRack || !tags.length) {
      setVisibleTagCount(tags.length);
      return;
    }

    const calculateVisibleTags = () => {
      const availableWidth = tagContainer.clientWidth;
      const availableHeight = tagContainer.clientHeight;
      const measuredTags = Array.from(
        measureRack.querySelectorAll<HTMLElement>("[data-room-measure]"),
      );
      const more = measureRack.querySelector<HTMLElement>("[data-room-more-measure]");
      if (!availableWidth || !availableHeight || !measuredTags.length || !more) return;

      const gap = 5;
      const tagHeight = Math.max(...measuredTags.map((tag) => tag.offsetHeight), 27);
      const maxRows = Math.max(1, Math.floor((availableHeight + gap) / (tagHeight + gap)));
      const widths = measuredTags.map((tag) => tag.offsetWidth);

      const fits = (count: number, reserveOverflow: boolean) => {
        const itemWidths = widths.slice(0, count);
        if (reserveOverflow) itemWidths.push(more.offsetWidth);
        let rows = 1;
        let rowWidth = 0;
        for (const width of itemWidths) {
          if (width > availableWidth) return false;
          if (rowWidth === 0 || rowWidth + gap + width <= availableWidth) {
            rowWidth = rowWidth === 0 ? width : rowWidth + gap + width;
          } else {
            rows += 1;
            rowWidth = width;
          }
        }
        return rows <= maxRows;
      };

      if (fits(tags.length, false)) {
        setVisibleTagCount(tags.length);
        return;
      }

      let nextVisibleCount = 0;
      for (let count = 1; count < tags.length; count += 1) {
        if (!fits(count, true)) break;
        nextVisibleCount = count;
      }
      setVisibleTagCount(nextVisibleCount);
    };

    calculateVisibleTags();
    const resizeObserver = new ResizeObserver(calculateVisibleTags);
    resizeObserver.observe(tagContainer);
    resizeObserver.observe(measureRack);
    void document.fonts?.ready.then(calculateVisibleTags);
    return () => resizeObserver.disconnect();
  }, [tags]);

  const visibleTags = tags.slice(0, visibleTagCount);
  const hiddenTags = tags.slice(visibleTagCount);
  return (
    <section className="object-rooms-card" aria-label="Метки объекта">
      <div className="object-rooms-heading">
        <Tag size={15} aria-hidden="true" />
        <h2>Метки</h2>
        <strong>{tags.length}</strong>
      </div>
      <div className="object-room-tags" ref={tagsRef}>
        {tags.length ? (
          <>
            {visibleTags.map((tag) => (
              <span className="object-room-tag" key={`${object.code}-${tag}`}>
                {tag}
              </span>
            ))}
            {hiddenTags.length > 0 && (
              <span className="object-room-overflow">
                <button
                  type="button"
                  className="object-room-more"
                  aria-label={`Ещё ${hiddenTags.length}: ${hiddenTags.join(", ")}`}
                >
                  +{hiddenTags.length}
                </button>
                <span className="object-room-tooltip" role="tooltip">
                  <strong>Остальные метки</strong>
                  <span className="object-room-tooltip-tags">
                    {hiddenTags.map((tag) => (
                      <span key={`${object.code}-hidden-${tag}`}>{tag}</span>
                    ))}
                  </span>
                </span>
              </span>
            )}
          </>
        ) : (
          <span className="object-room-empty">Не указаны</span>
        )}
        <span className="object-room-measure" ref={measureRef} aria-hidden="true">
          {tags.map((tag) => (
            <span className="object-room-tag" data-room-measure key={`${object.code}-measure-${tag}`}>
              {tag}
            </span>
          ))}
          <span className="object-room-more" data-room-more-measure>+{tags.length}</span>
        </span>
      </div>
    </section>
  );
}

function ObjectTagsModal({
  object,
  close,
}: {
  object: ObjectItem;
  close: () => void;
}) {
  const titleId = useId();
  const tags = useMemo(() => getObjectTags(object), [object]);
  const [query, setQuery] = useState("");
  const filteredTags = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ru-RU");
    return normalized
      ? tags.filter((tag) =>
          tag.toLocaleLowerCase("ru-RU").includes(normalized),
        )
      : tags;
  }, [query, tags]);
  useOverlayLock(close);

  return createPortal(
    <motion.div
      className="overlay-layer object-tags-modal-layer fixed inset-0 z-[80] isolate"
      initial="closed"
      animate="open"
      exit="closed"
    >
      <motion.button
        type="button"
        aria-label="Закрыть список меток"
        className="object-tags-modal-backdrop absolute inset-0 z-0"
        onClick={close}
        variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
      <motion.section
        className="overlay-drawer-panel object-tags-modal fixed z-10"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        variants={{
          closed: { opacity: 0, y: 18, scale: 0.965 },
          open: { opacity: 1, y: 0, scale: 1 },
        }}
        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="object-tags-modal-head">
          <div>
            <span>Метки объекта</span>
            <h2 id={titleId}>Все метки</h2>
            <p>{object.name}</p>
          </div>
          <span className="object-tags-modal-count">
            {tags.length} {pluralizeRu(tags.length, "метка", "метки", "меток")}
          </span>
          <button
            type="button"
            className="object-tags-modal-close"
            onClick={close}
            aria-label="Закрыть"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="object-tags-modal-toolbar">
          <label>
            <Search size={15} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Поиск по названию или ID"
              aria-label="Поиск по меткам объекта"
              autoFocus
            />
          </label>
        </div>

        <div className="overlay-scroll-region object-tags-modal-list">
          {filteredTags.length ? (
            filteredTags.map((tag, index) => (
              <article key={`${object.code}-all-tags-${tag}-${index}`}>
                <span className="object-tags-modal-icon" aria-hidden="true">
                  <Tag size={16} />
                </span>
                <span className="object-tags-modal-copy">
                  <strong>{tag}</strong>
                  <small>{tag.startsWith("NFC-") ? "NFC-метка" : "Зона объекта"}</small>
                </span>
                <span className="object-tags-modal-status">
                  <i aria-hidden="true" />
                  Активна
                </span>
              </article>
            ))
          ) : (
            <div className="object-tags-modal-empty">
              <Search size={20} aria-hidden="true" />
              <strong>Метки не найдены</strong>
              <span>Измените поисковый запрос</span>
            </div>
          )}
        </div>
      </motion.section>
    </motion.div>,
    document.body,
  );
}

function ObjectContacts({
  object,
  onOpen,
}: {
  object: ObjectItem;
  onOpen: () => void;
}) {
  const contacts = getObjectContacts(object);
  return (
    <section className="object-contacts-card" aria-label="Контактные лица объекта">
      <div className="object-contacts-heading">
        <div>
          <h2>
            Контактные лица
          </h2>
          <p>
            {contacts.length
              ? `${contacts.length} ${pluralizeRu(contacts.length, "контакт", "контакта", "контактов")}`
              : "Контакты не указаны"}
          </p>
        </div>
      </div>
      <button
        type="button"
        className="object-contacts-open"
        onClick={onOpen}
        disabled={!contacts.length}
        aria-haspopup="dialog"
        aria-label={contacts.length ? "Открыть контактные лица" : "Контакты не указаны"}
      >
        <Contact size={17} aria-hidden="true" />
        <span>
          <strong>{contacts.length ? "Открыть" : "Нет контактов"}</strong>
        </span>
        <ArrowUpRight size={16} aria-hidden="true" />
      </button>
    </section>
  );
}

function ObjectContactsModal({
  object,
  close,
}: {
  object: ObjectItem;
  close: () => void;
}) {
  const titleId = useId();
  const contacts = getObjectContacts(object);
  useOverlayLock(close);

  return createPortal(
    <motion.div
      className="overlay-layer object-contacts-modal-layer fixed inset-0 z-[80] isolate"
      initial="closed"
      animate="open"
      exit="closed"
    >
      <motion.button
        type="button"
        aria-label="Закрыть список контактов"
        className="object-contacts-modal-backdrop absolute inset-0 z-0"
        onClick={close}
        variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
      <motion.section
        className="overlay-drawer-panel object-contacts-modal fixed z-10"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        variants={{
          closed: { opacity: 0, y: 18, scale: 0.965 },
          open: { opacity: 1, y: 0, scale: 1 },
        }}
        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="object-contacts-modal-head">
          <div>
            <span>Контакты объекта</span>
            <h2 id={titleId}>Контактные лица</h2>
            <p>{object.name}</p>
          </div>
          <span className="object-contacts-modal-count">
            {contacts.length} {pluralizeRu(contacts.length, "контакт", "контакта", "контактов")}
          </span>
          <button
            type="button"
            className="object-contacts-modal-close"
            onClick={close}
            aria-label="Закрыть"
            autoFocus
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="overlay-scroll-region object-contacts-modal-list">
          {contacts.map((contact, index) => (
            <article key={`${object.code}-modal-${contact.phone}-${index}`}>
              <div className="object-contact-modal-person">
                <strong>{contact.name}</strong>
                <small>{contact.role}</small>
              </div>
              <div className="object-contact-modal-actions">
                <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}>
                  <Phone size={15} aria-hidden="true" />
                  <span>
                    <small>Телефон</small>
                    <strong>{contact.phone}</strong>
                  </span>
                </a>
                {contact.email && (
                  <a href={`mailto:${contact.email}`}>
                    <Mail size={15} aria-hidden="true" />
                    <span>
                      <small>Email</small>
                      <strong>{contact.email}</strong>
                    </span>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </motion.section>
    </motion.div>,
    document.body,
  );
}

function ObjectPresenceCombobox({
  value,
  onChange,
  options,
  placeholder,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const suggestions = useMemo(() => {
    const normalized = value.trim().toLocaleLowerCase("ru-RU");
    if (!normalized) return options;
    return options.filter((option) =>
      option.toLocaleLowerCase("ru-RU").includes(normalized),
    );
  }, [options, value]);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const choose = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div className={`object-presence-combobox ${open ? "is-open" : ""}`} ref={rootRef}>
      <span className="object-presence-combobox-input">
        <Search size={14} aria-hidden="true" />
        <input
          type="text"
          role="combobox"
          aria-label={ariaLabel}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={
            open && suggestions.length ? `${listboxId}-${activeIndex}` : undefined
          }
          value={value}
          placeholder={placeholder}
          onFocus={() => {
            setOpen(true);
            setActiveIndex(0);
          }}
          onChange={(event) => {
            onChange(event.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              setOpen(true);
              if (!suggestions.length) return;
              const direction = event.key === "ArrowDown" ? 1 : -1;
              setActiveIndex((current) =>
                (current + direction + suggestions.length) % suggestions.length,
              );
            } else if (event.key === "Enter" && open && suggestions.length) {
              event.preventDefault();
              choose(suggestions[activeIndex]);
            } else if (event.key === "Escape") {
              setOpen(false);
            }
          }}
        />
        {value && (
          <button
            type="button"
            aria-label={`Очистить: ${ariaLabel}`}
            onClick={() => {
              onChange("");
              setOpen(true);
              setActiveIndex(0);
            }}
          >
            <X size={13} aria-hidden="true" />
          </button>
        )}
      </span>
      <AnimatePresence>
        {open && (
          <motion.div
            id={listboxId}
            role="listbox"
            className="object-presence-suggestions"
            initial={{ opacity: 0, y: -4, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -3, scale: 0.99 }}
            transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
          >
            {suggestions.length ? (
              suggestions.map((option, index) => (
                <button
                  type="button"
                  id={`${listboxId}-${index}`}
                  role="option"
                  aria-selected={value === option}
                  className={index === activeIndex ? "is-active" : ""}
                  key={option}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => choose(option)}
                >
                  {option}
                </button>
              ))
            ) : (
              <span className="object-presence-suggestions-empty">Совпадений нет</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ObjectPresence({
  object,
  openEmployee,
}: {
  object: ObjectItem;
  contractors: string[];
  openEmployee: (employee: Employee) => void;
}) {
  const [employeeQuery, setEmployeeQuery] = useState("");
  const [contractorQuery, setContractorQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [roomQuery, setRoomQuery] = useState("");
  const [timeFrom, setTimeFrom] = useState("00:00");
  const [timeTo, setTimeTo] = useState("23:59");
  const [onlyActive, setOnlyActive] = useState(false);
  const [resetIconTurns, setResetIconTurns] = useState(0);
  const isValidTime = (value: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
  const timeFromIsValid = isValidTime(timeFrom);
  const timeToIsValid = isValidTime(timeTo);
  const dateOrderIsValid = !dateFrom || !dateTo || dateFrom <= dateTo;
  const toMinutes = (value: string) => {
    const [hours, minutes] = value.split(":").map(Number);
    return hours * 60 + minutes;
  };
  const timeOrderIsValid =
    !timeFromIsValid || !timeToIsValid || toMinutes(timeFrom) <= toMinutes(timeTo);
  const filtersAreValid =
    timeFromIsValid && timeToIsValid && timeOrderIsValid && dateOrderIsValid;
  const objectRecords = useMemo(
    () => getObjectPresenceRecords(object),
    [object],
  );
  const roomOptions = useMemo(
    () =>
      Array.from(new Set([
        ...(objectDetails[object.code]?.rooms ?? []),
        ...objectRecords.map(roomForRecord),
      ])),
    [object.code, objectRecords],
  );
  const contractorOptions = useMemo(
    () => Array.from(new Set(objectRecords.map((record) => record.contractor))),
    [objectRecords],
  );
  const rows = useMemo(
    () =>
      objectRecords
        .filter((record) => {
        if (!filtersAreValid) return false;
        if (onlyActive && record.leftAt) return false;
        const normalizedQuery = employeeQuery.trim().toLocaleLowerCase("ru-RU");
        if (
          normalizedQuery &&
          !`${record.employee} ${record.role}`
            .toLocaleLowerCase("ru-RU")
            .includes(normalizedQuery)
        ) return false;
        const normalizedContractor = contractorQuery.trim().toLocaleLowerCase("ru-RU");
        if (
          normalizedContractor &&
          !record.contractor.toLocaleLowerCase("ru-RU").includes(normalizedContractor)
        ) return false;
        const normalizedRoom = roomQuery.trim().toLocaleLowerCase("ru-RU");
        if (
          normalizedRoom &&
          !roomForRecord(record).toLocaleLowerCase("ru-RU").includes(normalizedRoom)
        ) return false;

        const entry = new Date(record.enteredAt).getTime();
        const exit = record.leftAt
          ? new Date(record.leftAt).getTime()
          : Number.POSITIVE_INFINITY;
        if (dateFrom && exit < new Date(`${dateFrom}T00:00:00`).getTime()) return false;
        if (dateTo && entry > new Date(`${dateTo}T23:59:59`).getTime()) return false;

        const enteredAt = new Date(record.enteredAt);
        const entryMinutes = enteredAt.getHours() * 60 + enteredAt.getMinutes();
        return entryMinutes >= toMinutes(timeFrom) && entryMinutes <= toMinutes(timeTo);
      })
      .sort((a, b) => b.enteredAt.localeCompare(a.enteredAt)),
    [
      dateFrom,
      dateTo,
      contractorQuery,
      employeeQuery,
      filtersAreValid,
      objectRecords,
      onlyActive,
      roomQuery,
      timeFrom,
      timeTo,
    ],
  );
  const pagination = usePaginatedItems(
    rows,
    [object.name, employeeQuery, contractorQuery, dateFrom, dateTo, roomQuery, timeFrom, timeTo, String(onlyActive)].join("|"),
  );
  const resetPresenceFilters = () => {
    setEmployeeQuery("");
    setContractorQuery("");
    setDateFrom("");
    setDateTo("");
    setRoomQuery("");
    setTimeFrom("00:00");
    setTimeTo("23:59");
    setOnlyActive(false);
  };
  return (
    <section className="object-presence-card">
      <div className="object-presence-heading">
        <div>
          <h2>Работники на объекте</h2>
        </div>
      </div>
      <div className="object-presence-filters object-presence-filters--unified">
        <label className="object-presence-filter-field">
          <span>Сотрудник</span>
          <span className="object-presence-search">
            <Search size={15} aria-hidden="true" />
            <input
              type="search"
              value={employeeQuery}
              onChange={(event) => setEmployeeQuery(event.target.value)}
              placeholder="ФИО или должность"
            />
          </span>
        </label>
        <div className="object-presence-filter-field object-presence-filter-field--contractor">
          <span>Подрядчик</span>
          <ObjectPresenceCombobox
            value={contractorQuery}
            onChange={setContractorQuery}
            options={contractorOptions}
            placeholder="Введите подрядчика"
            ariaLabel="Фильтр по подрядчику"
          />
        </div>
        <div className="object-presence-filter-field object-presence-filter-field--date">
          <span>Дата</span>
          <DateRangePicker
            from={dateFrom}
            to={dateTo}
            allowEmpty
            ariaLabel="Период присутствия на объекте"
            onChange={(value) => {
              setDateFrom(value.from);
              setDateTo(value.to);
            }}
          />
        </div>
        <div className="object-presence-filter-field object-presence-filter-field--room">
          <span>Метка</span>
          <ObjectPresenceCombobox
            value={roomQuery}
            onChange={setRoomQuery}
            options={roomOptions}
            placeholder="Введите метку"
            ariaLabel="Фильтр по метке"
          />
        </div>
        <label className="object-presence-filter-field">
          <span>Время с</span>
          <TimePicker
            placeholder="00:00"
            value={timeFrom}
            ariaLabel="Время с"
            invalid={!timeFromIsValid}
            onChange={setTimeFrom}
          />
        </label>
        <label className="object-presence-filter-field">
          <span>Время по</span>
          <TimePicker
            placeholder="23:59"
            value={timeTo}
            ariaLabel="Время по"
            invalid={!timeToIsValid}
            onChange={setTimeTo}
          />
        </label>
        <label className="object-presence-active-filter">
          <input
            type="checkbox"
            checked={onlyActive}
            onChange={(event) => setOnlyActive(event.target.checked)}
          />
          <span className="object-presence-checkbox" aria-hidden="true">
            <Check size={12} />
          </span>
          Только активные
        </label>
        <button
          type="button"
          className="object-presence-reset"
          onClick={() => {
            resetPresenceFilters();
            setResetIconTurns((turns) => turns + 1);
          }}
          aria-label="Сбросить все фильтры"
          title="Сбросить все фильтры"
        >
          <motion.span
            className="object-presence-reset-icon"
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
        {(!timeFromIsValid || !timeToIsValid) && (
          <small className="object-presence-filter-error" role="alert">
            Укажите время от 00:00 до 23:59.
          </small>
        )}
        {timeFromIsValid && timeToIsValid && !timeOrderIsValid && (
          <small className="object-presence-filter-error" role="alert">
            Время начала должно быть раньше времени окончания.
          </small>
        )}
        {!dateOrderIsValid && (
          <small className="object-presence-filter-error" role="alert">
            Начальная дата должна быть раньше конечной.
          </small>
        )}
      </div>
      <div className="object-presence-table-viewport responsive-table-wrap overflow-x-auto">
        <table className="responsive-table w-full min-w-[760px] text-left">
          <thead>
            <tr>
              <th>Сотрудник</th>
              <th>Подрядчик</th>
              <th>Метка</th>
              <th>Вход</th>
              <th>Выход</th>
            </tr>
          </thead>
          <tbody>
            {pagination.pageItems.map((record) => {
              const employee = staff.find((item) => item.name === record.employee);
              return (
                <tr
                  key={record.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => employee && openEmployee(employee)}
                  onKeyDown={(event) => {
                    if ((event.key === "Enter" || event.key === " ") && employee) {
                      event.preventDefault();
                      openEmployee(employee);
                    }
                  }}
                >
                  <td data-label="Сотрудник"><strong>{record.employee}</strong><small>{record.role}</small></td>
                  <td data-label="Подрядчик">{record.contractor}</td>
                  <td data-label="Метка">
                    <span className="object-room-tag object-room-tag--table">
                      {roomForRecord(record)}
                    </span>
                  </td>
                  <td data-label="Вход">
                    <ObjectPresenceDateTime value={record.enteredAt} />
                  </td>
                  <td data-label="Выход">
                    {record.leftAt
                      ? <ObjectPresenceDateTime value={record.leftAt} />
                      : <span className="on-site-badge">На месте</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!rows.length && filtersAreValid && (
          <div className="object-presence-empty">По заданным фильтрам записи не найдены.</div>
        )}
      </div>
      <DataPagination
        page={pagination.page}
        pageCount={pagination.pageCount}
        pageSize={pagination.pageSize}
        totalItems={rows.length}
        onPageChange={pagination.setPage}
      />
    </section>
  );
}

function ObjectPresenceDateTime({ value }: { value: string }) {
  const date = new Date(value);
  return (
    <span className="object-presence-datetime">
      <span>{date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" })}</span>
      <span className="object-presence-datetime-separator" aria-hidden="true">, </span>
      <time dateTime={value}>
        {date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
      </time>
    </span>
  );
}

function ObjectAnalytics({
  object,
  profile,
}: {
  object: ObjectItem;
  profile: ObjectProfile;
}) {
  const [selectedContractor, setSelectedContractor] = useState("Все подрядчики");
  const dayLabels = [
    "22 июл",
    "23 июл",
    "24 июл",
    "25 июл",
    "26 июл",
    "27 июл",
    "28 июл",
  ];
  const seriesColors = ["#2864eb", "#7558d8", "#22a979", "#d87824"];
  const chartData = profile.visits.map((visits, dayIndex) => {
    const point: Record<string, string | number> = { day: dayLabels[dayIndex] };
    profile.contractors.forEach((_, contractorIndex) => {
      const weight = profile.contractors.length - contractorIndex + 1;
      const weightSum = profile.contractors.reduce(
        (sum, __, index) => sum + profile.contractors.length - index + 1,
        0,
      );
      point[`contractor${contractorIndex}`] = Math.max(
        0,
        Math.round((visits * weight) / weightSum + ((dayIndex + contractorIndex) % 3) - 1),
      );
    });
    return point;
  });
  return (
    <div className="object-traffic-section">
      <motion.article
        className="contractor-chart-card object-multiline-card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="analytics-heading">
          <div>
            <h2>Входы по дням</h2>
          </div>
        </div>
        <div className="chart-series-picker" role="group" aria-label="Подрядчик на графике">
          {["Все подрядчики", ...profile.contractors].map((contractor, index) => (
            <button
              type="button"
              key={contractor}
              className={selectedContractor === contractor ? "is-active" : ""}
              aria-pressed={selectedContractor === contractor}
              onClick={() => setSelectedContractor(contractor)}
            >
              {index > 0 && (
                <i style={{ backgroundColor: seriesColors[(index - 1) % seriesColors.length] }} />
              )}
              {contractor === "Все подрядчики"
                ? contractor
                : contractor.replace("ООО ", "")}
            </button>
          ))}
        </div>
        <div className="contractor-chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 12, left: -22, bottom: 0 }}
            >
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
                allowEscapeViewBox={{ x: true, y: true }}
                cursor={{ stroke: "#8cb0f5", strokeDasharray: "3 3" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #dce6f2",
                  boxShadow: "0 12px 30px rgba(28,48,82,.12)",
                  fontSize: 13.5,
                }}
                formatter={(value, name) => {
                  const index = Number(String(name).replace("contractor", ""));
                  return [`${value} входов`, profile.contractors[index] ?? ""];
                }}
              />
              {profile.contractors.map((contractor, index) =>
                selectedContractor === "Все подрядчики" ||
                selectedContractor === contractor ? (
                  <Line
                    key={`${object.code}-${contractor}`}
                    type="monotone"
                    dataKey={`contractor${index}`}
                    stroke={seriesColors[index % seriesColors.length]}
                    strokeWidth={selectedContractor === contractor ? 3 : 2.25}
                    dot={false}
                    activeDot={{ r: 4, stroke: "white", strokeWidth: 2 }}
                  />
                ) : null,
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.article>
    </div>
  );
}

function ObjectContractors({
  object,
  profile,
  openContractor,
}: {
  object: ObjectItem;
  profile: ObjectProfile;
  openContractor: (contractor: string) => void;
}) {
  return (
    <section className="object-contractors-card">
      <div className="object-contractors-heading">
        <div>
          <span className="object-section-eyebrow">
            <Building2 size={13} aria-hidden="true" />
            Реестр объекта
          </span>
          <h2>
            Подрядчики
            <span
              className="object-contractors-count"
              aria-label={`Подрядчиков: ${profile.contractors.length}`}
            >
              {profile.contractors.length}
            </span>
          </h2>
        </div>
      </div>
      <div className="object-contractor-columns" aria-hidden="true">
        <span />
        <span>Подрядчик</span>
        <span>На объекте</span>
        <span>Ответственный</span>
        <span>Контакт</span>
        <span />
      </div>
      <div className="object-contractor-grid">
        {profile.contractors.map((contractor) => {
          const details = contractorDetails[contractor];
          const logo = contractorLogos[contractor];
          const responsible = getResponsibleForObject(object, contractor);
          const onSiteCount = getObjectPresenceRecords(object).filter(
            (record) =>
              !record.leftAt &&
              record.contractor === contractor,
          ).length;
          const presenceLabel = onSiteCount
            ? `${onSiteCount} ${pluralizeRu(onSiteCount, "работник", "работника", "работников")} на месте`
            : "Сейчас работников нет";
          return (
            <article
              key={contractor}
              className="object-contractor-card"
            >
              <button
                type="button"
                className="object-contractor-target"
                aria-label={`Открыть подрядчика ${contractor}`}
                onClick={() => openContractor(contractor)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openContractor(contractor);
                  }
                }}
              />
              <span
                className={`object-contractor-icon${logo ? " has-logo" : ""}`}
                aria-hidden="true"
              >
                {logo ? (
                  <img src={logo} alt="" />
                ) : (
                  <Building2 size={18} />
                )}
              </span>
              <span className="object-contractor-copy min-w-0 flex-1">
                <strong>{contractor}</strong>
                <small className="object-contractor-service">{details.description}</small>
              </span>
              <span
                className={`object-contractor-presence${onSiteCount ? " is-present" : ""}`}
                aria-label={`На объекте: ${presenceLabel}`}
              >
                <Users size={13} aria-hidden="true" />
                <strong>{onSiteCount}</strong>
              </span>
              {responsible ? (
                <>
                  <span
                    className="object-contractor-owner"
                    aria-label={`Ответственный: ${responsible.name}, ${responsible.role}`}
                  >
                    <b>{responsible.name}</b>
                    <small>{responsible.role}</small>
                  </span>
                  {responsible.phone ? (
                    <a
                      className="object-contractor-phone"
                      href={`tel:${responsible.phone.replace(/[^+\d]/g, "")}`}
                      aria-label={`Позвонить ${responsible.name}`}
                    >
                      <Phone size={14} aria-hidden="true" />
                      {responsible.phone}
                    </a>
                  ) : (
                    <span className="object-contractor-phone is-empty" aria-hidden="true">—</span>
                  )}
                </>
              ) : (
                <>
                  <span
                    className="object-contractor-owner is-empty"
                    aria-label="Ответственный не назначен"
                  >
                    Ответственный не назначен
                  </span>
                  <span className="object-contractor-phone is-empty" aria-hidden="true">—</span>
                </>
              )}
              <span className="object-contractor-open" aria-hidden="true">
                <ChevronDown size={17} />
              </span>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function SettingsPage({
  toast,
  objects,
  onObjectsChange,
  users,
  onUsersChange,
}: {
  toast: (m: string) => void;
  objects: ObjectItem[];
  onObjectsChange: (objects: ObjectItem[]) => void;
  users: AdminUser[];
  onUsersChange: (users: AdminUser[]) => void;
}) {
  const [tab, setTab] = useState<"users" | "objects" | "contractors">("users");
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [chosen, setChosen] = useState<ObjectItem | null>(null);
  const [contractorModal, setContractorModal] = useState<string | null>(null);
  return (
    <section className="px-10 py-8">
      <h1 className="text-[34px] font-bold tracking-[-.025em]">Настройки</h1>
      <div className="settings-tabs mt-7 flex w-fit rounded-xl border border-[#dce5ef] bg-white p-1">
        <button
          onClick={() => setTab("users")}
          className={`rounded-lg px-4 py-2 text-[15px] font-semibold ${tab === "users" ? "bg-[#2563eb] text-white" : "text-[#61738f]"}`}
        >
          Пользователи
        </button>
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
      {tab === "users" ? (
        <AdminUsersSettings
          objectNames={objects.map((object) => object.name)}
          toast={toast}
          users={users}
          onUsersChange={onUsersChange}
        />
      ) : tab === "objects" ? (
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
                role="button"
                tabIndex={0}
                onClick={() => {
                  setChosen(item);
                  setModal("edit");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setChosen(item);
                    setModal("edit");
                  }
                }}
                className="entity-click-row flex cursor-pointer items-center gap-4 px-6 py-4"
              >
                <div className="flex-1">
                  <p className="text-[15px] font-semibold">{item.name}</p>
                  <p className="mt-1 text-[12.5px] text-[#7b8ca5]">
                    {item.address}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-1 text-[12.5px] font-semibold ${statusStyle[item.status]}`}
                >
                  {item.status}
                </span>
                <button
                  aria-label={`Редактировать ${item.name}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    setChosen(item);
                    setModal("edit");
                  }}
                  className="grid size-9 place-items-center rounded-lg text-[#617894] hover:bg-blue-50 hover:text-blue-600"
                >
                  <Pencil size={16} />
                </button>
                <button
                  aria-label={`Удалить ${item.name}`}
                  onClick={(event) => {
                    event.stopPropagation();
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
                Описание, ответственные и привязанные объекты
              </p>
            </div>
          </div>
          <div className="divide-y divide-[#e8edf4]">
            {contractors.map((item, i) => {
              const logo = contractorLogos[item];
              return (
                <div
                  key={item}
                  role="button"
                  tabIndex={0}
                  onClick={() => setContractorModal(item)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setContractorModal(item);
                    }
                  }}
                  className="entity-click-row flex cursor-pointer items-center gap-4 px-6 py-4"
                >
                  <div className="grid size-10 place-items-center overflow-hidden rounded-xl border border-[#dbe4ef] bg-white p-1.5">
                    {logo ? (
                      <img className="size-full object-contain" src={logo} alt="" />
                    ) : (
                      <Building2 size={19} className="text-[#2563eb]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-semibold">{item}</p>
                    <p className="mt-1 text-[12.5px] text-[#7b8ca5]">
                      ИНН 7704{i + 218}000 · 2 контактных лица
                    </p>
                  </div>
                  <button
                    aria-label={`Редактировать ${item}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      setContractorModal(item);
                    }}
                    className="grid size-9 place-items-center rounded-lg text-[#617894] hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Pencil size={16} />
                  </button>
                </div>
              );
            })}
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
                onObjectsChange(
                  objects.filter((value) => value.code !== chosen.code),
                );
              if (modal === "add" && saved)
                onObjectsChange([...objects, saved]);
              if (modal === "edit" && saved && chosen)
                onObjectsChange(
                  objects.map((value) =>
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
            key={`contractor-modal-${contractorModal}`}
            contractor={contractorModal}
            objects={objects}
            close={() => setContractorModal(null)}
            done={(m, linkedCodes) => {
              onObjectsChange(
                objects.map((object) => {
                  const current = getObjectContractors(object);
                  const shouldBeLinked = linkedCodes.includes(object.code);
                  const next = shouldBeLinked
                    ? Array.from(new Set([...current, contractorModal]))
                    : current.filter((name) => name !== contractorModal);
                  return { ...object, contractors: next };
                }),
              );
              setContractorModal(null);
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
  const [linked, setLinked] = useState(
    item?.contractors ||
      (item ? getObjectContractors(item) : [contractors[0], contractors[1]]),
  );
  const [find, setFind] = useState("");
  const [name, setName] = useState(item?.name || "");
  const [code, setCode] = useState(item?.code || "");
  const [address, setAddress] = useState(item?.address || "");
  const [access, setAccess] = useState(
    item?.access || (item ? objectDetails[item.code]?.access : "") || "",
  );
  const [contacts, setContacts] = useState<ContactPerson[]>(
    item?.contacts ||
      (item ? objectDetails[item.code]?.contacts : undefined) || [
        { name: "", role: "", phone: "", email: "" },
      ],
  );
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
      access: access.trim(),
      contacts: contacts.filter((contact) => contact.name.trim()),
      contractors: linked,
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
          sub="Контакты и подрядчики"
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
            <Field
              label="Как попасть на объект"
              value={access}
              onChange={setAccess}
              placeholder="Например: пост охраны, вход 1"
            />
          </div>
          <section className="rounded-xl border border-[#e3eaf3] bg-[#f8fbff] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-[#1e293b]">Контакты объекта</h3>
              <button
                onClick={() =>
                  setContacts((items) => [
                    ...items,
                    { name: "", role: "", phone: "", email: "" },
                  ])
                }
                className="drawer-section-action"
              >
                <Plus size={14} /> Добавить
              </button>
            </div>
            <div className="space-y-3">
              {contacts.map((contact, contactIndex) => (
                <div key={contactIndex} className="relative space-y-3 rounded-lg border border-[#dce5ef] bg-white p-3.5">
                  <Field
                    label="ФИО"
                    value={contact.name}
                    onChange={(value) =>
                      setContacts((items) =>
                        items.map((entry, index) =>
                          index === contactIndex ? { ...entry, name: value } : entry,
                        ),
                      )
                    }
                  />
                  <Field
                    label="Должность"
                    value={contact.role}
                    onChange={(value) =>
                      setContacts((items) =>
                        items.map((entry, index) =>
                          index === contactIndex ? { ...entry, role: value } : entry,
                        ),
                      )
                    }
                    placeholder="Например: начальник смены"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      label="Телефон"
                      value={contact.phone}
                      onChange={(value) =>
                        setContacts((items) =>
                          items.map((entry, index) =>
                            index === contactIndex ? { ...entry, phone: value } : entry,
                          ),
                        )
                      }
                    />
                    <Field
                      label="Email"
                      value={contact.email}
                      onChange={(value) =>
                        setContacts((items) =>
                          items.map((entry, index) =>
                            index === contactIndex ? { ...entry, email: value } : entry,
                          ),
                        )
                      }
                    />
                  </div>
                  <button
                    aria-label="Удалить контакт"
                    disabled={contacts.length === 1}
                    onClick={() => setContacts((items) => items.filter((_, index) => index !== contactIndex))}
                    className="absolute right-2 top-2 grid size-7 place-items-center rounded-md text-[#9aa8b9] hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>
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
                      <div className="association-picker-footer flex items-center justify-between border-t border-[#e8edf4] bg-[#fafcff] px-3 py-2">
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
          <Field label="Примечание для сотрудников" placeholder="Что важно знать об объекте" />
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
  contractor,
  objects,
  close,
  done,
}: {
  contractor: string;
  objects: ObjectItem[];
  close: () => void;
  done: (m: string, linkedCodes: string[]) => void;
}) {
  const existingDetails = contractorDetails[contractor];
  const [description, setDescription] = useState(
    existingDetails.description,
  );
  const [drawer, setDrawer] = useState(false);
  const [linked, setLinked] = useState(
    Object.keys(existingDetails.contactsByObject),
  );
  const [find, setFind] = useState("");
  useOverlayLock(close);
  const shown = objects.filter(
    (object) =>
      object.name.toLowerCase().includes(find.toLowerCase()) ||
      object.address.toLowerCase().includes(find.toLowerCase()),
  );
  const toggle = (code: string) => {
    setLinked((current) =>
      current.includes(code)
        ? current.filter((value) => value !== code)
        : [...current, code],
    );
  };
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
          sub="Описание и привязанные объекты"
          close={close}
        />
        <div className="overlay-scroll-region flex-1 overflow-y-auto space-y-7 px-7 py-6">
          <div className="space-y-4">
            <Field label="Название организации" value={contractor} readOnly />
            <label className="block">
              <span className="mb-1.5 block text-[13.5px] font-medium text-[#40516d]">
                Описание
              </span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                placeholder="Например: шлагбаумы, СКУД и видеонаблюдение"
                className="w-full resize-none rounded-lg border border-[#dce5f0] bg-white px-3 py-2.5 text-[15px] text-[#16223a] outline-none focus:border-[#3b82f6]"
              />
            </label>
          </div>
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
                      <div className="association-picker-footer flex items-center justify-between border-t border-[#e8edf4] bg-[#fafcff] px-3 py-2">
                        <button
                          onClick={() =>
                            setLinked(
                              linked.length === objects.length
                                ? []
                                : objects.map((x) => x.code),
                            )
                          }
                          className="text-[12.5px] font-medium text-[#61738f] hover:text-[#2563eb]"
                        >
                          {linked.length === objects.length
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
                  const item = objects.find((x) => x.code === code);
                  if (!item) return null;
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
          save={() => {
            contractorDetails[contractor] = {
              ...existingDetails,
              description: description.trim() || existingDetails.description,
              contactsByObject: Object.fromEntries(
                linked.map((code) => [
                  code,
                  existingDetails.contactsByObject[code] || {
                    name: "",
                    role: "",
                    phone: "",
                    email: "",
                  },
                ]),
              ),
            };
            done("Данные подрядчика сохранены", linked);
          }}
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
      business: objectsInitial[index % 2].name,
      title: ["Архив", "Метка 1", "Метка 2", "Переговорная", "Склад"][
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
  const [managingBusiness, setManagingBusiness] = useState<ObjectItem | null>(
    null,
  );
  const [returnToBusiness, setReturnToBusiness] = useState<string | null>(null);
  const [business, setBusiness] = useState("Все объекты");
  const [query, setQuery] = useState("");

  const visibleGroups = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return tagBusinessGroups
      .filter(
        (object) =>
          business === "Все объекты" || object.name === business,
      )
      .map((object) => {
        const objectTags = tags.filter((tag) => tag.business === object.name);
        const businessMatches =
          !normalized ||
          `${object.name} ${object.address}`
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
        (business === "Все объекты" || tag.business === business) &&
        (!normalized ||
          `${tag.id} ${tag.uid} ${tag.title} ${tag.type} ${tag.business} ${tag.contractors.join(" ")}`
            .toLowerCase()
            .includes(normalized)),
    );
  }, [tags, business, query]);
  const groupPagination = usePaginatedItems(
    visibleGroups,
    [view, business, query, visibleGroups.map((group) => group.object.code).join("|")].join("|"),
  );
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
  const openNewTag = (businessName: string, returnToManager = false) => {
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
    setReturnToBusiness(returnToManager ? businessName : null);
    setManagingBusiness(null);
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
    toast("Метка удалена");
  };
  const unassignTag = (tagId: string) => {
    setTags((items) =>
      items.map((tag) =>
        tag.id === tagId
          ? { ...tag, business: UNASSIGNED_BUSINESS }
          : tag,
      ),
    );
    toast("Метка отвязана от объекта");
  };
  return (
    <section className="px-10 py-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[34px] font-bold tracking-[-.025em]">Метки</h1>
          <p className="mt-2 text-[16px] text-[#71819b]">
            NFC-метки и их привязка к объектам
          </p>
        </div>
      </div>
      <div className="business-tags-toolbar mt-6 flex items-center gap-3 rounded-xl border border-[#dfe6ef] bg-white p-4">
        <div className="w-72">
          <Select
            value={business}
            onChange={setBusiness}
            options={[
              "Все объекты",
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
              {view === "tags" ? "Все метки" : "Связь с объектами"}
            </h2>
            {view === "businesses" && (
              <p className="mt-1 text-[13.5px] text-[#7788a1]">
                Выберите объект, чтобы посмотреть или изменить связанные метки
              </p>
            )}
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
                Связь с объектами
              </button>
            </div>
            <span className="tag-view-count">
              {view === "tags"
                ? `Найдено: ${visibleTags.length}`
                : `${visibleGroups.filter((group) => group.object.code !== "NO-LINK").length} объектов · ${tagCountLabel(totalVisibleTags)}`}
            </span>
          </div>
        </div>
        {view === "tags" ? (
          <TagsListTable
            tags={visibleTags}
            edit={(tag) => {
              setReturnToBusiness(null);
              setEditingTag(tag);
            }}
            reset={() => {
              setBusiness("Все объекты");
              setQuery("");
            }}
          />
        ) : (
          <div className="table-pagination-shell">
          <table className="business-tags-table w-full text-left">
            <thead className="bg-[#f8fafc] text-[12.5px] uppercase tracking-[.06em] text-[#7485a0]">
              <tr>
                <th className="px-6 py-3">Объект</th>
                <th className="px-3 py-3">Связанные метки</th>
                <th className="px-6 py-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {visibleGroups.length ? (
                groupPagination.pageItems.map(({ object, tags: objectTags }) => {
                  const isUnassigned = object.code === "NO-LINK";
                  const activeTags = objectTags.filter((tag) => tag.active);
                  return (
                    <tr
                      key={object.name}
                      className={`business-center-row border-t border-[#e8edf4] ${isUnassigned ? "is-unassigned" : ""}`}
                      role="button"
                      tabIndex={0}
                      aria-label={`Управлять метками ${object.name}`}
                      onClick={() => setManagingBusiness(object)}
                      onKeyDown={(event) => {
                        if (
                          event.target === event.currentTarget &&
                          (event.key === "Enter" || event.key === " ")
                        ) {
                          event.preventDefault();
                          setManagingBusiness(object);
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
                              {object.address}
                            </small>
                          </span>
                        </div>
                      </td>
                      <td className="px-3">
                        <button
                          type="button"
                          className="tag-summary"
                          onClick={(event) => {
                            event.stopPropagation();
                            setManagingBusiness(object);
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
                            <small>{activeTags.length} активных</small>
                          </span>
                        </button>
                      </td>
                      <td className="px-6">
                        <div className="business-tag-actions">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setManagingBusiness(object);
                            }}
                          >
                            <SlidersHorizontal size={14} />
                            Управлять
                          </button>
                          <button
                            type="button"
                            className="business-quick-add-button"
                            aria-label={`Добавить метку в ${object.name}`}
                            onClick={(event) => {
                              event.stopPropagation();
                              openNewTag(object.name);
                            }}
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3}>
                    <div className="empty-filter-state">
                      <Search size={20} />
                      <strong>Объекты не найдены</strong>
                      <button
                        onClick={() => {
                          setBusiness("Все объекты");
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
          <DataPagination
            page={groupPagination.page}
            pageCount={groupPagination.pageCount}
            pageSize={groupPagination.pageSize}
            totalItems={visibleGroups.length}
            onPageChange={groupPagination.setPage}
          />
          </div>
        )}
      </div>
      <AnimatePresence>
        {managingBusiness && (
          <BusinessTagsManager
            key={managingBusiness.name}
            object={managingBusiness}
            tags={tags.filter(
              (tag) => tag.business === managingBusiness.name,
            )}
            close={() => setManagingBusiness(null)}
            add={() => openNewTag(managingBusiness.name, true)}
            edit={(tag) => {
              setReturnToBusiness(managingBusiness.name);
              setManagingBusiness(null);
              setEditingTag(tag);
            }}
            toggle={toggleTag}
            detach={
              managingBusiness.code === "NO-LINK" ? removeTag : unassignTag
            }
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {editingTag && (
          <TagDrawer
            key={editingTag.id}
            tag={editingTag}
            close={() => {
              setEditingTag(null);
              if (returnToBusiness) {
                setManagingBusiness(
                  tagBusinessGroups.find(
                    (object) => object.name === returnToBusiness,
                  ) || null,
                );
              }
              setReturnToBusiness(null);
            }}
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
              setEditingTag(null);
              if (returnToBusiness) {
                setManagingBusiness(
                  tagBusinessGroups.find(
                    (object) => object.name === savedTag.business,
                  ) || null,
                );
              }
              setReturnToBusiness(null);
              toast(isNew ? "Метка добавлена" : "Метка обновлена");
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function BusinessTagsManager({
  object,
  tags,
  close,
  add,
  edit,
  toggle,
  detach,
}: {
  object: ObjectItem;
  tags: ManagedTag[];
  close: () => void;
  add: () => void;
  edit: (tag: ManagedTag) => void;
  toggle: (tagId: string) => void;
  detach: (tagId: string) => void;
}) {
  const [tagQuery, setTagQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("Все типы");
  const [statusFilter, setStatusFilter] = useState("Все статусы");
  const isUnassigned = object.code === "NO-LINK";
  useOverlayLock(close);
  const filteredTags = useMemo(() => {
    const normalized = tagQuery.trim().toLowerCase();
    return tags.filter((tag) => {
      const matchesQuery =
        !normalized ||
        `${tag.id} ${tag.uid} ${tag.title} ${tag.type}`
          .toLowerCase()
          .includes(normalized);
      const matchesType =
        typeFilter === "Все типы" || tag.type === typeFilter;
      const matchesStatus =
        statusFilter === "Все статусы" ||
        (statusFilter === "Активные" ? tag.active : !tag.active);
      return matchesQuery && matchesType && matchesStatus;
    });
  }, [tags, tagQuery, typeFilter, statusFilter]);
  const activeCount = tags.filter((tag) => tag.active).length;
  const visitCount = tags.filter((tag) => tag.type === "Посещение").length;
  const journalCount = tags.filter((tag) => tag.type === "Журнал").length;
  const toneFor = (type: TagType) =>
    type === "Посещение"
      ? "is-visit"
      : type === "Журнал"
        ? "is-journal"
        : "is-neutral";
  return (
    <motion.div
      className="overlay-layer business-tag-manager-layer fixed inset-0 z-[60] isolate"
      initial="closed"
      animate="open"
      exit="closed"
    >
      <motion.button
        aria-label="Закрыть управление метками"
        onClick={close}
        className="absolute inset-0 z-0 cursor-default bg-[#15233a]/30"
        variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      />
      <motion.aside
        aria-label={`Метки ${object.name}`}
        aria-modal="true"
        role="dialog"
        className="overlay-drawer-panel business-tag-manager-panel fixed bottom-0 right-0 top-0 z-10 flex w-[640px] flex-col border-l border-[#dfe6ef] bg-white shadow-[-14px_0_36px_rgba(34,51,84,.18)]"
        variants={{ closed: { x: "100%" }, open: { x: 0 } }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: "transform" }}
      >
        <ModalHead
          title={isUnassigned ? "Метки без привязки" : object.name}
          sub={
            isUnassigned
              ? "Назначьте меткам нужный объект"
              : "Управление связанными метками"
          }
          close={close}
        />
        <div className="business-tag-manager-body">
          <div className="business-tag-manager-overview">
            <div className="business-tag-manager-counts">
              <span>
                <strong>{tags.length}</strong>
                всего
              </span>
              <span>
                <strong>{activeCount}</strong>
                активных
              </span>
              <span>
                <i className="tag-color-dot is-visit" />
                <strong>{visitCount}</strong>
                посещение
              </span>
              <span>
                <i className="tag-color-dot is-journal" />
                <strong>{journalCount}</strong>
                журнал
              </span>
            </div>
            <button type="button" onClick={add}>
              <Plus size={15} />
              Добавить метку
            </button>
          </div>
          <div className="business-tag-manager-filters">
            <label className="business-tag-manager-search">
              <Search size={15} />
              <input
                value={tagQuery}
                onChange={(event) => setTagQuery(event.target.value)}
                placeholder="Название, ID или UID"
              />
            </label>
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              options={["Все типы", "Посещение", "Журнал", "Не выбран"]}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={["Все статусы", "Активные", "Отключённые"]}
            />
          </div>
          <div className="business-tag-manager-result">
            <span>Показано: {filteredTags.length}</span>
            {(tagQuery ||
              typeFilter !== "Все типы" ||
              statusFilter !== "Все статусы") && (
              <button
                type="button"
                onClick={() => {
                  setTagQuery("");
                  setTypeFilter("Все типы");
                  setStatusFilter("Все статусы");
                }}
              >
                Сбросить фильтры
              </button>
            )}
          </div>
          <div className="business-tag-manager-list" role="list">
            {filteredTags.length ? (
              filteredTags.map((tag) => (
                <article
                  key={tag.id}
                  className={`business-tag-manager-row ${tag.active ? "" : "is-disabled"}`}
                  role="listitem"
                >
                  <i className={`tag-color-dot ${toneFor(tag.type)}`} />
                  <div className="business-tag-manager-identity">
                    <strong>{tag.title || "Без названия"}</strong>
                    <span>
                      {tag.id} · <code>{tag.uid}</code>
                    </span>
                  </div>
                  <span className={`tag-type-pill ${toneFor(tag.type)}`}>
                    {tag.type}
                  </span>
                  <span
                    className={`tag-state-badge ${tag.active ? "is-active" : ""}`}
                  >
                    {tag.active ? "Активна" : "Отключена"}
                  </span>
                  <div className="business-tag-manager-actions">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={tag.active}
                      aria-label={
                        tag.active ? `Отключить ${tag.id}` : `Включить ${tag.id}`
                      }
                      className={`tag-toggle ${tag.active ? "is-active" : ""}`}
                      onClick={() => toggle(tag.id)}
                    >
                      <i />
                    </button>
                    <button
                      type="button"
                      aria-label={`Редактировать ${tag.id}`}
                      onClick={() => edit(tag)}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      className="is-danger"
                      aria-label={
                        isUnassigned
                          ? `Удалить ${tag.id}`
                          : `Отвязать ${tag.id} от ${object.name}`
                      }
                      title={isUnassigned ? "Удалить" : "Отвязать от объекта"}
                      onClick={() => detach(tag.id)}
                    >
                      {isUnassigned ? <Trash2 size={14} /> : <X size={14} />}
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="business-tag-manager-empty">
                <Tag size={20} />
                <strong>
                  {tags.length ? "Метки не найдены" : "Здесь пока нет меток"}
                </strong>
                <span>
                  {tags.length
                    ? "Измените поисковый запрос или фильтры"
                    : "Добавьте первую метку"}
                </span>
                {!tags.length && (
                  <button type="button" onClick={add}>
                    <Plus size={14} />
                    Добавить метку
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="business-tag-manager-footer">
          <span>{filteredTags.length} из {tags.length}</span>
          <button type="button" onClick={close}>
            Закрыть
          </button>
        </div>
      </motion.aside>
    </motion.div>
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
  const pagination = usePaginatedItems(tags, tags.map((tag) => tag.id).join("|"));
  const colorFor = (type: TagType) =>
    type === "Посещение"
      ? "bg-[#2563eb]"
      : type === "Журнал"
        ? "bg-[#e87918]"
        : "bg-[#a5b1c2]";
  return (
    <div className="table-pagination-shell">
    <table className="tags-table responsive-table w-full text-left">
      <thead className="bg-[#f8fafc] text-[12.5px] uppercase tracking-[.06em] text-[#7485a0]">
        <tr>
          <th className="px-6 py-3">Объект</th>
          <th className="px-3 py-3">Название</th>
          <th className="px-3 py-3">Тип</th>
          <th className="px-6 py-3">Подрядчики</th>
          <th className="px-6 py-3 text-right">Действия</th>
        </tr>
      </thead>
      <tbody>
        {tags.length ? (
          pagination.pageItems.map((tag) => (
            <tr
              key={tag.id}
              role="button"
              tabIndex={0}
              aria-label={`Редактировать метку ${tag.id}`}
              onClick={() => edit(tag)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  edit(tag);
                }
              }}
              className="cursor-pointer border-t border-[#e8edf4]"
            >
              <td
                data-label="Объект"
                className="px-6 py-4 text-[13.5px] text-[#526783]"
              >
                <span
                  className={`tag-business-cell ${tag.business === UNASSIGNED_BUSINESS ? "is-unassigned" : ""}`}
                >
                  {tag.business === UNASSIGNED_BUSINESS ? (
                    <AlertTriangle size={13} />
                  ) : null}
                  {tag.business}
                </span>
              </td>
              <td data-label="Название" className="px-3">
                <div className="tag-name-cell">
                  <span
                    className={`tag-name-color ${colorFor(tag.type)}`}
                  />
                  <span>
                    <strong>{tag.title || "Без названия"}</strong>
                    <small>
                      {tag.id} · <code>{tag.uid}</code>
                    </small>
                  </span>
                </div>
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
                      <span
                        className="contractor-avatar-stack"
                        aria-label={tag.contractors.join(", ")}
                      >
                        {tag.contractors.slice(0, 3).map((contractor) => {
                          const logo = contractorLogos[contractor];
                          return (
                            <span
                              key={contractor}
                              className="contractor-company-avatar"
                              title={contractor}
                            >
                              {logo ? (
                                <img src={logo} alt="" aria-hidden="true" />
                              ) : (
                                contractor.replace("ООО ", "").slice(0, 1)
                              )}
                            </span>
                          );
                        })}
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
                  onClick={(event) => {
                    event.stopPropagation();
                    edit(tag);
                  }}
                  className="ml-auto grid size-8 place-items-center rounded-lg text-[#8293ad] transition hover:bg-[#edf5ff] hover:text-[#2563eb]"
                >
                  <Pencil size={15} />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5}>
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
    <DataPagination
      page={pagination.page}
      pageCount={pagination.pageCount}
      pageSize={pagination.pageSize}
      totalItems={tags.length}
      onPageChange={pagination.setPage}
    />
    </div>
  );
}

/* Legacy prototype retained for reference while the active TagsPage above is used. */
function LegacyTagsPage({ toast }: { toast: (m: string) => void }) {
  const [tags, setTags] = useState(
    initialTags.map((tag, i) => ({
      ...tag,
      business: objectsInitial[i % 2].name,
      title: ["Архив", "Метка 1", "Метка 2", "Переговорная", "Склад"][i],
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
  const legacyPagination = usePaginatedItems(
    visibleTags,
    [business, query, visibleTags.map((tag) => tag.id).join("|")].join("|"),
  );
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
              legacyPagination.pageItems.map((tag) => (
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
        <DataPagination
          page={legacyPagination.page}
          pageCount={legacyPagination.pageCount}
          pageSize={legacyPagination.pageSize}
          totalItems={visibleTags.length}
          onPageChange={legacyPagination.setPage}
        />
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
                placeholder="Например, метка 1"
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
                Выберите другой объект для переноса метки или снимите привязку.
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
                  {selectedBusiness?.name || "Метка без объекта"}
                </strong>
                <small>
                  {selectedBusiness
                    ? selectedBusiness.address
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
                      <div className="association-picker-footer flex items-center justify-between border-t border-[#e8edf4] bg-[#fafcff] px-3 py-2">
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
  const [object, setObject] = useState("Все объекты");
  const [period, setPeriod] = useState("За всё время");
  useOverlayLock(close);
  const employeeRecords = useMemo(
    () =>
      objectsInitial
        .flatMap(getObjectPresenceRecords)
        .filter((record) => record.employee === employee.name),
    [employee.name],
  );
  const employeeObjects = useMemo(
    () => Array.from(new Set(employeeRecords.map((record) => record.object))),
    [employeeRecords],
  );
  const visibleHistory = useMemo(() => {
    const limit =
      period === "Последние 7 дней"
        ? 7
        : period === "Последние 30 дней"
          ? 30
          : Number.POSITIVE_INFINITY;
    const newestRecordTime = Math.max(
      ...employeeRecords.map((record) => new Date(record.enteredAt).getTime()),
      Date.now(),
    );
    const earliestTime = newestRecordTime - limit * 24 * 60 * 60 * 1000;
    return employeeRecords
      .filter((record) => {
        if (object !== "Все объекты" && record.object !== object) return false;
        return new Date(record.enteredAt).getTime() >= earliestTime;
      })
      .sort((a, b) => b.enteredAt.localeCompare(a.enteredAt));
  }, [employeeRecords, object, period]);
  const groupedHistory = useMemo(() => {
    const groups = new Map<string, PresenceRecord[]>();
    visibleHistory.forEach((record) => {
      groups.set(record.object, [...(groups.get(record.object) ?? []), record]);
    });
    return [...groups.entries()];
  }, [visibleHistory]);
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
        aria-label={`Сотрудник ${employee.name}`}
        aria-modal="true"
        role="dialog"
        className="overlay-drawer-panel employee-panel fixed bottom-0 right-0 top-0 z-10 w-[540px] border-l border-[#dfe6ef] bg-white shadow-[-14px_0_36px_rgba(34,51,84,.14)]"
        variants={{ closed: { x: "100%" }, open: { x: 0 } }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: "transform" }}
      >
        <header className="employee-panel-head">
          <div className="employee-panel-chrome-title">
            <strong>Сотрудник</strong>
            <small>Профиль и история посещений</small>
          </div>
          <button
            aria-label="Закрыть карточку сотрудника"
            onClick={close}
            className="employee-panel-close"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </header>
        <section className="employee-panel-profile" aria-label="Основные данные сотрудника">
          <div className="employee-panel-profile-main">
            <div>
              <h2>{employee.name}</h2>
              <p>{employee.role}</p>
            </div>
            <span className={`employee-panel-status ${statusStyle[employee.status]}`}>
              {employee.status}
            </span>
          </div>
          <div className="employee-panel-profile-context">
            <div>
              <Building2 size={15} aria-hidden="true" />
              <span>
                <small>Подрядчик</small>
                <strong>{employee.contractor}</strong>
              </span>
            </div>
            <div>
              <Users size={15} aria-hidden="true" />
              <span>
                <small>Подразделение</small>
                <strong>{employee.dept}</strong>
              </span>
            </div>
          </div>
        </section>
        <div className="overlay-scroll-region employee-panel-content employee-panel-unified-content">
            <section className="employee-panel-quick-contacts" aria-labelledby="employee-contacts-title">
              <header>
                <div>
                  <h3 id="employee-contacts-title">Контакты</h3>
                </div>
              </header>
              <div className="employee-panel-quick-contact-list">
                <a
                  href={`tel:${employee.phone.replace(/[^+\d]/g, "")}`}
                >
                  <span className="employee-panel-contact-icon" aria-hidden="true">
                    <Phone size={16} />
                  </span>
                  <small>Телефон</small>
                  <strong>{employee.phone}</strong>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
                <a
                  href={`mailto:${employee.email}`}
                >
                  <span className="employee-panel-contact-icon" aria-hidden="true">
                    <Mail size={16} />
                  </span>
                  <small>Email</small>
                  <strong>{employee.email}</strong>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </div>
            </section>
            <section className="employee-panel-visits" aria-labelledby="employee-visits-title">
              <header className="employee-panel-visits-head">
                <h3 id="employee-visits-title">Посещения</h3>
                <span>{visibleHistory.length}</span>
              </header>
            <div className="employee-panel-history-filters">
              <div>
                <span>Объект</span>
                <Select
                  value={object}
                  onChange={setObject}
                  options={["Все объекты", ...employeeObjects]}
                />
              </div>
              <div>
                <span>Период</span>
                <Select
                  value={period}
                  onChange={setPeriod}
                  options={["За всё время", "Последние 7 дней", "Последние 30 дней"]}
                />
              </div>
            </div>
            <div className="employee-panel-history-list">
              {groupedHistory.length ? (
                groupedHistory.map(([objectName, records]) => (
                  <EmployeeHistoryGroup
                    key={objectName}
                    object={objectName}
                    address={objectsInitial.find((item) => item.name === objectName)?.address ?? ""}
                    records={records}
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
            </section>
        </div>
      </motion.aside>
    </motion.div>
  );
}

function EmployeeHistoryGroup({
  object,
  address,
  records,
}: {
  object: string;
  address: string;
  records: PresenceRecord[];
}) {
  const events = records
    .flatMap((record) => [
      {
        key: `${record.id}-entry`,
        type: "Вход" as const,
        occurredAt: record.enteredAt,
        record,
      },
      ...(record.leftAt
        ? [{
            key: `${record.id}-exit`,
            type: "Выход" as const,
            occurredAt: record.leftAt,
            record,
          }]
        : []),
    ])
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  return (
    <div className="employee-history-group relative pb-6 pl-7 before:absolute before:bottom-0 before:left-[7px] before:top-3 before:w-px before:bg-[#dbe5f2]">
      <div className="employee-history-marker absolute left-0 top-1 size-[15px] rounded-full border-4 border-[#dcebff] bg-[#2563eb]" />
      <div className="employee-history-card overflow-hidden rounded-xl border border-[#e0e8f2] bg-white">
        <div className="employee-history-head border-b border-[#e8edf4] px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p>{object}</p>
              {address && <small>{address}</small>}
            </div>
            {records.some((record) => !record.leftAt) && (
              <span className="employee-history-active">
                На месте
              </span>
            )}
          </div>
        </div>
        {events.map((event, index) => {
          const date = new Date(event.occurredAt);
          return (
            <div
              key={event.key}
              className={`employee-history-event flex items-center gap-3 px-4 py-3 ${index ? "border-t border-[#eef2f6]" : ""}`}
            >
              <span className="employee-history-event-icon">
                {event.type === "Вход" ? <DoorOpen size={14} /> : <DoorClosed size={14} />}
              </span>
              <div className="min-w-0 flex-1">
                <p>{event.type}</p>
                <small>
                  {date.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                  <span className="px-1">·</span>
                  {roomForRecord(event.record)}
                </small>
              </div>
              <time>
                {date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
              </time>
            </div>
          );
        })}
      </div>
    </div>
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
