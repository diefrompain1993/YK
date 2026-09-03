import {
  Check,
  ChevronRight,
  Mail,
  Pencil,
  Phone,
  Plus,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import "../styles/user-settings.css";

export type AdminAccessRole = "Администратор" | "Пользователь";

export type AdminUser = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  position: string;
  accessRole: AdminAccessRole;
  objects: string[];
  active: boolean;
};

export type AdminUsersSettingsProps = {
  objectNames: string[];
  toast: (message: string) => void;
  users?: AdminUser[];
  onUsersChange?: (users: AdminUser[]) => void;
  onAssignmentsChange?: (user: AdminUser) => void;
};

type UserDraft = Omit<AdminUser, "accessRole"> & {
  accessRole: AdminAccessRole | "";
};
type FieldErrors = Partial<
  Record<
    "fullName" | "phone" | "email" | "position" | "accessRole" | "objects",
    string
  >
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function uniqueObjectNames(names: string[]) {
  return Array.from(new Set(names.map((name) => name.trim()).filter(Boolean)));
}

export function createInitialAdminUsers(objects: string[]): AdminUser[] {
  return [
    {
      id: "admin-anna-morozova",
      fullName: "Анна Морозова",
      phone: "+7 916 440-18-72",
      email: "a.morozova@ukp.ru",
      position: "Руководитель эксплуатации",
      accessRole: "Администратор",
      objects: [...objects],
      active: true,
    },
    {
      id: "admin-mikhail-volkov",
      fullName: "Михаил Волков",
      phone: "+7 985 310-42-08",
      email: "m.volkov@ukp.ru",
      position: "Начальник смены",
      accessRole: "Пользователь",
      objects: objects.slice(0, Math.min(2, objects.length)),
      active: true,
    },
    {
      id: "admin-olga-lebedeva",
      fullName: "Ольга Лебедева",
      phone: "+7 903 725-60-14",
      email: "o.lebedeva@ukp.ru",
      position: "Инженер по эксплуатации",
      accessRole: "Пользователь",
      objects: objects.slice(0, 1),
      active: false,
    },
  ];
}

function emptyDraft(): UserDraft {
  return {
    id: `admin-${Date.now()}`,
    fullName: "",
    phone: "",
    email: "",
    position: "",
    accessRole: "",
    objects: [],
    active: true,
  };
}

function objectSummary(assigned: string[], allObjects: string[]) {
  if (!assigned.length) return "Не назначены";
  if (allObjects.length > 0 && assigned.length === allObjects.length) {
    return "Все объекты";
  }
  if (assigned.length <= 2) return assigned.join(", ");
  return `${assigned.slice(0, 2).join(", ")} и ещё ${assigned.length - 2}`;
}

function openFromKeyboard(
  event: KeyboardEvent<HTMLTableRowElement>,
  action: () => void,
) {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  action();
}

