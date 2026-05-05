export type ExerciseLog = {
  name: string;
  peso: string;
  series: string;
  reps: string;
  rir: string;
};

export type WorkoutLog = {
  id: string;
  userId: string;
  date: string; // ISO string
  sessionId: string;
  sessionType: string;
  sessionDay: string;
  sessionFocus: string;
  exercises: ExerciseLog[];
};

const STORAGE_KEY = "wg_workout_logs";

function loadLogs(): WorkoutLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as WorkoutLog[];
  } catch {
    // ignore parse errors
  }
  return [];
}

function persistLogs(logs: WorkoutLog[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export function saveWorkoutLog(
  userId: string,
  sessionId: string,
  sessionType: string,
  sessionDay: string,
  sessionFocus: string,
  exercises: ExerciseLog[]
): WorkoutLog {
  const log: WorkoutLog = {
    id: crypto.randomUUID(),
    userId,
    date: new Date().toISOString(),
    sessionId,
    sessionType,
    sessionDay,
    sessionFocus,
    exercises,
  };
  const logs = loadLogs();
  logs.unshift(log);
  persistLogs(logs);
  return log;
}

export function getWorkoutLogsByUser(userId: string): WorkoutLog[] {
  return loadLogs().filter((l) => l.userId === userId);
}

export function getAllWorkoutLogs(): WorkoutLog[] {
  return loadLogs();
}
