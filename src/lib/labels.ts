import type {
  ContractPartyRole,
  ContractType,
  Gender,
  PartyType,
  PropertyType,
  UserRole,
} from "@/lib/api/types";

export const messages = {
  appName: "سامانه املاک",
  appTagline: "مدیریت قرارداد و مشاورین",
  loading: "در حال بارگذاری…",
  loadingSession: "در حال بررسی نشست کاربری…",
  loadingPdf: "در حال بارگذاری پیش‌نویس قرارداد…",
  loadFailed: "بارگذاری اطلاعات با خطا مواجه شد",
  createFailed: "ثبت اطلاعات انجام نشد",
  saveFailed: "ذخیره انجام نشد",
  deleteFailed: "حذف انجام نشد",
  loginFailed: "ورود ناموفق بود",
  requiredField: "وارد کردن این فیلد الزامی است",
  none: "—",
  yes: "بله",
  no: "خیر",
  open: "مشاهده",
  edit: "ویرایش",
  delete: "حذف",
  add: "افزودن",
  remove: "حذف",
  close: "بستن",
  back: "قبلی",
  next: "بعدی",
  save: "ذخیره",
  print: "چاپ",
  selectOrCreate: "انتخاب یا ثبت جدید",
  noneSelected: "موردی انتخاب نشده است",
  createAndSelect: "ثبت و انتخاب",
  creating: "در حال ثبت…",
  saving: "در حال ذخیره…",
  signingIn: "در حال ورود…",
  signIn: "ورود به سامانه",
  signedIn: "با موفقیت وارد شدید",
  logOut: "خروج",
  created: "با موفقیت ثبت شد",
  deleted: "با موفقیت حذف شد",
  actions: "عملیات",
} as const;

export const propertyTypeLabels: Record<PropertyType, string> = {
  APARTMENT: "آپارتمان",
  HOUSE: "خانه",
  VILLA: "ویلا",
  LAND: "زمین",
  OFFICE: "دفتر اداری",
  SHOP: "مغازه",
  WAREHOUSE: "انبار",
  OTHER: "سایر",
};

export const contractTypeLabels: Record<ContractType, string> = {
  SALE: "مبایعه‌نامه",
  RENT: "رهن و اجاره",
  GOODWILL: "سرقفلی",
  PRE_SALE: "پیش‌فروش",
  MUTUAL_RESCISSION: "فسخ توافقی",
  CONSTRUCTION_JOINT_VENTURE: "مشارکت در ساخت",
};

export const partyTypeLabels: Record<PartyType, string> = {
  PERSON: "شخص حقیقی",
  COMPANY: "شخص حقوقی",
};

export const genderLabels: Record<Gender, string> = {
  MALE: "مرد",
  FEMALE: "زن",
  OTHER: "سایر",
};

export const userRoleLabels: Record<UserRole, string> = {
  ADMIN: "مدیر سامانه",
  OWNER: "مالک آژانس",
  MANAGER: "مدیر",
  AGENT: "مشاور املاک",
  ASSISTANT: "دستیار",
};

export const contractPartyRoleLabels: Record<ContractPartyRole, string> = {
  FIRST_PARTY: "طرف اول",
  SECOND_PARTY: "طرف دوم",
  WITNESS: "شاهد",
};

export function yn(value: boolean | null | undefined) {
  if (value == null) return messages.none;
  return value ? messages.yes : messages.no;
}
