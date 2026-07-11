type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
	level: LogLevel;
	timestamp: string;
	message: string;
	[key: string]: unknown;
}

function formatLog(level: LogLevel, message: string, extra?: Record<string, unknown>) {
	const entry: LogEntry = {
		level,
		timestamp: new Date().toISOString(),
		message,
		...extra,
	};
	return JSON.stringify(entry);
}

export const logger = {
	debug(message: string, extra?: Record<string, unknown>) {
		console.debug(formatLog("debug", message, extra));
	},
	info(message: string, extra?: Record<string, unknown>) {
		console.info(formatLog("info", message, extra));
	},
	log(message: string, extra?: Record<string, unknown>) {
		console.log(formatLog("info", message, extra));
	},
	warn(message: string, extra?: Record<string, unknown>) {
		console.warn(formatLog("warn", message, extra));
	},
	error(message: string, error?: unknown, extra?: Record<string, unknown>) {
		const errorExtra: Record<string, unknown> = {};
		if (error instanceof Error) {
			errorExtra.errorName = error.name;
			errorExtra.errorMessage = error.message;
			errorExtra.stack = error.stack;
		} else if (error !== undefined) {
			errorExtra.error = error;
		}
		console.error(formatLog("error", message, { ...errorExtra, ...extra }));
	},
};
