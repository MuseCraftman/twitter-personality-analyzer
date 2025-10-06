/**
 * Cool Console Logger
 * A comprehensive logging utility with colors, timestamps, and multiple log levels
 */

export enum LogLevel {
	DEBUG = 0,
	INFO = 1,
	WARN = 2,
	ERROR = 3,
	SUCCESS = 4
}

export interface LoggerConfig {
	level: LogLevel;
	showTimestamp: boolean;
	showLevel: boolean;
	showEmoji: boolean;
	enableColors: boolean;
	prefix?: string;
}

export class CoolLogger {
	private config: LoggerConfig;
	private colors = {
		reset: '\x1b[0m',
		bright: '\x1b[1m',
		dim: '\x1b[2m',
		red: '\x1b[1m\x1b[31m',
		green: '\x1b[1m\x1b[32m',
		yellow: '\x1b[1m\x1b[33m',
		blue: '\x1b[1m\x1b[34m',
		magenta: '\x1b[1m\x1b[35m',
		cyan: '\x1b[1m\x1b[36m',
		white: '\x1b[1m\x1b[37m',
		bgRed: '\x1b[1m\x1b[41m',
		bgGreen: '\x1b[1m\x1b[42m',
		bgYellow: '\x1b[1m\x1b[43m',
		bgBlue: '\x1b[1m\x1b[44m',
		bgMagenta: '\x1b[1m\x1b[45m',
		bgCyan: '\x1b[1m\x1b[46m'
	};

	private emojis = {
		debug: '🐛',
		info: 'ℹ️',
		warn: '⚠️',
		error: '❌',
		success: '✅'
	};

	constructor(config: Partial<LoggerConfig> = {}) {
		this.config = {
			level: LogLevel.INFO,
			showTimestamp: true,
			showLevel: true,
			showEmoji: true,
			enableColors: true,
			...config
		};
	}

	private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
		const timestamp = this.config.showTimestamp ? this.getTimestamp() : '';
		const levelName = this.getLevelName(level);
		const emoji = this.config.showEmoji
			? this.emojis[levelName.toLowerCase() as keyof typeof this.emojis]
			: '';
		const prefix = this.config.prefix ? `[${this.config.prefix}]` : '';

		const parts = [
			timestamp,
			prefix,
			emoji,
			this.config.showLevel ? `[${levelName}]` : '',
			message
		].filter(Boolean);

		return parts.join(' ');
	}

	private getTimestamp(): string {
		const now = new Date();
		const time = now.toLocaleTimeString('en-US', {
			hour12: false,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
		const ms = now.getMilliseconds().toString().padStart(3, '0');
		return this.colorize(`[${time}.${ms}]`, 'dim');
	}

	private getLevelName(level: LogLevel): string {
		const names = {
			[LogLevel.DEBUG]: 'DEBUG',
			[LogLevel.INFO]: 'INFO',
			[LogLevel.WARN]: 'WARN',
			[LogLevel.ERROR]: 'ERROR',
			[LogLevel.SUCCESS]: 'SUCCESS'
		};
		return names[level];
	}

	private getLevelColor(level: LogLevel): string {
		const colors = {
			[LogLevel.DEBUG]: 'cyan',
			[LogLevel.INFO]: 'blue',
			[LogLevel.WARN]: 'yellow',
			[LogLevel.ERROR]: 'red',
			[LogLevel.SUCCESS]: 'green'
		};
		return colors[level];
	}

	private colorize(text: string, color: keyof typeof this.colors): string {
		if (!this.config.enableColors) return text;
		return `${this.colors[color]}${text}${this.colors.reset}`;
	}

	private shouldLog(level: LogLevel): boolean {
		return level >= this.config.level;
	}

	private log(level: LogLevel, message: string, ...args: any[]): void {
		if (!this.shouldLog(level)) return;

		const formattedMessage = this.formatMessage(level, message);
		const levelColor = this.getLevelColor(level);
		const coloredMessage = this.colorize(formattedMessage, levelColor as keyof typeof this.colors);

		console.log(coloredMessage, ...args);
	}

	// Public logging methods
	debug(message: string, ...args: any[]): void {
		this.log(LogLevel.DEBUG, message, ...args);
	}

	info(message: string, ...args: any[]): void {
		this.log(LogLevel.INFO, message, ...args);
	}

	warn(message: string, ...args: any[]): void {
		this.log(LogLevel.WARN, message, ...args);
	}

	error(message: string, ...args: any[]): void {
		this.log(LogLevel.ERROR, message, ...args);
	}

	success(message: string, ...args: any[]): void {
		this.log(LogLevel.SUCCESS, message, ...args);
	}

	// Special logging methods
	table(data: any): void {
		if (this.shouldLog(LogLevel.INFO)) {
			console.table(data);
		}
	}

	group(label: string): void {
		if (this.shouldLog(LogLevel.INFO)) {
			console.group(this.colorize(label, 'cyan'));
		}
	}

	groupEnd(): void {
		if (this.shouldLog(LogLevel.INFO)) {
			console.groupEnd();
		}
	}

	trace(message: string, ...args: any[]): void {
		if (this.shouldLog(LogLevel.DEBUG)) {
			console.trace(this.colorize(message, 'magenta'), ...args);
		}
	}

	// Banner and special effects
	banner(text: string, color: keyof typeof this.colors = 'cyan'): void {
		if (!this.shouldLog(LogLevel.INFO)) return;

		const border = '═'.repeat(text.length + 4);
		const topBorder = this.colorize(`╔${border}╗`, color);
		const bottomBorder = this.colorize(`╚${border}╝`, color);
		const content = this.colorize(`║ ${text} ║`, color);

		console.log('\n' + topBorder);
		console.log(content);
		console.log(bottomBorder + '\n');
	}

	progress(current: number, total: number, message: string = 'Progress'): void {
		if (!this.shouldLog(LogLevel.INFO)) return;

		const percentage = Math.round((current / total) * 100);
		const barLength = 20;
		const filledLength = Math.round((current / total) * barLength);
		const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);

		const progressText = `${message}: [${bar}] ${percentage}% (${current}/${total})`;
		process.stdout.write(`\r${this.colorize(progressText, 'green')}`);

		if (current === total) {
			process.stdout.write('\n');
		}
	}

	// Configuration methods
	setLevel(level: LogLevel): void {
		this.config.level = level;
	}

	setPrefix(prefix: string): void {
		this.config.prefix = prefix;
	}

	enableColors(enable: boolean): void {
		this.config.enableColors = enable;
	}

	enableEmojis(enable: boolean): void {
		this.config.showEmoji = enable;
	}

	enableTimestamp(enable: boolean): void {
		this.config.showTimestamp = enable;
	}
}

// Create default logger instance
export const logger = new CoolLogger();

// Export convenience functions
export const {
	debug,
	info,
	warn,
	error,
	success,
	table,
	group,
	groupEnd,
	trace,
	banner,
	progress
} = logger;

// Export for easy importing
export default logger;
