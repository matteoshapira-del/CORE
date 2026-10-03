import { pickTodayRoutine, listRoutineOptions } from './routine.js';
import { getFlexRoutine } from './flex.js';
import { getBookendRoutine } from './bookends.js';

// Routines are passed around by id; rebuild the object from it.
// Order: bookends, Core Flex, today's pick, alternates, fallback to today.
export function resolveRoutine(state, routineId) {
  const bookend = getBookendRoutine(routineId, state);
  if (bookend) return bookend;
  const flex = getFlexRoutine(routineId, state);
  if (flex) return flex;
  const today = pickTodayRoutine(state);
  if (today.id === routineId) return today;
  return listRoutineOptions(state).find(r => r.id === routineId) || today;
}
