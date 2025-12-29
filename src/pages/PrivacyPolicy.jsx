import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link to={createPageUrl('Landing')}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Zurück
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Datenschutzerklärung</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 mb-6">
            <strong>Stand:</strong> 29. Dezember 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Verantwortliche Stelle</h2>
            <p className="text-slate-700">
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:
            </p>
            <p className="text-slate-700 mt-2">
              [Firmenname]<br />
              [Adresse]<br />
              [E-Mail]<br />
              [Telefon]
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Erhebung und Speicherung personenbezogener Daten</h2>
            <p className="text-slate-700 mb-4">
              Wir erheben und verarbeiten folgende personenbezogene Daten:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Name und E-Mail-Adresse bei der Registrierung</li>
              <li>Profilinformationen (freiwillig bereitgestellt)</li>
              <li>Bewerbungsdaten und hochgeladene Dokumente</li>
              <li>Nutzungsdaten zur Verbesserung unserer Dienste</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Zweck der Datenverarbeitung</h2>
            <p className="text-slate-700 mb-4">
              Ihre Daten werden zu folgenden Zwecken verarbeitet:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Bereitstellung und Verwaltung Ihres Benutzerkontos</li>
              <li>Bearbeitung von Bewerbungen</li>
              <li>Kommunikation mit Ihnen über unsere Plattform</li>
              <li>Verbesserung unserer Dienste und Benutzererfahrung</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Rechtsgrundlage</h2>
            <p className="text-slate-700">
              Die Verarbeitung Ihrer personenbezogenen Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. a, b und f DSGVO.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Weitergabe von Daten</h2>
            <p className="text-slate-700">
              Wir geben Ihre personenbezogenen Daten nur an Dritte weiter, wenn:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Sie ausdrücklich eingewilligt haben</li>
              <li>dies zur Erfüllung vertraglicher Pflichten erforderlich ist</li>
              <li>eine gesetzliche Verpflichtung besteht</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Speicherdauer</h2>
            <p className="text-slate-700">
              Wir speichern Ihre personenbezogenen Daten nur so lange, wie dies für die Erfüllung der genannten Zwecke erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Ihre Rechte</h2>
            <p className="text-slate-700 mb-4">
              Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
              <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
              <li>Recht auf Löschung (Art. 17 DSGVO)</li>
              <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruchsrecht (Art. 21 DSGVO)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Cookies und Tracking</h2>
            <p className="text-slate-700">
              Diese Website verwendet Cookies, um die Nutzererfahrung zu verbessern. Sie können Ihre Browser-Einstellungen anpassen, um Cookies zu blockieren.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Sicherheit</h2>
            <p className="text-slate-700">
              Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre Daten gegen unbeabsichtigte oder unrechtmäßige Löschung, Veränderung oder Verlust sowie gegen unbefugte Weitergabe oder unbefugten Zugriff zu schützen.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Kontakt</h2>
            <p className="text-slate-700">
              Bei Fragen zur Verarbeitung Ihrer personenbezogenen Daten wenden Sie sich bitte an:
            </p>
            <p className="text-slate-700 mt-2">
              [E-Mail-Adresse]
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}