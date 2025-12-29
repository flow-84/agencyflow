import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
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
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Allgemeine Geschäftsbedingungen</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 mb-6">
            <strong>Stand:</strong> 29. Dezember 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Geltungsbereich</h2>
            <p className="text-slate-700">
              Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Agency Hub Plattform. Mit der Registrierung und Nutzung unserer Dienste erklären Sie sich mit diesen AGB einverstanden.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Leistungsbeschreibung</h2>
            <p className="text-slate-700 mb-4">
              Agency Hub bietet eine Management-Plattform für Agenturen mit folgenden Funktionen:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Verwaltung von Models und Chattern</li>
              <li>Schichtplanung und -verwaltung</li>
              <li>Schulungsmaterialien und Quizzes</li>
              <li>Dokumentenverwaltung und digitale Unterschriften</li>
              <li>Team-Kommunikation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Registrierung und Benutzerkonto</h2>
            <p className="text-slate-700 mb-4">
              Um unsere Dienste nutzen zu können, müssen Sie ein Benutzerkonto erstellen:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Sie müssen volljährig sein (mindestens 18 Jahre alt)</li>
              <li>Sie müssen wahrheitsgemäße Angaben machen</li>
              <li>Sie sind für die Vertraulichkeit Ihrer Zugangsdaten verantwortlich</li>
              <li>Ein Account ist nicht übertragbar</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Nutzungsrechte und Pflichten</h2>
            <p className="text-slate-700 mb-4">
              Bei der Nutzung unserer Plattform verpflichten Sie sich:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Die Plattform nur für rechtmäßige Zwecke zu nutzen</li>
              <li>Keine rechtswidrigen, beleidigenden oder schädlichen Inhalte hochzuladen</li>
              <li>Keine Schadsoftware oder Viren zu verbreiten</li>
              <li>Die Rechte Dritter zu respektieren</li>
              <li>Keine unbefugten Zugriffe auf Systeme zu unternehmen</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Bewerbungen</h2>
            <p className="text-slate-700">
              Bewerbungen über unsere Plattform stellen keine Garantie für eine Zusammenarbeit dar. Wir behalten uns das Recht vor, Bewerbungen nach eigenem Ermessen anzunehmen oder abzulehnen.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Verträge und Dokumente</h2>
            <p className="text-slate-700">
              Digitale Unterschriften über unsere Plattform sind rechtlich bindend. Durch Ihre digitale Unterschrift bestätigen Sie, dass Sie das Dokument gelesen und verstanden haben.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Vergütung und Zahlungsbedingungen</h2>
            <p className="text-slate-700">
              Vergütungsmodalitäten werden in separaten Verträgen zwischen der Agentur und den Mitarbeitern geregelt. Die Plattform dient lediglich der Verwaltung und Organisation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Haftung</h2>
            <p className="text-slate-700 mb-4">
              Unsere Haftung ist wie folgt beschränkt:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Bei Vorsatz und grober Fahrlässigkeit haften wir unbeschränkt</li>
              <li>Bei leichter Fahrlässigkeit haften wir nur bei Verletzung wesentlicher Vertragspflichten</li>
              <li>Wir haften nicht für mittelbare Schäden oder entgangenen Gewinn</li>
              <li>Die Haftung ist auf den vorhersehbaren, typischerweise eintretenden Schaden begrenzt</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Verfügbarkeit</h2>
            <p className="text-slate-700">
              Wir bemühen uns um eine hohe Verfügbarkeit der Plattform, können jedoch keine 100%ige Verfügbarkeit garantieren. Wartungsarbeiten werden nach Möglichkeit angekündigt.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Kündigung</h2>
            <p className="text-slate-700">
              Beide Parteien können das Nutzungsverhältnis jederzeit ohne Angabe von Gründen kündigen. Bei Verstößen gegen diese AGB behalten wir uns das Recht vor, Konten sofort zu sperren.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. Änderungen der AGB</h2>
            <p className="text-slate-700">
              Wir behalten uns das Recht vor, diese AGB jederzeit zu ändern. Änderungen werden den Nutzern per E-Mail mitgeteilt und gelten als akzeptiert, wenn nicht innerhalb von 14 Tagen widersprochen wird.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">12. Salvatorische Klausel</h2>
            <p className="text-slate-700">
              Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen hiervon unberührt.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">13. Anwendbares Recht</h2>
            <p className="text-slate-700">
              Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">14. Kontakt</h2>
            <p className="text-slate-700">
              Bei Fragen zu diesen AGB wenden Sie sich bitte an:
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