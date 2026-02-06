export interface StoredSession {
	sessionId: string;
	username: string;
}

const SESSIONS_KEY = "sessions";
const ACTIVE_SESSION_KEY = "activeSessionId";

export function getSessions(): StoredSession[] {
	try {
		const data = localStorage.getItem(SESSIONS_KEY);
		return data ? JSON.parse(data) : [];
	} catch {
		return [];
	}
}

export function saveSessions(sessions: StoredSession[]): void {
	localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function getActiveSessionId(): string | null {
	return localStorage.getItem(ACTIVE_SESSION_KEY);
}

export function saveActiveSessionId(sessionId: string | null): void {
	if (sessionId) {
		localStorage.setItem(ACTIVE_SESSION_KEY, sessionId);
	} else {
		localStorage.removeItem(ACTIVE_SESSION_KEY);
	}
}

export function addSession(session: StoredSession): void {
	const sessions = getSessions();
	const existingIndex = sessions.findIndex(
		(s) => s.username === session.username,
	);
	if (existingIndex >= 0) {
		sessions[existingIndex] = session;
	} else {
		sessions.push(session);
	}
	saveSessions(sessions);
	saveActiveSessionId(session.sessionId);
}

export function removeSession(sessionId: string): StoredSession[] {
	const sessions = getSessions().filter((s) => s.sessionId !== sessionId);
	saveSessions(sessions);

	const activeId = getActiveSessionId();
	if (activeId === sessionId) {
		const nextSession = sessions[0] ?? null;
		saveActiveSessionId(nextSession?.sessionId ?? null);
	}

	return sessions;
}

export function clearSessionCookie(): void {
	document.cookie = "session_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}
