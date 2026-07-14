type CreateBanReasonProps = {
	reason: string;
	until?: Nullable<Date | string>;
};

const toDate = (value: Date | string): Nullable<Date> => {
	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
};

export const createBanReason = ({ reason, until }: CreateBanReasonProps) => {
	const untilDate = until ? toDate(until) : null;
	const localizedBanDuration = untilDate?.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) ?? null;
	const banDuration = localizedBanDuration ? `до ${localizedBanDuration}` : 'навсегда';

	return `Причина бана (${reason}), бан ${banDuration}, апеллировать в discord.gg/prtcl`;
};
