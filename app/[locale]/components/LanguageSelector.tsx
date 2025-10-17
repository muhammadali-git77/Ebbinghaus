"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
    { code: "uz", name: "O'zbek", flag: "🇺🇿" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
  ];

  const handleLanguageChange = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const currentLanguage = languages.find((lang) => lang.code === locale);

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <span className="text-lg">{currentLanguage?.flag}</span>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        {languages.map((language) => (
          <li key={language.code}>
            <button
              onClick={() => handleLanguageChange(language.code)}
              className={`flex items-center gap-2 ${
                locale === language.code ? "active" : ""
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              {language.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
