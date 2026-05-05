/*
  Diseño elegido: bitácora deportiva de alto rendimiento basada en Swiss International Style.
  Este componente debe reforzar claridad, disciplina visual, tablas legibles, color funcional por rutina
  y una experiencia de registro rápida para usar durante la sesión de gimnasio.
*/

import { useMemo, useState } from "react";
import { ClipboardList, Dice5, Download, Dumbbell, ExternalLink, RotateCcw, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { getAllWorkoutLogs, saveWorkoutLog, type ExerciseLog } from "@/lib/workoutStorage";
import { useAuth } from "@/contexts/AuthContext";

type RoutineType = "Full Body" | "Push" | "Pull" | "Legs";

type Exercise = {
  name: string;
  description: string;
};

type Session = {
  id: string;
  type: RoutineType;
  day: string;
  focus: string;
  exercises: Exercise[];
};

const DICE_URL = "https://d2xsxph8kpxj0f.cloudfront.net/109165107/VcNY2f88iSvmUCDJYXfGZH/workout-generator-dice-emblem-UFnusHbekkgQDjGYSNTFR3.webp";
const PAPER_URL = "https://d2xsxph8kpxj0f.cloudfront.net/109165107/VcNY2f88iSvmUCDJYXfGZH/workout-generator-technical-paper-9yYAzfPhkaY4hu5Pv78BMC.webp";
const SHEETS_URL = "https://d2xsxph8kpxj0f.cloudfront.net/109165107/VcNY2f88iSvmUCDJYXfGZH/workout-generator-session-sheets-PKqsX7YyHZFvThzCeweEDN.webp";

const ROUTINES: Session[] = [
  {
    id: "fullbody-1",
    type: "Full Body",
    day: "Día 1",
    focus: "Fuerza y base",
    exercises: [
      { name: "Sentadilla", description: "Base para masa general de piernas y progresión pesada." },
      { name: "Press Plano", description: "Empuje horizontal clásico para pecho, hombro anterior y tríceps." },
      { name: "Pull-up / Dominadas", description: "Constructor principal de dorsales y fuerza relativa." },
      { name: "Peso Muerto Rumano", description: "Enfoque en isquios, glúteos y control de bisagra de cadera." },
      { name: "Press Militar", description: "Empuje vertical para hombros y estabilidad del tronco." },
      { name: "Curl Predicador", description: "Aislamiento de bíceps reduciendo impulso y trampas." },
      { name: "Extensión Tríceps Overhead", description: "Énfasis en la cabeza larga del tríceps." },
    ],
  },
  {
    id: "fullbody-2",
    type: "Full Body",
    day: "Día 2",
    focus: "Hipertrofia y estabilidad",
    exercises: [
      { name: "Prensa Inclinada", description: "Carga alta en piernas con mayor estabilidad." },
      { name: "Press Inclinado Mancuernas", description: "Prioridad al pectoral superior y rango amplio." },
      { name: "Remo en T Apoyado", description: "Espalda media sin fatiga excesiva lumbar." },
      { name: "Zancadas Caminando", description: "Trabajo unilateral dinámico para glúteos y piernas." },
      { name: "Elevaciones Laterales Polea", description: "Tensión constante para deltoides lateral." },
      { name: "Bayesian Curl", description: "Bíceps en posición de máximo estiramiento." },
      { name: "Rueda Abdominal", description: "Core fuerte y transferencia a movimientos pesados." },
    ],
  },
  {
    id: "fullbody-3",
    type: "Full Body",
    day: "Día 3",
    focus: "Cadena posterior",
    exercises: [
      { name: "Peso Muerto Convencional", description: "Fuerza total y densidad de cadena posterior." },
      { name: "Fondos Lastrados", description: "Constructor potente de pecho y tríceps." },
      { name: "Lat Pullover Máquina", description: "Aislamiento puro de dorsales con poca intervención del bíceps." },
      { name: "Hip Thrust", description: "Contracción fuerte del glúteo mayor." },
      { name: "Face Pulls / Pec Deck Inverso", description: "Salud del hombro y deltoides posterior." },
      { name: "Curl Isquio Sentado", description: "Aislamiento de isquiotibiales en posición ventajosa." },
      { name: "Gemelos de Pie", description: "Estimulación directa del gastrocnemio." },
    ],
  },
  {
    id: "fullbody-4",
    type: "Full Body",
    day: "Día 4",
    focus: "Especialización y detalle",
    exercises: [
      { name: "Sentadilla Hack", description: "Aislamiento fuerte de cuádriceps con estabilidad." },
      { name: "Pec Deck", description: "Tensión constante para pectoral y control del recorrido." },
      { name: "Remo Barra / Mancuerna", description: "Tracción horizontal para densidad de espalda." },
      { name: "Extensiones de Cuádriceps", description: "Detalle final y bombeo del cuádriceps." },
      { name: "Shrugs", description: "Desarrollo del trapecio superior." },
      { name: "Curls de Antebrazo", description: "Agarre, estética y resistencia del antebrazo." },
      { name: "Neck Curls", description: "Trabajo accesorio para cuello y postura." },
    ],
  },
  {
    id: "push-1",
    type: "Push",
    day: "Día 1",
    focus: "Empuje pesado",
    exercises: [
      { name: "Press Plano Barra", description: "Base de fuerza para pectoral y tríceps." },
      { name: "Press Militar Barra", description: "Empuje vertical pesado para hombros." },
      { name: "Fondos Lastrados", description: "Pecho inferior y tríceps con gran transferencia." },
      { name: "Press Inclinado Mancuernas", description: "Haz clavicular y rango amplio." },
      { name: "Elevaciones Laterales Mancuernas", description: "Deltoides lateral y amplitud visual." },
      { name: "Press Francés EZ", description: "Extensión pesada para tríceps." },
      { name: "Extensiones en Polea", description: "Aislamiento final y bombeo controlado." },
    ],
  },
  {
    id: "push-2",
    type: "Push",
    day: "Día 2",
    focus: "Hipertrofia y estabilidad",
    exercises: [
      { name: "Press Inclinado Smith", description: "Estabilidad máxima para pectoral superior." },
      { name: "Press Hombros Sentado", description: "Hipertrofia del deltoides anterior." },
      { name: "Pec Deck", description: "Aislamiento de pecho con tensión constante." },
      { name: "Elevaciones Laterales Polea", description: "Tensión en estiramiento para hombro lateral." },
      { name: "Extensión Tríceps Overhead", description: "Cabeza larga del tríceps." },
      { name: "Press Cerrado", description: "Empuje horizontal con énfasis en tríceps." },
      { name: "Flexiones", description: "Bombeo final de pecho y hombros." },
    ],
  },
  {
    id: "push-3",
    type: "Push",
    day: "Día 3",
    focus: "Especialización y detalle",
    exercises: [
      { name: "Press Plano Mancuernas", description: "Rango amplio para pectoral." },
      { name: "Press Arnold", description: "Trabajo completo del deltoides." },
      { name: "Cruce de Poleas Altas", description: "Énfasis en parte baja e interna del pecho." },
      { name: "Vuelos Laterales Máquina", description: "Aislamiento estable del hombro lateral." },
      { name: "Patada Tríceps Polea", description: "Contracción máxima del tríceps." },
      { name: "Press Landmine", description: "Empuje diagonal para hombro y pecho superior." },
      { name: "Shrugs", description: "Trapecio superior como accesorio de empuje." },
    ],
  },
  {
    id: "push-4",
    type: "Push",
    day: "Día 4",
    focus: "Volumen dinámico",
    exercises: [
      { name: "Press Inclinado Barra", description: "Prioridad al pectoral superior." },
      { name: "Push Press", description: "Empuje explosivo de hombros." },
      { name: "Cruce de Poleas Bajas", description: "Línea ascendente para pecho superior." },
      { name: "Face Pulls", description: "Higiene escapular y equilibrio del hombro." },
      { name: "Extensión Tríceps Cuerda", description: "Bombeo versátil y control de codos." },
      { name: "Dips en Banco", description: "Aislamiento sencillo de tríceps." },
      { name: "Rueda Abdominal", description: "Estabilidad del core para empujes." },
    ],
  },
  {
    id: "pull-1",
    type: "Pull",
    day: "Día 1",
    focus: "Tracción pesada",
    exercises: [
      { name: "Peso Muerto Convencional", description: "Fuerza total y densidad de espalda." },
      { name: "Dominadas Lastradas", description: "Amplitud dorsal y fuerza vertical." },
      { name: "Remo con Barra", description: "Densidad de espalda media." },
      { name: "Remo Mancuerna 1 Mano", description: "Trabajo unilateral y estabilidad." },
      { name: "Curl Bíceps Barra", description: "Fuerza básica para brazos." },
      { name: "Face Pulls", description: "Deltoides posterior y salud del hombro." },
      { name: "Curl Martillo", description: "Braquial, bíceps y antebrazo." },
    ],
  },
  {
    id: "pull-2",
    type: "Pull",
    day: "Día 2",
    focus: "Hipertrofia y aislamiento",
    exercises: [
      { name: "Jalón al Pecho", description: "Dorsales con técnica controlada." },
      { name: "Remo en T Apoyado", description: "Espalda media sin fatiga lumbar." },
      { name: "Pullover con Cuerda", description: "Aislamiento de dorsales." },
      { name: "Pec Deck Inverso", description: "Deltoides posterior específico." },
      { name: "Curl Predicador", description: "Bíceps estricto sin balanceo." },
      { name: "Remo Gironda", description: "Tracción horizontal con recorrido amplio." },
      { name: "Curls de Muñeca", description: "Agarre y estética de antebrazo." },
    ],
  },
  {
    id: "pull-3",
    type: "Pull",
    day: "Día 3",
    focus: "Detalle de espalda y bíceps",
    exercises: [
      { name: "Remo en Máquina", description: "Máxima estabilidad para espalda." },
      { name: "Jalón Agarre Estrecho", description: "Parte baja del dorsal." },
      { name: "Remo al Mentón", description: "Trapecio y deltoides lateral." },
      { name: "Bayesian Curl", description: "Bíceps en estiramiento." },
      { name: "Shrugs", description: "Trapecio superior." },
      { name: "Curl Araña", description: "Contracción máxima del bíceps." },
      { name: "Paseo del Granjero", description: "Agarre y estabilidad total." },
    ],
  },
  {
    id: "pull-4",
    type: "Pull",
    day: "Día 4",
    focus: "Volumen dinámico",
    exercises: [
      { name: "Dominadas BW / Asistidas", description: "Volumen para dorsales y fuerza relativa." },
      { name: "Remo Barra Supino", description: "Mayor participación de bíceps." },
      { name: "Jalón Unilateral", description: "Conexión mente-músculo y rango." },
      { name: "Curls en Polea", description: "Tensión constante del bíceps." },
      { name: "Face Pulls Variante", description: "Rotadores externos y deltoides posterior." },
      { name: "Remo Meadows", description: "Ángulo único para densidad de espalda." },
      { name: "Dead Hangs", description: "Hombros y agarre." },
    ],
  },
  {
    id: "legs-1",
    type: "Legs",
    day: "Día 1",
    focus: "Fuerza y masa",
    exercises: [
      { name: "Sentadilla Libre", description: "Base para masa general de piernas." },
      { name: "Peso Muerto Rumano", description: "Isquios, glúteos y bisagra de cadera." },
      { name: "Prensa Inclinada", description: "Sobrecarga estable y segura." },
      { name: "Curl Isquio Sentado", description: "Aislamiento en estiramiento." },
      { name: "Extensión Cuádriceps", description: "Final directo para cuádriceps." },
      { name: "Gemelos de Pie", description: "Gastrocnemio visible." },
      { name: "Abductores Máquina", description: "Cadera y estabilidad lateral." },
    ],
  },
  {
    id: "legs-2",
    type: "Legs",
    day: "Día 2",
    focus: "Hipertrofia y estabilidad",
    exercises: [
      { name: "Sentadilla Hack", description: "Cuádriceps con mínima fatiga lumbar." },
      { name: "Hip Thrust", description: "Glúteo mayor en contracción." },
      { name: "Zancadas Caminando", description: "Trabajo unilateral dinámico." },
      { name: "Curl Isquio Tumbado", description: "Contracción del isquio." },
      { name: "Sissy Squat", description: "Estiramiento extremo del cuádriceps." },
      { name: "Gemelos Sentado", description: "Énfasis en sóleo." },
      { name: "Plancha / Deadbug", description: "Core para cargas pesadas." },
    ],
  },
  {
    id: "legs-3",
    type: "Legs",
    day: "Día 3",
    focus: "Cadena posterior",
    exercises: [
      { name: "Peso Muerto Piernas Rígidas", description: "Estiramiento máximo de isquios." },
      { name: "Sentadilla Búlgara", description: "Unilateral intenso para glúteos y cuádriceps." },
      { name: "Glute Ham Raise / Nordic", description: "Fuerza excéntrica de isquios." },
      { name: "Prensa Pies Altos", description: "Mayor énfasis en glúteos e isquios." },
      { name: "Hiperextensiones 45°", description: "Glúteos y erectores." },
      { name: "Gemelos en Prensa", description: "Variedad de ángulo para gemelos." },
      { name: "Tibial Anterior", description: "Salud del tobillo y equilibrio muscular." },
    ],
  },
  {
    id: "legs-4",
    type: "Legs",
    day: "Día 4",
    focus: "Detalle y volumen",
    exercises: [
      { name: "Sentadilla Frontal / Goblet", description: "Cuádriceps y core." },
      { name: "Step Ups", description: "Fuerza unilateral y cadera estable." },
      { name: "Curl Isquio de Pie", description: "Aislamiento unilateral." },
      { name: "Prensa de Glúteo", description: "Aislamiento específico de glúteo." },
      { name: "Extensión Cuádriceps Unilateral", description: "Corrección de desequilibrios." },
      { name: "Gemelos Alto Volumen", description: "Resistencia y bombeo final." },
      { name: "Rueda Abdominal", description: "Estabilidad central y salud lumbar." },
    ],
  },
];

const TYPE_META: Record<RoutineType, { accent: string; bg: string; ink: string; label: string }> = {
  "Full Body": { accent: "#d99a24", bg: "#fff4dc", ink: "#5a3b00", label: "Cuerpo completo" },
  Push: { accent: "#2a6fbb", bg: "#eaf4ff", ink: "#113d68", label: "Empuje" },
  Pull: { accent: "#23844c", bg: "#e9f7ef", ink: "#0d4d2a", label: "Tracción" },
  Legs: { accent: "#bd3a2e", bg: "#fff0ed", ink: "#6b1c15", label: "Piernas" },
};

function pickRandomSession(currentId?: string) {
  if (ROUTINES.length === 1) return ROUTINES[0];
  let next = ROUTINES[Math.floor(Math.random() * ROUTINES.length)];
  while (next.id === currentId) {
    next = ROUTINES[Math.floor(Math.random() * ROUTINES.length)];
  }
  return next;
}

function youtubeSearchUrl(exerciseName: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${exerciseName} técnica ejercicio gimnasio`)}`;
}

type ExerciseRow = { peso: string; series: string; reps: string; rir: string };

function SessionTable({
  session,
  formKey,
  rows,
  onRowChange,
}: {
  session: Session;
  formKey: number;
  rows: ExerciseRow[];
  onRowChange: (index: number, field: keyof ExerciseRow, value: string) => void;
}) {
  const meta = TYPE_META[session.type];

  return (
    <section className="session-sheet" style={{ ["--accent" as string]: meta.accent }} key={`${session.id}-${formKey}`}>
      <div className="sheet-topline">
        <div>
          <span className="routine-kicker">Rutina seleccionada</span>
          <h2>{session.type} · {session.day}</h2>
          <p>{session.focus}</p>
        </div>
        <div className="sheet-code">
          <span>{meta.label}</span>
          <strong>{session.exercises.length} ejercicios</strong>
        </div>
      </div>

      <div className="table-wrap">
        <table className="training-table">
          <thead>
            <tr>
              <th className="exercise-col">Ejercicio</th>
              <th>Descripción técnica</th>
              <th>Peso</th>
              <th>Series</th>
              <th>Reps</th>
              <th>RIR / Nota</th>
            </tr>
          </thead>
          <tbody>
            {session.exercises.map((exercise, index) => (
              <tr key={exercise.name} style={{ animationDelay: `${index * 45}ms` }}>
                <td className="exercise-cell">
                  <span className="exercise-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="exercise-name-line">
                    <strong>{exercise.name}</strong>
                    <a
                      className="youtube-link"
                      href={youtubeSearchUrl(exercise.name)}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Buscar ${exercise.name} en YouTube`}
                    >
                      YouTube <ExternalLink size={13} />
                    </a>
                  </span>
                </td>
                <td className="description-cell">{exercise.description}</td>
                <td><input aria-label={`Peso para ${exercise.name}`} placeholder="kg" value={rows[index]?.peso ?? ""} onChange={(e) => onRowChange(index, "peso", e.target.value)} /></td>
                <td><input aria-label={`Series para ${exercise.name}`} placeholder="4" value={rows[index]?.series ?? ""} onChange={(e) => onRowChange(index, "series", e.target.value)} /></td>
                <td><input aria-label={`Repeticiones para ${exercise.name}`} placeholder="8-12" value={rows[index]?.reps ?? ""} onChange={(e) => onRowChange(index, "reps", e.target.value)} /></td>
                <td><input aria-label={`Nota para ${exercise.name}`} placeholder="RIR 1-2" value={rows[index]?.rir ?? ""} onChange={(e) => onRowChange(index, "rir", e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function emptyRows(count: number): ExerciseRow[] {
  return Array.from({ length: count }, () => ({ peso: "", series: "", reps: "", rir: "" }));
}

export default function Home() {
  const { currentUser } = useAuth();
  const [selected, setSelected] = useState<Session | null>(ROUTINES[0]);
  const [rolling, setRolling] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [history, setHistory] = useState<Session[]>([]);
  const [rows, setRows] = useState<ExerciseRow[]>(() => emptyRows(ROUTINES[0].exercises.length));

  const stats = useMemo(() => {
    return [
      { label: "Rutinas base", value: "4" },
      { label: "Variaciones", value: ROUTINES.length.toString() },
      { label: "Ejercicios por sesión", value: "7" },
    ];
  }, []);

  const rollSession = () => {
    setRolling(true);
    window.setTimeout(() => {
      const next = pickRandomSession(selected?.id);
      setSelected(next);
      setRows(emptyRows(next.exercises.length));
      setFormKey((value) => value + 1);
      setHistory((items) => [next, ...items.filter((item) => item.id !== next.id)].slice(0, 5));
      setRolling(false);
    }, 520);
  };

  const selectByType = (type: RoutineType) => {
    const options = ROUTINES.filter((session) => session.type === type);
    const next = options[Math.floor(Math.random() * options.length)];
    setSelected(next);
    setRows(emptyRows(next.exercises.length));
    setFormKey((value) => value + 1);
    setHistory((items) => [next, ...items.filter((item) => item.id !== next.id)].slice(0, 5));
  };

  const resetFields = () => {
    setFormKey((value) => value + 1);
    if (selected) setRows(emptyRows(selected.exercises.length));
  };

  const handleRowChange = (index: number, field: keyof ExerciseRow, value: string) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  };

  const handleDownloadCsv = () => {
    const logs = getAllWorkoutLogs();
    if (logs.length === 0) {
      toast.info("No hay entrenamientos guardados aún.");
      return;
    }
    const header = ["id", "usuario", "fecha", "sesion_id", "tipo", "dia", "enfoque", "ejercicio", "peso", "series", "reps", "rir"];
    const rowsCsv: string[] = [];
    for (const log of logs) {
      for (const ex of log.exercises) {
        rowsCsv.push([
          log.id,
          log.userId,
          log.date,
          log.sessionId,
          log.sessionType,
          log.sessionDay,
          log.sessionFocus,
          ex.name,
          ex.peso,
          ex.series,
          ex.reps,
          ex.rir,
        ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
      }
    }
    const csv = [header.join(","), ...rowsCsv].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `entrenamientos_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (!selected) return;
    const userId = currentUser ?? "anonymous";
    const exercises: ExerciseLog[] = selected.exercises.map((ex, i) => ({
      name: ex.name,
      peso: rows[i]?.peso ?? "",
      series: rows[i]?.series ?? "",
      reps: rows[i]?.reps ?? "",
      rir: rows[i]?.rir ?? "",
    }));
    saveWorkoutLog(userId, selected.id, selected.type, selected.day, selected.focus, exercises);
    toast.success("Entrenamiento guardado", {
      description: `${selected.type} · ${selected.day} — ${new Date().toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" })}`,
    });
  };

  return (
    <main className="min-h-screen app-shell" style={{ backgroundImage: `linear-gradient(90deg, rgba(247,248,244,0.94), rgba(247,248,244,0.86)), url(${PAPER_URL})` }}>
      <section className="hero-grid">
        <aside className="control-panel">
          <div className="brand-lockup">
            <div className="brand-mark"><Dumbbell size={22} /></div>
            <div>
              <p>Workout Generator</p>
              <strong>Bitácora aleatoria</strong>
            </div>
          </div>

          <div className="dice-card">
            <img src={DICE_URL} alt="Dado de entrenamiento" className={rolling ? "dice rolling" : "dice"} />
            <span className="panel-label">Generador tipo dado</span>
            <h1>Genera tu sesión de entrenamiento.</h1>
            <p>
              Pulsa el botón para seleccionar al azar una variación de <strong>Full Body, Push, Pull o Legs</strong> y registrar tu progreso de la sesión.
            </p>
            <button className="roll-button" onClick={rollSession} disabled={rolling}>
              <Dice5 size={22} />
              {rolling ? "Lanzando dado..." : "Lanzar dado"}
            </button>
          </div>

          <div className="quick-picks" aria-label="Selección rápida por tipo de rutina">
            {(Object.keys(TYPE_META) as RoutineType[]).map((type) => (
              <button key={type} onClick={() => selectByType(type)} style={{ ["--accent" as string]: TYPE_META[type].accent, ["--soft" as string]: TYPE_META[type].bg }}>
                <span>{type}</span>
                <small>{TYPE_META[type].label}</small>
              </button>
            ))}
          </div>

          <div className="stats-grid">
            {stats.map((item) => (
              <div key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </aside>

        <section className="workspace">
          <div className="workspace-header">
            <div>
              <span className="panel-label"><Sparkles size={15} /> Selección lista para entrenar</span>
              <h2>Sesión actual con tabla de registro</h2>
            </div>
            <div className="action-row">
              <button onClick={resetFields} className="ghost-button"><RotateCcw size={17} /> Limpiar</button>
              <button onClick={handleSave} className="ghost-button save-button" disabled={!selected}><Save size={17} /> Guardar entrenamiento</button>
              <button onClick={handleDownloadCsv} className="ghost-button"><Download size={17} /> Descargar CSV</button>
            </div>
          </div>

          {selected ? <SessionTable session={selected} formKey={formKey} rows={rows} onRowChange={handleRowChange} /> : (
            <div className="empty-sheet">
              <ClipboardList size={44} />
              <p>Pulsa el dado para generar una sesión.</p>
            </div>
          )}

          <div className="lower-grid">
            <div className="source-card">
              <img src={SHEETS_URL} alt="Ilustración de hojas de rutina" />
              <div>
                <span className="panel-label">Base de rutinas</span>
                <h3>Push · Pull · Legs · Full Body</h3>
                <p>La sesión se toma de las hojas creadas previamente y se presenta en una tabla editable para anotar peso, series, repeticiones y notas.</p>
              </div>
            </div>

            <div className="history-card">
              <span className="panel-label">Últimas selecciones</span>
              {history.length === 0 ? (
                <p className="muted">Todavía no hay historial. Lanza el dado para comenzar.</p>
              ) : (
                <ul>
                  {history.map((item) => (
                    <li key={item.id} style={{ ["--accent" as string]: TYPE_META[item.type].accent }}>
                      <span>{item.type}</span>
                      <strong>{item.day} · {item.focus}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
