import type { RequestHandler } from '@sveltejs/kit';
import { processService } from '$lib/server/services/process.service';
import { error, json } from '@sveltejs/kit';
import { getAuthenticatedUser } from '$lib/server/helpers/auth.helper';
import { validateAmountParam } from '$lib/server/validators/amount.validator';

export const POST: RequestHandler = async ({ request, url }) => {
	const user = await getAuthenticatedUser(request);
	if (!user.admin) throw error(403, 'You are not allowed to run this action');

	const amount = validateAmountParam(url.searchParams.get('amount') ?? undefined);

	if (processService.isCurrentProcessing)
		throw error(400, 'There is currently a process taking place. Please wait.');

	console.info('Processing has started');
	processService.startProcessing(amount).then(() => {
		console.info('Processing has stopped');
	});

	return json({ message: 'Processing has started!' });
};
