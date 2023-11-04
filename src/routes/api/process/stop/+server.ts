import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { processService } from '$lib/server/services/process.service';

export const POST: RequestHandler = () => {
	if (!processService.isCurrentProcessing) throw error(400, 'There is no process to cancel.');

	processService.stopProcessing();

	return json({ message: 'Process has been cancelled' });
};
