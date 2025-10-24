import { locale, Localized } from "@/libs/locale/mod.ts";
import { immutable } from "@hazae41/immutable";
import { Rewind } from "@hazae41/rewind";
import React, { ReactNode, useEffect, useState } from "react";
import { hydrateRoot } from "react-dom/client";

React;

const AnUpdateIsAvailable = (origin: string) => ({
  en: `An update of ${origin} is available. Do you want to update now?`,
  zh: `有可用的 ${origin} 更新。您想现在更新吗？`,
  hi: `${origin} का एक अपडेट उपलब्ध है। क्या आप अभी अपडेट करना चाहते हैं?`,
  es: `Hay una actualización de ${origin} disponible. ¿Quieres actualizar ahora?`,
  ar: `يتوفر تحديث لـ ${origin}. هل تريد التحديث الآن؟`,
  fr: `Une mise à jour de ${origin} est disponible. Voulez-vous mettre à jour maintenant ?`,
  de: `Ein Update von ${origin} ist verfügbar. Möchten Sie jetzt aktualisieren?`,
  ru: `Доступно обновление для ${origin}. Вы хотите обновить сейчас?`,
  pt: `Uma atualização de ${origin} está disponível. Você quer atualizar agora?`,
  ja: `${origin} のアップデートが利用可能です。今すぐアップデートしますか？`,
  pa: `${origin} ਦਾ ਇੱਕ ਅੱਪਡੇਟ ਉਪਲਬਧ ਹੈ। ਕੀ ਤੁਸੀਂ ਹੁਣ ਅੱਪਡੇਟ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ؟`,
  bn: `${origin} এর একটি আপডেট উপলব্ধ। আপনি কি এখনই আপডেট করতে চান?`,
  id: `Pembaruan dari ${origin} tersedia. Apakah Anda ingin memperbarui sekarang?`,
  ur: `کے لیے ایک اپ ڈیٹ ${origin} دستیاب ہے۔ کیا آپ ابھی اپ ڈیٹ کرنا چاہتے ہیں؟`,
  ms: `Kemas kini untuk ${origin} tersedia. Adakah anda mahu mengemas kini sekarang?`,
  it: `È disponibile un aggiornamento per ${origin}. Vuoi aggiornare ora?`,
  tr: `${origin} için bir güncelleme mevcut. Şimdi güncellemek ister misiniz?`,
  ta: `${origin} க்கான ஒரு புதுப்பிப்பு கிடைக்கிறது. நீங்கள் இப்போது புதுப்பிக்க விரும்புகிறீர்களா?`,
  te: `${origin} కోసం ఒక అప్‌డేట్ అందుబాటులో ఉంది. మీరు ఇప్పుడు అప్‌డేట్ చేయాలనుకుంటున్నారా?`,
  ko: `${origin}의 업데이트가 있습니다. 지금 업데이트하시겠습니까?`,
  vi: `Có bản cập nhật của ${origin} sẵn có. Bạn có muốn cập nhật ngay bây giờ không?`,
  pl: `Dostępna jest aktualizacja ${origin}. Czy chcesz zaktualizować teraz?`,
  ro: `O actualizare pentru ${origin} este disponibilă. Doriți să actualizați acum?`,
  nl: `Er is een update van ${origin} beschikbaar. Wilt u nu updaten?`,
  el: `Υπάρχει μια ενημέρωση για το ${origin}. Θέλετε να ενημερώσετε τώρα;`,
  th: `มีการอัปเดตของ ${origin} คุณต้องการอัปเดตตอนนี้หรือไม่?`,
  cs: `Je k dispozici aktualizace ${origin}. Chcete nyní aktualizovat?`,
  hu: `Elérhető egy frissítés a ${origin} számára. Szeretne most frissíteni?`,
  sv: `En uppdatering av ${origin} är tillgänglig. Vill du uppdatera nu?`,
  da: `En opdatering af ${origin} er tilgængelig. Vil du opdatere nu?`,
} satisfies Localized)

const HelloWorld = {
  en: "Hello world",
  zh: "你好，世界",
  hi: "नमस्ते दुनिया",
  es: "Hola mundo",
  ar: "مرحبا بالعالم",
  fr: "Bonjour le monde",
  de: "Hallo Welt",
  ru: "Привет, мир",
  pt: "Olá mundo",
  ja: "こんにちは世界",
  pa: "ਹੈਲੋ ਵਰਲਡ",
  bn: "হ্যালো ওয়ার্ল্ড",
  id: "Halo dunia",
  ur: "ہیلو ورلڈ",
  ms: "Hai dunia",
  it: "Ciao mondo",
  tr: "Merhaba dünya",
  ta: "ஹலோ வேர்ல்ட்",
  te: "హలో వరల్డ్",
  ko: "안녕하세요 세계",
  vi: "Xin chào thế giới",
  pl: "Witaj świecie",
  ro: "Salut lume",
  nl: "Hallo wereld",
  el: "Γειά σου κόσμε",
  th: "สวัสดีชาวโลก",
  cs: "Ahoj světe",
  hu: "Helló világ",
  sv: "Hej världen",
  da: "Hej verden",
} satisfies Localized

async function upgrade() {
  if (navigator.serviceWorker.controller != null)
    navigator.serviceWorker.addEventListener("controllerchange", () => location.reload())

  const { registration, update } = await immutable.serviceWorker.register("/service.worker.js", { type: "module", scope: "/", updateViaCache: "all" })

  if (update == null)
    return registration
  if (!confirm(AnUpdateIsAvailable(location.origin)[locale.current]))
    return registration

  return await update()
}

function Page() {
  const [client, setClient] = useState(false)

  useEffect(() => {
    setClient(true)
  }, [])

  useEffect(() => {
    upgrade().then(console.log).catch(console.error)
  }, [])

  if (!client && locale.current !== document.documentElement.lang)
    return null

  return <div className="text-2xl font-sans">
    {HelloWorld[locale.current]}
  </div>
}

// @ts-ignore: process not found
// deno-lint-ignore no-process-global
if (process.env.PLATFORM === "browser") {
  await new Rewind(document).hydrateOrThrow().then(() => hydrateRoot(document.body, <Page />))
} else {
  const params = new URLSearchParams(location.search)

  document.documentElement.lang = params.get("locale")

  const prerender = async (node: ReactNode) => {
    const ReactDOM = await import("react-dom/static")

    using stack = new DisposableStack()

    const stream = await ReactDOM.default.prerender(node)
    const reader = stream.prelude.getReader()

    stack.defer(() => reader.releaseLock())

    let html = ""

    for (let result = await reader.read(); !result.done; result = await reader.read())
      html += new TextDecoder().decode(result.value)

    return html
  }

  document.body.innerHTML = await prerender(<Page />)

  await new Rewind(document).prerenderOrThrow()
}