export function AdminUsersSettings({
  objectNames,
  toast,
  users: controlledUsers,
  onUsersChange,
  onAssignmentsChange,
}: AdminUsersSettingsProps) {
  const objects = useMemo(() => uniqueObjectNames(objectNames), [objectNames]);
  const [localUsers, setLocalUsers] = useState<AdminUser[]>(() =>
    createInitialAdminUsers(objects),
  );
  const users = controlledUsers ?? localUsers;
  const [draft, setDraft] = useState<UserDraft | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const drawerTitleId = useId();
  const drawerRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!draft) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDrawer();
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
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

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [draft]);

  const openAdd = () => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setEditingId(null);
    setErrors({});
    setDraft(emptyDraft());
  };

  const openEdit = (user: AdminUser) => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setEditingId(user.id);
    setErrors({});
    setDraft({
      ...user,
      objects: user.objects.filter((name) => objects.includes(name)),
    });
  };

  const closeDrawer = () => {
    setDraft(null);
    setEditingId(null);
    setErrors({});
    window.requestAnimationFrame(() => returnFocusRef.current?.focus());
  };

  const updateDraft = <K extends keyof UserDraft>(
    field: K,
    value: UserDraft[K],
  ) => {
    setDraft((current) => (current ? { ...current, [field]: value } : current));
    setErrors((current) => {
      const next = { ...current };
      delete next[field as keyof FieldErrors];
      return next;
    });
  };

  const toggleObject = (name: string) => {
    if (!draft) return;
    const selected = draft.objects.includes(name)
      ? draft.objects.filter((objectName) => objectName !== name)
      : [...draft.objects, name];
    updateDraft("objects", selected);
  };

  const validate = (user: UserDraft) => {
    const nextErrors: FieldErrors = {};
    if (!user.fullName.trim()) nextErrors.fullName = "Укажите ФИО";
    if (!user.phone.trim()) nextErrors.phone = "Укажите телефон";
    if (!user.email.trim()) nextErrors.email = "Укажите email";
    else if (!EMAIL_PATTERN.test(user.email.trim())) {
      nextErrors.email = "Проверьте адрес email";
    }
    if (!user.position.trim()) nextErrors.position = "Укажите должность";
    if (!user.accessRole) nextErrors.accessRole = "Выберите роль доступа";
    if (!user.objects.length) {
      nextErrors.objects = objects.length
        ? "Выберите хотя бы один объект"
        : "Сначала добавьте объект";
    }
    return nextErrors;
  };

  const saveUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft) return;

    const nextErrors = validate(draft);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    if (!draft.accessRole) return;
    const saved: AdminUser = {
      ...draft,
      fullName: draft.fullName.trim(),
      phone: draft.phone.trim(),
      email: draft.email.trim(),
      position: draft.position.trim(),
      objects: objects.filter((name) => draft.objects.includes(name)),
    };

    if (editingId) {
      const nextUsers = users.map((user) =>
        user.id === editingId ? saved : user,
      );
      if (!controlledUsers) setLocalUsers(nextUsers);
      onUsersChange?.(nextUsers);
      toast(`Данные пользователя ${saved.fullName} обновлены`);
    } else {
      const nextUsers = [...users, saved];
      if (!controlledUsers) setLocalUsers(nextUsers);
      onUsersChange?.(nextUsers);
      toast(`Пользователь ${saved.fullName} добавлен`);
    }
    onAssignmentsChange?.(saved);
    closeDrawer();
  };

  return (
    <section className="aus-settings" aria-labelledby="admin-users-title">
      <div className="aus-panel">
        <div className="aus-panel-head">
          <div>
            <h2 id="admin-users-title">Пользователи</h2>
            <p>Роль доступа, должность и назначенные объекты</p>
          </div>
          <button className="aus-primary-button" type="button" onClick={openAdd}>
            <Plus size={16} aria-hidden="true" />
            Добавить пользователя
          </button>
        </div>

        <div className="aus-table-wrap aus-table-wrap--settings-scroll">
          <table className="aus-table">
            <thead>
              <tr>
                <th>Пользователь</th>
                <th>Должность</th>
                <th>Доступ</th>
                <th>Объекты</th>
                <th>Контакты</th>
                <th>Статус</th>
                <th aria-label="Изменить" />
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const assignedObjects = user.objects.filter((name) =>
                  objects.includes(name),
                );
                const summary = objectSummary(assignedObjects, objects);

                return (
                  <tr
                    className="aus-user-row"
                    key={user.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Изменить пользователя ${user.fullName}`}
                    onClick={() => openEdit(user)}
                    onKeyDown={(event) => {
                      if (event.target === event.currentTarget) {
                        openFromKeyboard(event, () => openEdit(user));
                      }
                    }}
                  >
                    <td data-label="Пользователь">
                      <div className="aus-person">
                        <strong>{user.fullName}</strong>
                      </div>
                    </td>
                    <td data-label="Должность">
                      <span className="aus-long-value" title={user.position}>
                        {user.position}
                      </span>
                    </td>
                    <td data-label="Доступ">
                      <span
                        className={`aus-role-badge ${user.accessRole === "Пользователь" ? "is-user" : "is-admin"}`}
                      >
                        {user.accessRole}
                      </span>
                    </td>
                    <td data-label="Объекты">
                      <span className="aus-long-value" title={assignedObjects.join(", ")}>
                        {summary}
                      </span>
                    </td>
                    <td data-label="Контакты">
                      <span className="aus-contact-line">
                        <Phone size={13} aria-hidden="true" />
                        {user.phone}
                      </span>
                      <span className="aus-contact-line aus-contact-email">
                        <Mail size={13} aria-hidden="true" />
                        {user.email}
                      </span>
                    </td>
                    <td data-label="Статус">
                      <span
                        className={`aus-status ${user.active ? "is-active" : "is-inactive"}`}
                      >
                        <i aria-hidden="true" />
                        {user.active ? "Активен" : "Отключён"}
                      </span>
                    </td>
                    <td className="aus-action-cell">
                      <button
                        className="aus-edit-button"
                        type="button"
                        aria-label={`Изменить ${user.fullName}`}
                        onClick={(event: MouseEvent<HTMLButtonElement>) => {
                          event.stopPropagation();
                          openEdit(user);
                        }}
                      >
                        <Pencil size={16} aria-hidden="true" />
                        <ChevronRight
                          className="aus-mobile-chevron"
                          size={18}
                          aria-hidden="true"
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {draft && (
        <div className="aus-drawer-layer" role="presentation">
          <button
            className="aus-drawer-backdrop"
            type="button"
            aria-label="Закрыть форму"
            onClick={closeDrawer}
          />
          <aside
            ref={drawerRef}
            className="aus-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={drawerTitleId}
          >
            <form onSubmit={saveUser} noValidate>
              <header className="aus-drawer-head">
                <div>
                  <span className="aus-drawer-icon" aria-hidden="true">
                    <UserRound size={20} />
                  </span>
                  <div>
                    <p>{editingId ? "Пользователь" : "Новый пользователь"}</p>
                    <h2 id={drawerTitleId}>
                      {editingId ? "Изменить данные" : "Добавить пользователя"}
                    </h2>
                  </div>
                </div>
                <button
                  className="aus-close-button"
                  type="button"
                  aria-label="Закрыть"
                  onClick={closeDrawer}
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </header>

              <div className="aus-drawer-body">
                <div className="aus-field">
                  <label htmlFor="aus-full-name">ФИО</label>
                  <input
                    id="aus-full-name"
                    autoFocus
                    value={draft.fullName}
                    aria-invalid={Boolean(errors.fullName)}
                    onChange={(event) => updateDraft("fullName", event.target.value)}
                    placeholder="Иван Петров"
                  />
                  {errors.fullName && <small>{errors.fullName}</small>}
                </div>

                <div className="aus-fields-row">
                  <div className="aus-field">
                    <label htmlFor="aus-phone">Телефон</label>
                    <input
                      id="aus-phone"
                      type="tel"
                      value={draft.phone}
                      aria-invalid={Boolean(errors.phone)}
                      onChange={(event) => updateDraft("phone", event.target.value)}
                      placeholder="+7 900 000-00-00"
                    />
                    {errors.phone && <small>{errors.phone}</small>}
                  </div>
                  <div className="aus-field">
                    <label htmlFor="aus-email">Email</label>
                    <input
                      id="aus-email"
                      type="email"
                      value={draft.email}
                      aria-invalid={Boolean(errors.email)}
                      onChange={(event) => updateDraft("email", event.target.value)}
                      placeholder="name@company.ru"
                    />
                    {errors.email && <small>{errors.email}</small>}
                  </div>
                </div>

                <div className="aus-field">
                  <label htmlFor="aus-position">Должность</label>
                  <input
                    id="aus-position"
                    value={draft.position}
                    aria-invalid={Boolean(errors.position)}
                    onChange={(event) => updateDraft("position", event.target.value)}
                    placeholder="Например: начальник смены"
                  />
                  {errors.position && <small>{errors.position}</small>}
                </div>

                <fieldset className="aus-fieldset">
                  <legend>Роль доступа</legend>
                  <div className="aus-role-options">
                    {(["Администратор", "Пользователь"] as const).map((role) => (
                      <button
                        className={`aus-role-option ${draft.accessRole === role ? "is-selected" : ""}`}
                        type="button"
                        key={role}
                        role="radio"
                        aria-checked={draft.accessRole === role}
                        onClick={() => updateDraft("accessRole", role)}
                      >
                        <span className="aus-role-option-icon" aria-hidden="true">
                          {draft.accessRole === role ? (
                            <Check size={16} />
                          ) : (
                            <ShieldCheck size={16} />
                          )}
                        </span>
                        <span>
                          <strong>{role}</strong>
                          <small>
                            {role === "Администратор"
                              ? "Управление пользователями и объектами"
                              : "Работа с назначенными объектами"}
                          </small>
                        </span>
                      </button>
                    ))}
                  </div>
                  {errors.accessRole && (
                    <small className="aus-fieldset-error">{errors.accessRole}</small>
                  )}
                </fieldset>

                <fieldset className="aus-fieldset">
                  <div className="aus-fieldset-heading">
                    <legend>Доступ к объектам</legend>
                    <span>
                      {draft.objects.length} из {objects.length}
                    </span>
                  </div>
                  {objects.length ? (
                    <div className="aus-object-picker">
                      <label className="aus-object-option aus-select-all">
                        <input
                          type="checkbox"
                          checked={draft.objects.length === objects.length}
                          onChange={(event) =>
                            updateDraft("objects", event.target.checked ? [...objects] : [])
                          }
                        />
                        <span className="aus-checkmark" aria-hidden="true">
                          <Check size={14} />
                        </span>
                        <strong>Все объекты</strong>
                      </label>
                      <div className="aus-object-list">
                        {objects.map((name) => (
                          <label className="aus-object-option" key={name}>
                            <input
                              type="checkbox"
                              checked={draft.objects.includes(name)}
                              onChange={() => toggleObject(name)}
                            />
                            <span className="aus-checkmark" aria-hidden="true">
                              <Check size={14} />
                            </span>
                            <span title={name}>{name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="aus-no-objects">Объекты ещё не добавлены.</p>
                  )}
                  {errors.objects && (
                    <small className="aus-fieldset-error">{errors.objects}</small>
                  )}
                </fieldset>

                <label className="aus-active-control">
                  <span>
                    <strong>Пользователь активен</strong>
                    <small>Можно войти в систему</small>
                  </span>
                  <input
                    type="checkbox"
                    checked={draft.active}
                    onChange={(event) => updateDraft("active", event.target.checked)}
                  />
                  <span className="aus-switch" aria-hidden="true" />
                </label>
              </div>

              <footer className="aus-drawer-foot">
                <button
                  className="aus-secondary-button"
                  type="button"
                  onClick={closeDrawer}
                >
                  Отмена
                </button>
                <button className="aus-primary-button" type="submit">
                  {editingId ? "Сохранить" : "Добавить"}
                </button>
              </footer>
            </form>
          </aside>
        </div>
      )}
    </section>
  );
}

export default AdminUsersSettings;
