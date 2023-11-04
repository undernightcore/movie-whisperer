import type { RequestHandler } from '@sveltejs/kit';
import { processService } from '$lib/server/services/process.service';
import { error, json } from '@sveltejs/kit';

export const POST: RequestHandler = () => {
	if (processService.isCurrentProcessing)
		throw error(400, 'There is currently a process taking place. Please wait.');

	console.info('Processing has started');
	processService.startProcessing().then(() => {
		console.info('Processing has stopped');
	});

	return json({ message: 'Processing has started!' });
};
